import { useEffect, useRef, useCallback, useState } from "react";
import { ACTIONS } from "../actions";
import { socketInit } from "../socket";
import freeice from "freeice";
import { useStateWithCallback } from "./useStateWithCallback";

export const useWebRTC = (
  roomId,
  user,
  setDateTimeAfterThreeDays,
  setStartTimeOfChallange,
  setLastTry,
  challangeStartedUserName,
  setChallangeStatedUserName,
  setStartContestLoading
) => {
  //get all the client available in the room
  const [clients, setClients] = useStateWithCallback([]);
  const [challangeTime, setChallangeTime] = useStateWithCallback(0);

  //create a map to store all user info with their audios
  const audioElements = useRef({});
  /*audioElement looks like
    {   userId: instance    }
  */

  //store the peer connections
  const connections = useRef({});

  const clientsRef = useRef(null);

  const socket = useRef(null);

  const localMediaStream = useRef(null);
  /*
                updateStateFunction, callback 
        setClients((prev) => {}, (state)=>{
            //after state update
        })

        this is our custom hook with call back so first it will update the state 
        then callback fun will do its job
    */

  const addNewClient = useCallback(
    (newClient, cb) => {
      const lookingFor = clients.find((client) => client.id === newClient.id);

      if (lookingFor === undefined) {
        setClients((existingClients) => [...existingClients, newClient], cb);
      }
    },
    [clients, setClients]
  );

  useEffect(() => {
    clientsRef.current = clients;
  }, [clients]);

  useEffect(() => {
    const initChat = async () => {
      //initialize the socket with options
      socket.current = socketInit();

      //get the permission of user for media
      await captureMedia();

      // Check the contest is started or not
      lastTryOfProject(false);

      //when new user added mute the user and set the localMediaStream
      addNewClient({ ...user, muted: true }, () => {
        const localElement = audioElements.current[user.id];
        if (localElement) {
          localElement.volume = 0;
          localElement.srcObject = localMediaStream.current;
        }
      });

      socket.current.on(ACTIONS.MUTE_INFO, ({ userId, isMute }) => {
        handleSetMute(isMute, userId);
      });

      socket.current.on(ACTIONS.ADD_PEER, handleNewPeer);
      socket.current.on(ACTIONS.REMOVE_PEER, handleRemovePeer);
      socket.current.on(ACTIONS.ICE_CANDIDATE, handleIceCandidate);
      socket.current.on(ACTIONS.SESSION_DESCRIPTION, setRemoteMedia);
      socket.current.on(ACTIONS.MUTE, ({ peerId, userId }) => {
        handleSetMute(true, userId);
      });
      socket.current.on(ACTIONS.UN_MUTE, ({ peerId, userId }) => {
        handleSetMute(false, userId);
      });
      socket.current.emit(ACTIONS.JOIN, {
        roomId,
        user,
      });

      async function captureMedia() {
        // Start capturing local audio stream.
        localMediaStream.current = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
      }
      async function handleNewPeer({ peerId, createOffer, user: remoteUser }) {
        //if client already connected then give warning
        if (peerId in connections.current) {
          /*connections = {
                socketId: connection(webRtc object)
            }*/
          return console.warn(
            `You are already connected with ${peerId} (${user.name})`
          );
        }

        // Store it to connections
        connections.current[peerId] = new RTCPeerConnection({
          iceServers: freeice(),
        });

        // Handle new ice candidate on this peer connection
        connections.current[peerId].onicecandidate = (event) => {
          socket.current.emit(ACTIONS.RELAY_ICE, {
            peerId,
            icecandidate: event.candidate,
          });
        };

        // Handle on track event on this connection
        connections.current[peerId].ontrack = ({ streams: [remoteStream] }) => {
          addNewClient({ ...remoteUser, muted: true }, () => {
            // get current users mute info
            const currentUser = clientsRef.current.find(
              (client) => client.id === user.id
            );

            if (currentUser) {
              socket.current.emit(ACTIONS.MUTE_INFO, {
                userId: user.id,
                roomId,
                isMute: currentUser.muted,
              });
            }

            //checking if audio player already created for the current user or not
            if (audioElements.current[remoteUser.id]) {
              audioElements.current[remoteUser.id].srcObject = remoteStream;
            } else {
              let settled = false;
              const interval = setInterval(() => {
                //sometime it take time to render the audio so incase the
                //audio is not present then check again and again after 1s
                if (audioElements.current[remoteUser.id]) {
                  audioElements.current[remoteUser.id].srcObject = remoteStream;
                  settled = true;
                }

                if (settled) {
                  //if the user audio is successfully set then
                  //flag will set as true and it will clear this interval
                  clearInterval(interval);
                }
              }, 300);
            }
          });
        };

        // Add connection to peer connections track
        localMediaStream.current.getTracks().forEach((track) => {
          connections.current[peerId].addTrack(track, localMediaStream.current);
        });

        // Create an offer if required
        if (createOffer) {
          const offer = await connections.current[peerId].createOffer();

          // Set the offer in local description
          await connections.current[peerId].setLocalDescription(offer);

          // send offer to the server
          socket.current.emit(ACTIONS.RELAY_SDP, {
            peerId,
            sessionDescription: offer,
          });
        }
      }
      async function handleRemovePeer({ peerId, userId }) {
        // Close the peerId and remove the user
        if (connections.current[peerId]) {
          connections.current[peerId].close();
        }
        // Remove the connections
        delete connections.current[peerId];
        // Delete the object of audio
        delete audioElements.current[peerId];
        // Remove from the client list also
        setClients((list) => list.filter((c) => c.id !== userId));
      }
      async function handleIceCandidate({ peerId, icecandidate }) {
        if (icecandidate) {
          connections.current[peerId].addIceCandidate(icecandidate);
        }
      }
      async function setRemoteMedia({
        peerId,
        sessionDescription: remoteSessionDescription,
      }) {
        connections.current[peerId].setRemoteDescription(
          new RTCSessionDescription(remoteSessionDescription)
        );

        // If session descrition is offer then create an answer
        if (remoteSessionDescription.type === "offer") {
          const connection = connections.current[peerId];

          const answer = await connection.createAnswer();
          // Set the answer in localdescription
          connection.setLocalDescription(answer);

          // Send it to other client
          socket.current.emit(ACTIONS.RELAY_SDP, {
            peerId,
            sessionDescription: answer,
          });
        }
      }
      async function handleSetMute(mute, userId) {
        // Converting the clientsRef.current object array to id's of array and finding the index of the userId to be mute
        const clientIdx = clientsRef.current
          .map((client) => client.id)
          .indexOf(userId);

        // Copy the obj
        const allConnectedClients = JSON.parse(
          JSON.stringify(clientsRef.current)
        );

        if (clientIdx > -1) {
          allConnectedClients[clientIdx].muted = mute;
          setClients(allConnectedClients);
        }
      }
    };

    initChat();
    return () => {
      // Stop all the track from different browser
      localMediaStream.current.getTracks().forEach((track) => track.stop());
      socket.current.emit(ACTIONS.LEAVE, { roomId });
      // Delete all the peerId from the array
      for (let peerId in connections.current) {
        connections.current[peerId].close();
        delete connections.current[peerId];
        delete audioElements.current[peerId];
      }
      // Off all the sockets
      socket.current.off(ACTIONS.ADD_PEER);
      socket.current.off(ACTIONS.REMOVE_PEER);
      socket.current.off(ACTIONS.ICE_CANDIDATE);
      socket.current.off(ACTIONS.SESSION_DESCRIPTION);
      socket.current.off(ACTIONS.MUTE);
      socket.current.off(ACTIONS.UN_MUTE);
    };
  }, []);

  function doHomework(roomChallangeTime, callback) {
    // console.log("username", challangeStartedUserName);
    socket.current.emit(
      "setChallangeTime",
      roomChallangeTime,
      roomId,
      challangeStartedUserName
    );
    socket.current.on("getChallangeStartedUserName", (userName) => {
      setChallangeStatedUserName(userName);
    });
    callback();
  }

  // Get info of challange time
  function testingTry(roomChallangeTime) {
    // Set the challange time in state to access everywhere
    setChallangeTime(roomChallangeTime);
    doHomework(roomChallangeTime, function () {
      socket.current.emit("challangeTime", challangeTime, roomId);
    });

    let startMinute = new Date().getMinutes();
    let startSecond = new Date().getSeconds();
    setStartTimeOfChallange({ startMinute, startSecond });

    socket.current.on("getTime", (time) => {
      const NOW_IN_MS = new Date().getTime();
      //   console.log("testing time", NOW_IN_MS + time.timeInMiliSecond);
      setDateTimeAfterThreeDays(NOW_IN_MS + time.timeInMiliSecond);
    });

    // Stop the Loader
    setTimeout(() => {
      setStartContestLoading(false);
    }, 2000);
  }

  async function challangeTimeDetails() {
    // Start the loader
    setStartContestLoading(true);

    lastTryOfProject(true);
  }

  function lastTryOfProject(val) {
    socket.current.emit("checkChallange", roomId, val);
    socket.current.on("getCheckChallange", (tryButton) => {
      setLastTry(tryButton);
    });
  }

  // Store user audio
  const provideRef = (instance, userId) => {
    // Set the audio instance with userId
    audioElements.current[userId] = instance;
  };

  // Handling mute
  const handleMute = (isMute, userId) => {
    // Take the first element and set audio mute and unmute
    let settled = false;

    if (userId === user.id) {
      let interval = setInterval(() => {
        if (localMediaStream.current) {
          // Mute and unmute the current user stream with the toggle value
          localMediaStream.current.getTracks()[0].enabled = !isMute;
          // If user mute the mike then it should be reflect on other user page also
          if (isMute) {
            socket.current.emit(ACTIONS.MUTE, {
              roomId,
              userId: user.id,
            });
          } else {
            socket.current.emit(ACTIONS.UN_MUTE, {
              roomId,
              userId: user.id,
            });
          }
          settled = true;
        }
        if (settled) {
          clearInterval(interval);
        }
      }, 200);
    }
  };

  return {
    clients,
    provideRef,
    handleMute,
    challangeTimeDetails,
    testingTry,
  };
};
