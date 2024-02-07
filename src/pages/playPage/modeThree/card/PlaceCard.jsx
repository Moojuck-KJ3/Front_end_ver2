import React from "react";

const PlaceCard = ({ place }) => {
  console.log(place);
  return (
    <div
      className={` rounded-xl p-2 hover:scale-105  bg-white shadow-2xl border-transparent cursor-pointer transition-all border-2 hover:border-green-400 animate-jump`}
    >
      <div className=" flex justify-center items-center  bg-center bg-cover rounded-xl shadow-md overflow-hidden bg-gray-300 ">
        <img
          src={place.thumbnailURL}
          alt="placePhoto"
          className="flex shrink-0 object-cover"
        />
      </div>
      <ul className="flex flex-col gap-2">
        <li className="px-2 mt-1 relative bg-gray-100 rounded-lg select-none  text-gray-500 text-sm  overflow-hidden">
          {/* <h1 className=" text-center truncate">#{place.keyword_list[0]}</h1> */}
          <h1 className=" text-center truncate">#햄버거</h1>
        </li>
      </ul>
    </div>
  );
};

export default PlaceCard;
