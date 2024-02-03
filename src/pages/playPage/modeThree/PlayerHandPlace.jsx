import React from "react";

const PlayerHandPlace = ({ imgUrl }) => {
  return (
    <div
      className={` rounded-xl p-2 hover:scale-105  bg-white shadow-2xl border-transparent cursor-pointer transition-all hover:border-green-400 `}
    >
      <div className=" flex justify-center items-center  bg-center bg-cover rounded-xl shadow-md overflow-hidden bg-gray-300 ">
        <img
          src={imgUrl}
          alt="PlacePhoto"
          style={{ width: "100px", height: "120px" }}
          className="flex shrink-0 object-cover"
        />
      </div>
    </div>
  );
};

export default PlayerHandPlace;
