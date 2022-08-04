import { useState } from "react";
import Button from "../../../components/shared/Button/Button";
import Card from "../../../components/shared/Card/Card";
import TextInput from "../../../components/shared/TextInput/TextInput";
import { useDispatch } from "react-redux";
import { setSkillInterest } from "../../../store/authSlice";

const StepName = ({ onNext }) => {
  const [skill, setSkill] = useState("");
  const [interest, setInterest] = useState("");
  const dispatch = useDispatch();

  function nextStep() {
    if (!skill || !interest) {
      return;
    }

    // Store the skill and interest in store
    dispatch(setSkillInterest({ skill, interest }));
    onNext();
  }

  return (
    <>
      <Card title="What's your full name?" icon="name">
        <div className="flex flex-col items-center">
          <span className="py-4 text-white font-medium text-lg">
            What's your programming language.
          </span>
          <input
            value={skill}
            type="text"
            className="bg-blue-600 text-slate-100 w-full bg-opacity-20 py-2 px-4 rounded-lg outline-none border-none"
            placeholder="c++"
            onChange={(e) => setSkill(e.target.value)}
          />
          <span className="py-4 text-white font-medium text-lg">
            What king of role you are interested in.
          </span>
          <input
            type="text"
            className="bg-blue-600 text-slate-100 w-full bg-opacity-20 py-2 px-4 rounded-lg outline-none border-none"
            value={interest}
            placeholder="frontend"
            onChange={(e) => setInterest(e.target.value)}
          />
          <p className="w-full py-4 text-slate-300 text-lg">
            People use real data at BinarySearch :)
          </p>
          <button
            onClick={nextStep}
            className="mt-4 flex sm:inline-flex justify-center items-center capitalize bg-codewar_bluebutton hover:bg-codewar_bluebuttondark active:bg-blue-700 focus-visible:ring ring-blue-300 text-white font-semibold text-center rounded-xl outline-none transition duration-100 px-3 py-2"
          >
            next
          </button>
        </div>
      </Card>
    </>
  );
};

export default StepName;
