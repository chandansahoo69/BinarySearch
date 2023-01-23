import { useEffect, useState } from "react";
import { useWebRTC } from "../../hooks/useWebRTC";
import { useParams, useHistory, Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { challangeFinished, getRoomDetails } from "../../api";
import "../../components/ChallangeInstruction/Instruction.css";
import { BsMicFill, BsMicMuteFill } from "react-icons/bs";
import { FaUserCircle } from "react-icons/fa";
import { GrCode } from "react-icons/gr";
import { AiOutlineFire, AiFillDelete, AiOutlineCopy } from "react-icons/ai";
import { IoLogOutOutline } from "react-icons/io5";
import { GiStopwatch } from "react-icons/gi";
import { IoIosRocket } from "react-icons/io";
import Loader from "../../components/shared/Loader/Loader";
import Instruction from "../../components/ChallangeInstruction/Instruction";
import QuestionInfo from "../../components/QuestionInfo/QuestionInfo";
import CodeEditor from "../Editor/Editor";
import CountdownTimer from "../../components/CountdownTimer/CountdownTimer";
import { useCountdown } from "../../hooks/useCountdown";
import WinnerModal from "../../components/WinnerModal/WinnerModal";
import { logout } from "../../api";
import copy from "copy-to-clipboard";
import { useDispatch } from "react-redux";
import { setAuth } from "../../store/authSlice";
import DeleteModal from "../../components/DeleteModal/DeleteModal";
import { useNotification } from "../../hooks/useNotification";
import NotificationModal from "../../components/NotificationModal/NotificationModal";

const Room = () => {
  const dispatch = useDispatch();
  const { id: roomId } = useParams();
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);

  const [dateTimeAfterThreeDays, setDateTimeAfterThreeDays] = useState(0);
  const [room, setRoom] = useState(null);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [startTimeOfChallange, setStartTimeOfChallange] = useState({
    startMinute: null,
    startSecond: null,
  });
  console.log(room);
  const [lastTry, setLastTry] = useState(false);
  const [challangeStartedUserName, setChallangeStatedUserName] = useState(null);
  const [winnerDetails, setWinnerDetails] = useState(null);
  const [roomChallangeTime, setRoomChallangeTime] = useState(0);
  const [startContestLoading, setStartContestLoading] = useState(false);
  const { clients, provideRef, handleMute, challangeTimeDetails, testingTry } =
    useWebRTC(
      roomId,
      user,
      setDateTimeAfterThreeDays,
      setStartTimeOfChallange,
      setLastTry,
      user?.username,
      setChallangeStatedUserName,
      setStartContestLoading
    );
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [isMute, setIsMute] = useState(true);
  const [profileSetting, setProfileSetting] = useState(false);
  const [checkFinishedTime, setCheckFinishedTime] = useState(false);
  const [deleteModalState, setDeleteModalState] = useState(false);
  const [copyText, setCopyText] = useState(
    `${process.env.REACT_APP_API_URL}${location.pathname}`
  );
  const { NotificationHandler, closeNotification, showNotification } =
    useNotification();

  function openDeleteModal() {
    setDeleteModalState(!deleteModalState);
  }

  async function testing() {
    const { data } = await challangeFinished({ roomId });

    setWinnerDetails(data.winnerData);
    setAuth(data.updatedUser);
    setShowWinnerModal(true);
  }

  // Show Challange finished Notification
  useEffect(() => {
    if (checkFinishedTime) {
      testing();
    }
  }, [checkFinishedTime]);

  // Mute UnMute user
  useEffect(() => {
    handleMute(isMute, user.id);
  }, [isMute]);

  // Start the timer
  useEffect(() => {
    if (lastTry) {
      testingTry(roomChallangeTime);
    }
  }, [lastTry]);

  // Logout user
  async function logoutUser() {
    try {
      //get the empty data from database
      const { data } = await logout();
      //set it to the store
      dispatch(setAuth(data));
    } catch (error) {
      console.log(error);
    }
  }

  // Copy To Clipboard
  const copyToClipboard = () => {
    copy(copyText);
    NotificationHandler();
  };

  // Show hide setting
  function toggleProfileSetting() {
    setProfileSetting(!profileSetting);
  }

  // Show winner Modal
  function openShowWinnerModal() {
    setShowWinnerModal(!showWinnerModal);
  }

  // Leave Room
  const handleManualLeave = () => {
    history.push("/lobby");
  };

  // Fetch room details
  useEffect(() => {
    const fetchRoomDetails = async () => {
      setLoading(true);
      const { data } = await getRoomDetails(roomId);

      setRoomChallangeTime(data.challangeTime);
      setRoom((prev) => data);
      setLoading(false);
    };

    fetchRoomDetails();
  }, [roomId]);

  // Handle mute button
  const handleMuteClick = (clientId) => {
    //we can only change our mic so if the current user if not matches with the given client id then
    //we can't mute other peoples
    if (clientId !== user.id) return;
    //toggle the value
    setIsMute((isMute) => !isMute);
  };

  if (loading) return <Loader message="Joining the room..." />;

  if (startContestLoading) return <Loader message="Starting Contest ..." />;

  return (
    <>
      <div className="max-w-7xl grid grid-cols-12 bg-codewar">
        {/* Left Pannel */}
        <div className="col-span-3 border-r-2 border-codewar_separator">
          <span className="flex items-center justify-center py-3 font-medium text-lg">
            {!lastTry ? "Instruction" : "Questions"}
          </span>
          <div className="w-full h-0.5 bg-blue-500"></div>
          {!lastTry ? (
            <Instruction />
          ) : (
            <QuestionInfo question={room ? room?.questions[0] : ""} />
          )}

          {/* User Profile badge */}
          <div className="bg-codewar_profilebox w-full h-24 flex items-center p-2.5 shadow-lg">
            <div className="relative flex items-center space-x-4">
              <img
                src={user?.avatar}
                alt="My profile"
                className="w-15 h-15 rounded-full"
              />
              <span className="absolute h-4 w-4 bg-green-300 rounded-full bottom-0 right-0"></span>
            </div>
            <div className="flex-grow pt-2.5 pb-1.5 px-2.5">
              <div className="font-semibold capitalize text-slate-100">
                {user?.fullname}
              </div>
              <span className="flex items-center text-yellow-400 text-md font-medium">
                <AiOutlineFire className="font-bold" />
                &nbsp;XP&nbsp;
                {user?.xp}
              </span>
            </div>
            <div className="p-2 relative">
              <button
                onClick={toggleProfileSetting}
                className="z-10 block bg-codewar_hoverdivbutton rounded-lg p-2 hover:bg-codewar_divbutton shadow-md"
              >
                <svg
                  className="h-6 w-6 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                  />
                </svg>
              </button>
              <div
                className={`${
                  profileSetting ? "absolute" : "hidden"
                } -right-40 bottom-10 mt-2 w-40 bg-codewar border border-codewar_separator rounded-md overflow-hidden shadow-xl z-20`}
              >
                <button
                  onClick={logoutUser}
                  className="flex items-center w-full capitalize gap-2 px-4 py-2 text-md text-white hover:bg-codewar_hoverdivbutton"
                >
                  <IoLogOutOutline className="text-slate-10 text-lg" />
                  logout
                </button>
                <Link
                  to={`/user/${user?.id}`}
                  className="flex items-center capitalize gap-2 px-4 py-2 text-md text-white hover:bg-codewar_hoverdivbutton"
                >
                  <FaUserCircle className="text-slate-10 text-lg" />
                  profile
                </Link>
                {room && user && room.ownerId === user.id && (
                  <button
                    onClick={openDeleteModal}
                    className="flex items-center capitalize gap-2 px-4 py-2 text-md font-semibold text-red-500 hover:bg-codewar_hoverdivbutton"
                  >
                    <AiFillDelete className="text-red-600 text-lg" />
                    Delete Room
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* CodeEditor here */}
        <div className="col-span-7">
          {lastTry ? (
            <CodeEditor
              startTimeOfChallange={startTimeOfChallange}
              questionId={room ? room?.questions[0].questionId : ""}
            />
          ) : (
            <div className="bg-codewar bg-opacity-10 flex flex-col justify-center items-center h-full text-slate-100 text-opacity-50 font-sans font-semibold text-xl text-center">
              <GrCode size={100} />
              Begin the contest to
              <br /> start coding.
            </div>
          )}
        </div>

        {/* Right pannel */}
        <div className="col-span-2 border-l-2 border-codewar_separator">
          <div className="border border-codewar_separator">
            <div className="flex items-center justify-center py-3 font-medium text-lg">
              {room?.topic}
            </div>

            <div className="w-full h-0.5 bg-blue-500"></div>
            {/* All Connected users */}
            <div className="p-3 border-b border-slate-100 border-opacity-20">
              <h1 className="text-center text-slate-20 font-semibold font-sans">
                Combatants :
              </h1>
              <div className="flex overflow-x-auto space-x-4 w-full bg-transparent mt-2 containerTest">
                {clients.map((client) => {
                  return (
                    <div className="flex flex-col items-center" key={client.id}>
                      <div className="w-10 h-10 rounded-2xl relative">
                        <audio
                          ref={(instance) => provideRef(instance, client.id)}
                          autoPlay
                        ></audio>
                        <img
                          className="w-10 h-10 rounded-2xl border-2 border-codewar_separator"
                          src={client.avatar}
                          alt="avatar"
                        />
                        {/* <button
                          className="flex items-center justify-center bg-transparent absolute bottom-0 right-0 outline-none w-2 h-2 p-2 border-2 border-yellow-300 rounded-full shadow-md"
                          onClick={() => handleMuteClick(client.id)}
                        >
                          {client.muted ? (
                            <BsMicMuteFill size={20} />
                          ) : (
                            <BsMicFill size={20} color={"red"} />
                          )}
                        </button> */}
                      </div>
                      <h4 className="text-slate-200 font-normal text-xs capitalize text-center">
                        {client.name}
                      </h4>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Challange start button */}
            <div>
              {lastTry && (
                <CountdownTimer
                  setCheckFinishedTime={setCheckFinishedTime}
                  targetDate={dateTimeAfterThreeDays}
                />
              )}
              {!lastTry && room && !room.isContestOver && (
                <div className="p-3 border-t border-slate-100 border-opacity-20">
                  <button
                    onClick={challangeTimeDetails}
                    className="flex sm:inline-flex w-full justify-center items-center capitalize bg-codewar_bluebutton hover:bg-codewar_bluebuttondark text-white font-semibold text-center rounded-xl outline-none transition duration-100 px-3 py-1"
                  >
                    Start
                  </button>
                </div>
              )}
              {room && room.isContestOver && (
                <div className="text-center">
                  <span className="text-red-600 font-bold text-lg text-opacity-90">
                    Contest is Over !!!
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Leave Room button */}
          <div className="p-3 border-b border-slate-100 border-opacity-20">
            <button
              onClick={handleManualLeave}
              className="flex sm:inline-flex gap-2 w-full justify-center items-center capitalize bg-codewar_bluebutton hover:bg-codewar_bluebuttondark text-white font-semibold text-center rounded-xl outline-none transition duration-100 px-3 py-1"
            >
              <IoLogOutOutline className="text-white text-lg" />
              Leave Room
            </button>
          </div>

          <div className="px-4 py-4 relative border-b border-slate-100 border-opacity-20">
            <div
              rows={2}
              className="w-full h-auto flex-wrap bg-codewar_hoverdivbutton text-slate-50 px-4 py-2 rounded-lg focus:outline-none"
            >
              <p className="font-medium">Share Link</p>
            </div>
            <AiOutlineCopy
              onClick={copyToClipboard}
              className="absolute text-xl top-6 right-5 text-slate-20 cursor-pointer hover:text-gray-100 rounded-md ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white ease-in-out transition-all duration-150"
            />
          </div>

          {/* Show who started the challange */}
          {challangeStartedUserName && (
            <div className="p-2">
              <span className="flex items-center text-xs justify-center bg-codewar_outputdiv text-slate-100 p-2">
                <IoIosRocket className="text-light_pink" />
                &nbsp;
                <span className="font-medium text-xs text-white">
                  {challangeStartedUserName}
                </span>
                &nbsp;started war!
              </span>
            </div>
          )}

          {checkFinishedTime && (
            <div className="px-2 pb-2">
              <span className="flex items-center text-xs justify-center bg-codewar_outputdiv text-slate-100 p-2">
                <GiStopwatch className="text-red-500" />
                &nbsp;war ended!
              </span>
            </div>
          )}
        </div>
      </div>

      {showWinnerModal && (
        <WinnerModal
          onClose={openShowWinnerModal}
          winnerDetails={winnerDetails}
        />
      )}

      {deleteModalState && (
        <DeleteModal
          onClose={openDeleteModal}
          setLoading={setLoading}
          component={"room"}
        />
      )}

      {showNotification && (
        <NotificationModal
          message={"URL Copied to Clipboard."}
          onClick={closeNotification}
        />
      )}
    </>
  );
};

export default Room;
