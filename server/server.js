// setting the dotenv file
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
//initializing express module here
const app = express();
//connecting the database here
const DbConnect = require("./database");
//setting the routes here
const routes = require("./routes/routes");
//setting the cors module
const cors = require("cors");
const cookieParser = require("cookie-parser");
const ACTIONS = require("./actions");
//create a server and pass the app to connect with one server
const server = require("http").createServer(app);
const roomService = require("./services/room-service");

//set the webSocket server
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

//setting the cookies to use it in our project
app.use(cookieParser());

const corsOption = {
  credentials: true,
  origin: ["*"],
};

app.use(cors(corsOption));
app.use("/storage", express.static("storage"));

//initializing the port
const PORT = process.env.PORT || 5500;
//init the database
DbConnect();
app.use(express.json({ limit: "8mb" }));

// setting the routes
app.use("/api", routes);

//Sockets connetion
const socketUserMapping = {
  // this object will map all the socket id with user id
};

const roomChallangeTimeMapping = {};
const roomStartButtonMapping = {};

io.on("connection", (socket) => {
  // When connect a user
  console.log("new connection ", socket.id);
  //   console.log("map bot", roomStartButtonMapping);

  socket.on("checkChallange", (roomId, value) => {
    let checkRoomIdExistInRoomStartButtonMapping =
      roomStartButtonMapping[roomId];

    if (checkRoomIdExistInRoomStartButtonMapping === undefined) {
      roomStartButtonMapping[roomId] = value;
      io.emit("getCheckChallange", roomStartButtonMapping[roomId]);
    } else {
      if (value) {
        roomStartButtonMapping[roomId] = value;
      }
      io.emit("getCheckChallange", roomStartButtonMapping[roomId]);
    }
  });

  // Set the challangeTime on server
  socket.on(
    "setChallangeTime",
    (challangeTime, roomId, challangeStartedUserName) => {
      let checkRoomIdInMap = roomChallangeTimeMapping[roomId];

      if (checkRoomIdInMap === undefined) {
        console.log("thank you krishna", challangeTime);
        let currentTime = new Date();
        let futureTime = new Date(currentTime);
        futureTime.setMinutes(currentTime.getMinutes() + challangeTime);

        let futurnTimeInMiliSecond = futureTime.getTime();

        let timeInMiliSecond = (futureTime - currentTime) / 60000;

        const roomChallangeTimeObj = {
          futurnTimeInMiliSecond,
          timeInMiliSecond,
        };

        // Set the contest time for the room
        roomChallangeTimeMapping[roomId] = roomChallangeTimeObj;

        io.emit("getChallangeStartedUserName", challangeStartedUserName);
      }
    }
  );

  // Send the ChallangeTime to users
  socket.on("challangeTime", (contestTime, roomId) => {
    let roomChallangeTimeFromMap = roomChallangeTimeMapping[roomId];

    // Update the remaining time
    roomChallangeTimeFromMap.timeInMiliSecond =
      roomChallangeTimeFromMap.futurnTimeInMiliSecond - new Date().getTime();

    io.emit("getTime", roomChallangeTimeFromMap);
  });

  //listen the event
  socket.on(ACTIONS.JOIN, ({ roomId, user }) => {
    socketUserMapping[socket.id] = user;

    // io.sockets.adapter.rooms.get(roomId) will return a map so convert it to array
    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
    clients.forEach((clientId) => {
      //send an event to all the client available there i.e a new user joined to the room
      io.to(clientId).emit(ACTIONS.ADD_PEER, {
        peerId: socket.id,
        createOffer: false,
        user,
      });

      //send an event to ourself as we are not connected in the room
      socket.emit(ACTIONS.ADD_PEER, {
        peerId: clientId,
        createOffer: true,
        user: socketUserMapping[clientId],
      });
    });

    //now we are creating a room if not exist then join into the room
    socket.join(roomId);
  });

  //handle relay ice
  socket.on(ACTIONS.RELAY_ICE, ({ peerId, icecandidate }) => {
    //we have to forward the peerId to next client to be connected
    io.to(peerId).emit(ACTIONS.ICE_CANDIDATE, {
      peerId: socket.id,
      icecandidate,
    });
  });

  //handle relay SDP(session description)
  socket.on(ACTIONS.RELAY_SDP, ({ peerId, sessionDescription }) => {
    io.to(peerId).emit(ACTIONS.SESSION_DESCRIPTION, {
      peerId: socket.id,
      sessionDescription,
    });
  });

  //Handle mute/unmute
  socket.on(ACTIONS.MUTE, ({ roomId, userId }) => {
    //get all the clients
    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);

    //iterate over all the clients and send the socketId to all user
    clients.forEach((clientId) => {
      //forward the mute event to all other users
      io.to(clientId).emit(ACTIONS.MUTE, {
        peerId: socket.id,
        userId,
      });
    });
  });

  //unmute user
  socket.on(ACTIONS.UN_MUTE, ({ roomId, userId }) => {
    //get all the clients
    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);

    //iterate over all the clients and send the socketId to all user
    clients.forEach((clientId) => {
      //forward the mute event to all other users
      io.to(clientId).emit(ACTIONS.UN_MUTE, {
        peerId: socket.id,
        userId,
      });
    });
  });

  // Leaving the room
  const leaveRoom = ({ roomId }) => {
    //get all the rooms
    const { rooms } = socket;

    //remove all the clients
    Array.from(rooms).forEach((roomId) => {
      //get all the clients
      const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);

      //remove all the clients
      clients.forEach((clientId) => {
        io.to(clientId).emit(ACTIONS.REMOVE_PEER, {
          peerId: socket.id,
          userId: socketUserMapping[socket.id]?.id,
        });

        //remove yourself from all clients
        socket.emit(ACTIONS.REMOVE_PEER, {
          peerId: clientId,
          userId: socketUserMapping[clientId]?.id,
        });
      });

      //remove youself from the room
      socket.leave(roomId);
      //   console.log("Remaining user in the room", rooms, "are : ", clients);
    });

    //delete from the map also
    delete socketUserMapping[socket.id];
  };
  //if someone leave the room
  socket.on(ACTIONS.LEAVE, leaveRoom);

  //if someone close the browser
  socket.on("disconnecting", leaveRoom);
});

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
