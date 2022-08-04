import { useState } from "react";
import GuestUserLogin from "../GuestUserLogin/GuestUserLogin";
import Login from "../Login/Login";
import Register from "../Register/Register";

const LoginSignupTab = ({ onNext }) => {
  const [tab, setTab] = useState("login");

  return (
    <>
      <div className="absolute top-1/2 left-28 flex flex-col gap-3">
        <span
          onClick={() => setTab("register")}
          className={`${
            tab === "register"
              ? "bg-lightest-navy text-slate-100 font-semibold"
              : "text-slate-400"
          } py-2 px-5 rounded-lg cursor-pointer font-medium`}
        >
          Register
        </span>
        <span
          onClick={() => setTab("login")}
          className={`${
            tab === "login"
              ? "bg-lightest-navy text-slate-100 font-semibold"
              : "text-slate-400"
          } py-2 px-5 rounded-lg cursor-pointer font-medium`}
        >
          Login
        </span>
        <span
          onClick={() => setTab("guest")}
          className={`${
            tab === "guest"
              ? "bg-lightest-navy text-slate-100 font-semibold"
              : "text-slate-400"
          } py-2 px-5 rounded-lg cursor-pointer font-medium`}
        >
          Guest
        </span>
      </div>
      {tab === "login" ? (
        <Login onNext={onNext} />
      ) : tab === "register" ? (
        <Register onNext={onNext} />
      ) : (
        <GuestUserLogin />
      )}
    </>
  );
};

export default LoginSignupTab;
