import { useEffect, useState } from "react";
import Card from "../../../components/shared/Card/Card";
import { useDispatch, useSelector } from "react-redux";
import { setAvatar } from "../../../store/authSlice";
import styles from "./StepAvatar.module.css";
import { activate } from "../../../api";
import { setAuth } from "../../../store/authSlice";
import Loader from "../../../components/shared/Loader/Loader";

const StepAvatar = ({ onNext }) => {
  const { fullname, email, password, skill, interest, username, avatar } =
    useSelector((state) => state.auth.register);
  const [image, setImage] = useState("./image/monkey-avatar.png");
  const [location, setLocation] = useState("");
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [unMounted, setUnMounted] = useState(false);

  function captureImage(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function () {
      setImage(reader.result);
      dispatch(setAvatar(reader.result));
    };
  }

  async function submit() {
    if (!username || !avatar || !location) return;
    setLoading(true);

    try {
      const { data } = await activate({
        fullname,
        email,
        password,
        skill,
        interest,
        username,
        avatar,
        location,
      });
      if (data.auth) {
        // Clean the unwanted calls to avoid warnings
        if (!unMounted) dispatch(setAuth(data));
      }
    } catch (error) {
      console.log(error);
    } finally {
      //in both the case we have to stop the loader so do it in finally block
      setLoading(false);
    }
  }
  // To clean the console
  useEffect(() => {
    return () => {
      setUnMounted(true);
    };
  }, []);

  if (loading) return <Loader message="Activation in progress..." />;

  return (
    <>
      <Card title={`Okey, ${username}!`}>
        <div className="flex flex-col items-center">
          <p className="text-slate-200 pb-2">How's this Photo?</p>
          <div className={styles.avatarWrapper}>
            <img
              className="rounded-full h-5/6 w-5/6 bg-cover"
              src={image}
              alt="avatar"
            />
          </div>
          <div>
            <input
              onChange={captureImage}
              id="avatarInput"
              type="file"
              className="hidden"
            />
            <label
              htmlFor="avatarInput"
              className="inline-block my-4 text-blue-600 font-medium cursor-pointer"
            >
              Choose a different photo
            </label>
          </div>
          <span className="py-2 text-white font-medium text-lg">
            Where are you located?
          </span>
          <input
            value={location}
            type="text"
            className="bg-blue-600 text-slate-100 w-11/12 bg-opacity-20 py-2 px-4 rounded-lg outline-none border-none"
            placeholder="India"
            onChange={(e) => setLocation(e.target.value)}
          />
          <button
            onClick={submit}
            className="mt-8 flex sm:inline-flex justify-center items-center capitalize bg-codewar_bluebutton hover:bg-codewar_bluebuttondark active:bg-blue-700 focus-visible:ring ring-blue-300 text-white font-semibold text-center rounded-xl outline-none transition duration-100 px-3 py-2"
          >
            next
          </button>
        </div>
      </Card>
    </>
  );
};

export default StepAvatar;
