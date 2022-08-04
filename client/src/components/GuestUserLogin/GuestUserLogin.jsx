import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../api";
import { setAuth } from "../../store/authSlice";

const GuestUserLogin = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("dummyuser@gmail.com");
  const [password, setPassword] = useState("123123123");

  async function submitHandler() {
    if (!email || !password) return;

    const { data } = await login({ email, password });

    // If the user is authenticated then store the data in redux store
    if (data.auth) {
      dispatch(setAuth(data));
    }
  }

  return (
    <>
      <div className="flex items-center justify-center p-6">
        <div className="lg:w-2/5 md:w-1/2 w-2/3 mt-20">
          <div className="bg-codewar p-10 rounded-lg shadow-lg min-w-full">
            <h1 className="text-center text-2xl mb-2 text-white font-semibold font-sans">
              Guest User Login
            </h1>
            <div className="text-center">
              <span className="text-gray-500 my-2">
                If you're a guest user then login through the email and password
                set in the field.
              </span>
            </div>
            <div>
              <label
                className="text-white font-medium block my-3 text-md"
                htmlFor="email"
              >
                Email
              </label>
              <div className="w-full bg-codewar_hoverdivbutton text-slate-50 px-4 py-2 rounded-lg focus:outline-none">
                {email}
              </div>
            </div>
            <div className="relative">
              <label
                className="text-white font-medium block my-3 text-md"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="w-full bg-codewar_hoverdivbutton text-slate-100 px-4 py-2 rounded-lg focus:outline-none"
                type="password"
                name="password"
                value={password}
                readOnly
              />
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
    </>
  );
};

export default GuestUserLogin;
