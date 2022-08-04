import { AiFillBook } from "react-icons/ai";
import { MdWavingHand } from "react-icons/md";
import { useSelector } from "react-redux";

const SignupInstruction = ({ onNext }) => {
  const { username } = useSelector((state) => state.auth.register);

  return (
    <>
      <div className="bg-codewar h-auto w-6/12 flex flex-col text-center items-center justify-center p-10 rounded-lg mt-8 mx-4">
        <div className="text-3xl flex items-center gap-2 text-blue-300 leading-5 pb-10">
          <AiFillBook className="text-green" />
          Introduction
        </div>
        <h1 className="text-2xl text-white leading-5 py-2 flex gap-2 font-semibold">
          {" "}
          <MdWavingHand className="text-yellow-400" />
          Hello {username}
        </h1>
        <span className="text-slate-300 leading-5 pb-5">
          Welcome to BinarySearch!
        </span>
        <div className="text-lg">
          We know the ecosystem very well and they provides the speed, flexible
          account model and API-first approach that no one else can. These
          aspects are essential to building certain products that power our
          customers' growth.
        </div>
        <div className="text-lg mt-5">
          We know the ecosystem very well and they provides the speed.
        </div>
        <div className="text-lg mt-5">
          Ecosystem very well and they provides the speed.
        </div>

        <button
          onClick={onNext}
          className="mt-8 flex sm:inline-flex justify-center items-center capitalize bg-codewar_bluebutton hover:bg-codewar_bluebuttondark active:bg-blue-700 focus-visible:ring ring-blue-300 text-white font-semibold text-center rounded-xl outline-none transition duration-100 px-3 py-2"
        >
          next
        </button>
      </div>
    </>
  );
};

export default SignupInstruction;
