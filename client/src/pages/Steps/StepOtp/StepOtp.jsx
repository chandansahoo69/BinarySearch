import { useEffect, useState } from "react";
import Button from "../../../components/shared/Button/Button";
import Card from "../../../components/shared/Card/Card";
import { verifyOtp } from "../../../api";
import { useSelector, useDispatch } from "react-redux";
import { setAuth, setOtp as setStoreOtp } from "../../../store/authSlice";
import Loader from "../../../components/shared/Loader/Loader";
import OtpInput from "react-otp-input";
import sendOtpAgain from "./sendOtpAgain";
import NotificationModal from "../../../components/NotificationModal/NotificationModal";
import { useNotification } from "../../../hooks/useNotification";

const StepOtp = ({ onNext }) => {
  const [otp, setOtp] = useState("");
  const [counter, setCounter] = useState(120);
  const { phone, hash, email } = useSelector((state) => state.auth.otp);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  //   const [showNotification, setShowNotification] = useState(false);
  const [NotificationMessage, setNotificationMessage] = useState("");

  const { NotificationHandler, closeNotification, showNotification } =
    useNotification();

  // Expire otp timer
  useEffect(() => {
    const timer =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000);

    if (counter === 0) setOtp("");
    return () => clearInterval(timer);
  }, [counter]);

  // Send the otp again when otp expires
  const sendOtpAgainAndSetData = async () => {
    const {
      hash: newHash,
      email: newEmail,
      phone: newPhone,
    } = await sendOtpAgain({ phone, email });
    if (newPhone) {
      dispatch(setStoreOtp({ phone: newPhone, hash: newHash }));
    } else {
      dispatch(setStoreOtp({ email: newEmail, hash: newHash }));
    }
    setCounter(119);
  };

  // Api call for sending phone or email
  async function sendOTP() {
    if (!otp || !hash || (!phone && !email)) {
      setNotificationMessage("Please Enter OTP.");
      NotificationHandler();
      return;
    }
    setLoading(true);
    try {
      // Get all the data from store and check for verify the user
      if (phone) {
        const { data } = await verifyOtp({ otp, phone, hash });

        // A token will generated and store it on the store
        dispatch(setAuth(data));
      } else {
        const { data } = await verifyOtp({ otp, email, hash });
        // A token will generated and store it on the store
        dispatch(setAuth(data));
      }
    } catch (error) {
      setNotificationMessage(error.response.data.message);
      NotificationHandler();
      return;
    } finally {
      // In both the case we have to stop the loader so do it in finally block
      setLoading(false);
    }
  }

  if (loading) return <Loader message="Verifying OTP..." />;

  return (
    <>
      <div className="flex items-center justify-center mt-24">
        <Card title="Enter OTP we just texted to" icon="password">
          <div className="pb-3">
            {phone ? (
              <span className="font-semibold text-green text-green-500">
                {phone}
              </span>
            ) : (
              <span className="font-semibold text-green text-green-500">
                {email}
              </span>
            )}
          </div>

          <OtpInput
            inputStyle={{
              width: "3rem",
              height: "3rem",
              margin: "0 .5rem",
              fontSize: "2rem",
              backgroundColor: "#173954",
              borderRadius: 4,
              focus: "none",
              border: "1px solid rgba(0,0,0,0.3)",
            }}
            value={otp}
            onChange={setOtp}
            autoFocus
            OTPLength={4}
            otpType="number"
            disabled={false}
          />
          <div>
            <div className="flex justify-center">
              <Button text="Verify" onClick={sendOTP} />
            </div>
            {counter > 0 ? (
              <p className="text-center text-white mb-4">
                OTP will expire in -{" "}
                <span className="text-blue-600 font-semibold">
                  {/* 0{Math.floor(counter / 60)} : {counter % 60} */}
                  {counter}
                </span>{" "}
                second.
              </p>
            ) : (
              <>
                <div className="mb-4">
                  <span>Your OTP has been expired.</span>{" "}
                  <span
                    className="text-blue-600 font-semibold text-lg hover:text-blue-800 cursor-pointer"
                    onClick={sendOtpAgainAndSetData}
                  >
                    Resend
                  </span>
                </div>
              </>
            )}

            <p className="text-slate-100 text-md">
              Congrats on joining binarysearch! Lastly check your email for a
              verification from us.
            </p>
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

export default StepOtp;
