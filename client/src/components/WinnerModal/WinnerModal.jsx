import { GiLaurelsTrophy } from "react-icons/gi";
import { FaTimes } from "react-icons/fa";
import { CgSmileNone } from "react-icons/cg";

const WinnerModal = ({ onClose, winnerDetails }) => {
  return (
    <>
      <div className="min-w-screen h-screen animated fadeIn faster fixed -left-1 -top-1 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover">
        <div className="absolute bg-black opacity-80 inset-0 z-0"></div>
        <div className="lg:w-full max-w-lg w-11/12 p-5 relative mx-auto my-auto rounded-xl shadow-lg bg-navy ">
          <div className="flex flex-col justify-center items-center relative">
            <div className="text-center p-5 flex flex-col justify-center items-center">
              <button
                onClick={onClose}
                className="absolute top-1 right-1 text-gray-400 bg-transparent hover:bg-lightest-navy hover:text-gray-100 rounded-md text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white ease-in-out transition-all duration-150"
              >
                <FaTimes />
              </button>
              <div className="flex justify-center items-center gap-3 pb-10">
                <GiLaurelsTrophy className="text-yellow-200 font-semibold text-3xl" />
                <h2 className="text-xl font-bold capitalize">
                  Winner of the challange
                </h2>
              </div>
              {winnerDetails.draw && !winnerDetails.noWinner ? (
                <>
                  <CgSmileNone className="text-yellow-500 text-5xl" />
                  <h2 className="text-slate-100 pt-4">Opps it's draw :|</h2>
                </>
              ) : !winnerDetails.draw && winnerDetails.noWinner ? (
                <>
                  <CgSmileNone className="text-yellow-500 text-5xl" />
                  <h2 className="text-slate-100 pt-4 font-bold text-lg">
                    Opps No Winner :|
                  </h2>
                  <h2 className="text-slate-200 pt-4 font-semibold">
                    Better Luck Next Time.
                  </h2>
                </>
              ) : (
                <>
                  <img
                    src={`${
                      winnerDetails
                        ? winnerDetails.winnerAvatar
                        : "https://avatars2.githubusercontent.com/u/1490347?s=460&u=39d7a6b9bc030244e2c509119e5f64eabb2b1727&v=4"
                    }`}
                    alt="winner user"
                    className="w-16 h-16 rounded-full border-2 border-purple-400"
                  />
                  <h2 className="text-md font-semibold p-2 capitalize text-blue-400">
                    {winnerDetails ? winnerDetails.winner : "unknown user"}
                  </h2>
                  <span className="font-medium text-lg font-sans text-slate-200 p-2">
                    +{winnerDetails ? winnerDetails.xpChanges : "0"}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WinnerModal;
