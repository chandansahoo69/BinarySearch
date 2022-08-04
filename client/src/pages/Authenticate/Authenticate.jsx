import { useState } from "react";
import StepOtp from "../Steps/StepOtp/StepOtp";
import LoginSignupTab from "../../components/LoginSignupTab/LoginSignupTab";
import Email from "../Steps/Email/Email";

const steps = {
  0: LoginSignupTab,
  1: Email,
  2: StepOtp,
};

const Authenticate = () => {
  const [step, setStep] = useState(0);
  const Step = steps[step];

  // Striving into the next step
  const onNext = () => {
    setStep(step + 1);
  };

  return (
    <div>
      <Step onNext={onNext} />
    </div>
  );
};

export default Authenticate;
