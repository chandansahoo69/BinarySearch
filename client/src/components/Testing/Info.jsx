import { AiTwotoneSound } from "react-icons/ai";

const Info = () => {
  return (
    <>
      <div className="">
        <div className="flex-1 bg-white shadow-xl p-10 lg:p-20 text-gray-800 md:flex items-center text-center">
          <div className="w-full md:w-1/2">
            <div className="mb-10 md:mb-20 text-gray-600 font-light text-left">
              <AiTwotoneSound className="text-5xl mb-4" />
              <h1 className="font-bold text-gray-700 font-mono capitalize text-xl sm:text-2xl md:text-5xl leading-tight mb-10">
                Bridging the Brains Come be a building block
              </h1>
              <p className="font-medium">
                The page you're looking for isn't available.
              </p>
              <p className="font-medium">
                Try searching again or use the Go Back button below.
              </p>
              <p className="font-medium">
                Searching again or use the Go Back button below loading
                disconnect <br />
                again or use the Go Back button below loading disconnect.
              </p>
            </div>
          </div>
          <div className="w-full md:w-1/2 text-center">
            <img src="https://tanumanasa.com/images/concept1.png" alt="fsd" />
          </div>
        </div>
        {/* <div className="w-64 md:w-96 h-96 md:h-full bg-blue-200 bg-opacity-30 absolute -top-64 md:-top-96 right-20 md:right-32 rounded-full pointer-events-none -rotate-45 transform"></div> */}
        {/* <div className="w-96 h-full bg-yellow-200 bg-opacity-20 absolute -bottom-96 right-64 rounded-full pointer-events-none -rotate-45 transform"></div> */}
      </div>
    </>
  );
};

export default Info;
