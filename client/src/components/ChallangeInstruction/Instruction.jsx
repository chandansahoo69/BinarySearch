import { MdWavingHand } from "react-icons/md";
import "./Instruction.css";

const Instruction = () => {
  return (
    <>
      <div className="instructionBody h-100 overflow-auto p-6">
        <h2 className="font-bold text-xl capitalize py-3 flex items-center">
          <MdWavingHand className="mr-2 text-light_yellow" />
          Welcome
        </h2>
        <span className="text-slate-200">
          Welcome to binarysearch! Here's how to get started:
        </span>

        <h2 className="font-medium text-md capitalize py-3">Create account</h2>
        <span className="text-slate-200">
          First, create an account by clicking the Get Started button on the top
          right.
        </span>
        <h2 className="font-medium text-md capitalize py-3">Join</h2>
        <span className="text-slate-200">
          Join the room by clicking Join Room.
        </span>
        <h2 className="font-medium text-md capitalize py-3">Ready</h2>
        <span className="text-slate-200">
          Get ready by clicking the Ready button. When everyone is ready, you
          will all get the same coding problem to solve.
        </span>
        <h2 className="font-medium text-md capitalize py-3">Collaborate</h2>
        <span className="text-slate-200 py-3">
          Feel free to compete or chat on the right to solve questions together.
        </span>
        <span className="text-slate-200 py-3">
          When the session ends, you can see each others' solutions. Take some
          time to chat or review the submissions. Lorem, ipsum dolor sit amet
          consectetur adipisicing elit. Dignissimos, natus.
        </span>
      </div>
    </>
  );
};

export default Instruction;
