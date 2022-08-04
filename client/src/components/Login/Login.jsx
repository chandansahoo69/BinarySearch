import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../api";
import { setAuth } from "../../store/authSlice";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useNotification } from "../../hooks/useNotification";
import NotificationModal from "../NotificationModal/NotificationModal";

const Login = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [NotificationMessage, setNotificationMessage] = useState("");

  const { NotificationHandler, closeNotification, showNotification } =
    useNotification();

  function toggleShowHide() {
    setShowPassword(!showPassword);
  }

  async function submitHandler() {
    if (!email || !password) {
      setNotificationMessage("Please Enter all fields.");
      NotificationHandler();
      return;
    }

    try {
      const { data } = await login({ email, password });

      // If the user is authenticated then store the data in redux store
      if (data.auth) {
        dispatch(setAuth(data));
      }
    } catch (error) {
      setNotificationMessage(error.response.data.message);
      NotificationHandler();
      return;
    }
  }

  return (
    <>
      <div className="flex items-center justify-center p-6">
        <div className="lg:w-2/5 md:w-1/2 w-2/3 mt-20">
          <div className="bg-codewar p-10 rounded-lg shadow-lg min-w-full">
            <h1 className="text-center text-2xl mb-2 text-white font-semibold font-sans">
              Welcome back
            </h1>
            <div>
              <label
                className="text-white font-medium block my-3 text-md"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="w-full bg-codewar_hoverdivbutton text-slate-50 px-4 py-2 rounded-lg focus:outline-none"
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              onClick={submitHandler}
              className="w-full mt-10 bg-indigo-600 rounded-lg px-4 py-2 text-lg text-white tracking-wide font-medium font-sans"
            >
              Login
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

export default Login;
