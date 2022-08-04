import React from "react";

const Banner = () => {
  return (
    <>
      <div class="bg-gray-200 px-10 pb-10 pt-60">
        {/* <h1 class="font-black uppercase text-3xl lg:text-5xl text-yellow-500 mb-10">
          You seem to be lost!
        </h1> */}
        <div className="flex flex-col justify-center items-center text-center">
          <h1 class="font-bold text-gray-700 font-mono capitalize text-xl sm:text-2xl md:text-5xl leading-tight mb-6">
            A simple and smart tool that will help grow your business
          </h1>
          <p className="font-medium text-lg text-gray-500 w-1/2">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aliquid,
            nostrum. Lorem ipsum dolor sit, amet consectetur adipisicing elit.
            Cupiditate, asperiores.
          </p>
        </div>
      </div>
    </>
  );
};

export default Banner;
