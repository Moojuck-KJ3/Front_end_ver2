import React from "react";

const PlaceCard = ({ place }) => {
  return (
    <div
      className={`rounded-xl w-28 p-2 h-full bg-white shadow-2xl border-transparent cursor-pointer transition-all border-2 hover:border-green-400 animate-jump`}
    >
      <div className="w-26 h-30 flex justify-center items-center rounded-xl shadow-md overflow-hidden bg-gray-300 ">
        <img
          src="/돈까스.png"
          alt="placePhoto"
          className="flex shrink-0 object-cover"
        />
      </div>
      <ul className="flex flex-col gap-1 mt-1">
        <li className="px-2 relative bg-gray-100 rounded-lg select-none  text-gray-500 text-sm  overflow-hidden">
          {/* <h1 className=" text-center truncate">#{place.keyword_list[0]}</h1> */}
          <h1 className=" text-center truncate">#샤브샤브</h1>
        </li>
        <li className="px-2 relative bg-gray-100 rounded-lg select-none  text-gray-500 text-sm  overflow-hidden">
          {/* <h1 className=" text-center truncate">#{place.keyword_list[0]}</h1> */}
          <h1 className=" text-center truncate">#한식</h1>
        </li>
        <li className="px-2 relative bg-gray-100 rounded-lg select-none  text-gray-500 text-sm  overflow-hidden">
          {/* <h1 className=" text-center truncate">#{place.keyword_list[0]}</h1> */}
          <h1 className=" text-center truncate">#조용한</h1>
        </li>
      </ul>
    </div>
  );
};

export default PlaceCard;
