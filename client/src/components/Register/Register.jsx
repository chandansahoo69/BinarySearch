import { useState } from "react";
import { useDispatch } from "react-redux";
import { setRegisterResponse } from "../../store/authSlice";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useNotification } from "../../hooks/useNotification";
import NotificationModal from "../NotificationModal/NotificationModal";

const Register = ({ onNext }) => {
  const dispatch = useDispatch();

  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [NotificationMessage, setNotificationMessage] = useState("");

  const { NotificationHandler, closeNotification, showNotification } =
    useNotification();

  function toggleShowHide() {
    setShowPassword(!showPassword);
  }

  function saveResponse() {
    if (!fullName || !userName || !email || !password) {
      setNotificationMessage("Please Enter Email and Password.");
      NotificationHandler();
      return;
    }
    const registerData = {
      fullname: fullName,
      username: userName,
      email: email,
      password: password,
    };

    dispatch(setRegisterResponse(registerData));
    onNext();
  }

  return (
    <>
      <div className="flex items-center justify-center p-6">
        <div className="lg:w-2/5 md:w-1/2 w-2/3">
          <div className="bg-codewar px-10 py-4 rounded-lg shadow-lg min-w-full">
            <h1 className="text-center text-2xl mb-2 text-white font-semibold font-sans">
              Improve your coding skills
            </h1>
            <div>
              <label
                className="text-white font-medium block my-3 text-md"
                htmlFor="Full Name"
              >
                Full Name
              </label>
              <input
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-codewar_hoverdivbutton text-slate-50 px-4 py-2 rounded-lg focus:outline-none"
                type="text"
                name="FullName"
                id="Full Name"
                placeholder="janedoe"
              />
            </div>
            <div>
              <label
                className="text-white font-medium block my-3 text-md"
                htmlFor="username"
              >
                Username
              </label>
              <input
                onChange={(e) => setUserName(e.target.value)}
                className="w-full bg-codewar_hoverdivbutton text-slate-50 px-4 py-2 rounded-lg focus:outline-none"
                type="text"
                name="username"
                id="username"
                placeholder="janedoe"
              />
            </div>
            <div>
              <label
                className="text-white font-medium block my-3 text-md"
                htmlFor="email"
              >
                Email
              </label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-codewar_hoverdivbutton text-slate-50 px-4 py-2 rounded-lg focus:outline-none"
                type="text"
                name="email"
                id="email"
                placeholder="janedoe@gmail.com"
              />
            </div>
            <div className="relative">
              <label
                className="text-white font-medium block my-3 text-md"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="w-full bg-codewar_hoverdivbutton text-slate-50 px-4 py-2 rounded-lg focus:outline-none"
                type={!showPassword ? "password" : "text"}
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="*******"
              />
              {!showPassword ? (
                <AiFillEye
                  onClick={toggleShowHide}
                  className="absolute right-2 text-3xl text-slate-100 top-10 cursor-pointer"
                />
              ) : (
                <AiFillEyeInvisible
                  onClick={toggleShowHide}
                  className="absolute right-2 text-3xl text-slate-100 top-10 cursor-pointer"
                />
              )}
            </div>
            <button
              onClick={saveResponse}
              className="w-full mt-10 mb-4 bg-indigo-600 rounded-lg px-4 py-2 text-lg text-white tracking-wide font-medium font-sans"
            >
              Register
            </button>
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

export default Register;
