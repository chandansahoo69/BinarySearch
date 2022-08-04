import { useState } from "react";
import { createRoom as create } from "../../api";
import { useHistory } from "react-router-dom";
import Button from "../shared/Button/Button";
import { FaTimes } from "react-icons/fa";
import { TiTick } from "react-icons/ti";
import { IoEarthSharp } from "react-icons/io5";
import { AiFillLock } from "react-icons/ai";
import NotificationModal from "../NotificationModal/NotificationModal";
import { useNotification } from "../../hooks/useNotification";

const AddRoomModal = ({ onClose, Url }) => {
  const [roomType, setRoomType] = useState("open");
  const [questionType, setQuestionType] = useState("easy");
  const [challangeTime, setChallangeTime] = useState(20);
  const [topic, setTopic] = useState("");
  const history = useHistory();
  const [NotificationMessage, setNotificationMessage] = useState("");

  const { NotificationHandler, closeNotification, showNotification } =
    useNotification();

  // Create Room
  async function createRoom() {
    try {
      // User not selected any topic
      if (!topic) {
        setNotificationMessage("Please Enter a Room Topic.");
        NotificationHandler();
        return;
      }

      if (Url === "room") {
        const { data } = await create({
          topic,
          roomType,
          challangeTime,
          questionType,
        });

        history.push(`/room/${data.id}`);
      }
    } catch (error) {
      setNotificationMessage(error.response.data.message);
      NotificationHandler();
      return;
    }
  }

  return (
    <>
      <div className="min-w-screen h-screen animated fadeIn faster fixed -left-1 -top-1 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover">
        <div className="absolute bg-black opacity-80 inset-0 z-0"></div>
        <div className="lg:w-full max-w-lg w-11/12 p-5 relative mx-auto my-auto rounded-xl shadow-lg bg-navy ">
          <div className="flex flex-col justify-center items-center relative">
            <div className="text-center p-2 flex flex-col justify-center items-center">
              <button
                onClick={onClose}
                className="absolute top-1 right-1 text-gray-400 bg-lightest-navy bg-opacity-50 hover:bg-lightest-navy hover:bg-opacity-100 hover:text-gray-100 rounded-md text-sm p-2 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white ease-in-out transition-all duration-150"
              >
                <FaTimes className="text-md" />
              </button>
              <div className="flex justify-center items-center gap-3 pb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="bi bi-calendar2-week text-purple-500"
                  viewBox="0 0 16 16"
                >
                  <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM2 2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H2z" />
                  <path d="M2.5 4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V4zM11 7.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-5 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z" />
                </svg>
                <h2 className="nav font-medium text-lg bg-opacity-100 capitalize">
                  Let's Start a room
                </h2>
                <div className="grid grid-cols-2 gap-2">
                  <div
                    onClick={() => setRoomType("open")}
                    className={`flex items-center justify-center bg-lightest-navy bg-opacity-40 py-2 px-2 rounded-lg cursor-pointer font-medium ${
                      roomType === "open"
                        ? "bg-dark-navy bg-opacity-100 text-white"
                        : "text-slate-300"
                    }`}
                  >
                    <IoEarthSharp className="text-green-300" />
                    <span className="pl-1">Public</span>
                  </div>
                  <div
                    onClick={() => setRoomType("private")}
                    className={`flex items-center justify-center bg-lightest-navy bg-opacity-40 py-2 px-2 rounded-lg cursor-pointer font-medium ${
                      roomType === "private"
                        ? "bg-dark-navy bg-opacity-100 text-white"
                        : "text-slate-300"
                    }`}
                  >
                    <AiFillLock className="text-red-500" />
                    <span className="pl-1">Private</span>
                  </div>
                </div>
              </div>
              <input
                value={topic}
                className="w-full text-md text-white bg-gray-700 bg-opacity-40 rounded-lg px-4 py-2 mt-2 focus:outline-none"
                placeholder="What the room will be called."
                onChange={(e) => setTopic(e.target.value)}
              />

              <div className="grid grid-cols-3 gap-8 pt-10 pb-2">
                <div
                  onClick={() => setQuestionType("easy")}
                  className={`flex items-center justify-center flex-col bg-lightest-navy bg-opacity-40 py-2 px-4 rounded-lg cursor-pointer font-medium ${
                    questionType === "easy"
                      ? "bg-dark-navy bg-opacity-100 text-white"
                      : "text-slate-300"
                  }`}
                >
                  <span
                    className={`rounded-md p-0.5 text-lg ${
                      questionType === "easy" ? "bg-green-300" : ""
                    }`}
                  >
                    <TiTick />
                  </span>
                  <span className="pt-2">Easy</span>
                </div>
                <div
                  onClick={() => setQuestionType("medium")}
                  className={`flex items-center justify-center flex-col bg-lightest-navy bg-opacity-40 p-4 rounded-lg cursor-pointer font-medium ${
                    questionType === "medium"
                      ? "bg-dark-navy bg-opacity-100 text-white"
                      : "text-slate-300"
                  }`}
                >
                  <span
                    className={`rounded-md p-0.5 text-lg ${
                      questionType === "medium" ? "bg-yellow-500" : ""
                    }`}
                  >
                    <TiTick />
                  </span>
                  <span className="pt-2">Medium</span>
                </div>
                <div
                  onClick={() => setQuestionType("hard")}
                  className={`flex items-center justify-center flex-col bg-lightest-navy bg-opacity-40 py-2 px-4 rounded-lg cursor-pointer font-medium ${
                    questionType === "hard"
                      ? "bg-dark-navy bg-opacity-100 text-white"
                      : "text-slate-300"
                  }`}
                >
                  <span
                    className={`rounded-md p-0.5 text-lg ${
                      questionType === "hard" ? "bg-red-500" : ""
                    }`}
                  >
                    <TiTick />
                  </span>
                  <span className="pt-2">Hard</span>
                </div>
              </div>
              <h2 className="font-medium text-gray-300 pt-2 pb-2">
                Challange Time
              </h2>
              <div className="grid grid-cols-5 gap-4">
                <div
                  onClick={() => setChallangeTime(2)}
                  className={`bg-lightest-navy bg-opacity-40 py-2 px-4 rounded-lg cursor-pointer font-medium ${
                    challangeTime === 2
                      ? "bg-dark-navy bg-opacity-100"
                      : "text-slate-300"
                  }`}
                >
                  <span>2</span>
                </div>
                <div
                  onClick={() => setChallangeTime(10)}
                  className={`bg-lightest-navy bg-opacity-40 py-2 px-4 rounded-lg cursor-pointer font-medium ${
                    challangeTime === 10
                      ? "bg-dark-navy bg-opacity-100"
                      : "text-slate-300"
                  }`}
                >
                  <span>10</span>
                </div>
                <div
                  onClick={() => setChallangeTime(20)}
                  className={`bg-lightest-navy bg-opacity-40 py-2 px-4 rounded-lg cursor-pointer font-medium ${
                    challangeTime === 20
                      ? "bg-dark-navy bg-opacity-100"
                      : "text-slate-300"
                  }`}
                >
                  <span>20</span>
                </div>
                <div
                  onClick={() => setChallangeTime(30)}
                  className={`bg-lightest-navy bg-opacity-40 py-2 px-4 rounded-lg cursor-pointer font-medium ${
                    challangeTime === 30
                      ? "bg-dark-navy bg-opacity-100"
                      : "text-slate-300"
                  }`}
                >
                  <span>30</span>
                </div>
                <div
                  onClick={() => setChallangeTime(40)}
                  className={`bg-lightest-navy bg-opacity-40 py-2 px-4 rounded-lg cursor-pointer font-medium ${
                    challangeTime === 40
                      ? "bg-dark-navy bg-opacity-100"
                      : "text-slate-300"
                  }`}
                >
                  <span>40</span>
                </div>
              </div>
            </div>
            <Button onClick={createRoom} text="Let's Go" />
          </div>
        </div>
      </div>
      {showNotification && (
        <NotificationModal
          message={NotificationMessage}
          onClick={closeNotification}
        />
      )}
    </>
  );
};

export default AddRoomModal;
