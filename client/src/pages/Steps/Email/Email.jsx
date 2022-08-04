import { useState } from "react";
import Button from "../../../components/shared/Button/Button";
import Card from "../../../components/shared/Card/Card";
import { useDispatch, useSelector } from "react-redux";
import { setOtp } from "../../../store/authSlice";
import { sendOtp } from "../../../api";
import NotificationModal from "../../../components/NotificationModal/NotificationModal";
import { useNotification } from "../../../hooks/useNotification";

const Email = ({ onNext }) => {
  const dispatch = useDispatch();
  const { register } = useSelector((state) => state.auth);
  const [email, setEmail] = useState(register.email);
  const [NotificationMessage, setNotificationMessage] = useState("");

  const { NotificationHandler, closeNotification, showNotification } =
    useNotification();

  async function submit() {
    if (!email) {
      setNotificationMessage("Please Enter Email.");
      NotificationHandler();
      return;
    }

    // Server request
    try {
      const { data } = await sendOtp({ email });
      dispatch(setOtp({ email: data.email, hash: data.hash }));
    } catch (error) {
      setNotificationMessage(error.response.data.message);
      NotificationHandler();
      return;
    }
    onNext();
  }

  return (
    <>
      <div className="flex items-center justify-center mt-24">
        <Card title="Verify Email" icon="email">
          <div>
            {/* <TextInput value={email} onChange={(e) => setEmail(e.target.value)} /> */}
            <div className="flex items-center justify-center">
              <div className="bg-blue-600 bg-opacity-20 py-2 px-4 rounded-lg w-3/5 outline-none border-none">
                {email}
              </div>
            </div>
            <div className="flex flex-col items-center justify-center">
              <Button text="Next" onClick={submit} />
              <p className="text-slate-300 text-base lg:text-lg md:text-lg">
                By entering your email, you're agreeing to our Terms of Services
                and Privacy Policy. Thanks!
              </p>
            </div>
          </div>
        </Card>
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

export default Email;
