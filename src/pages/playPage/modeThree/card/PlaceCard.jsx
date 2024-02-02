import React from 'react';

const PlaceCard = ({ imgUrl }) => {
  return (
    <div
      className={` rounded-xl my-4 p-2 hover:scale-105  bg-white shadow-xl border-transparent cursor-move transition-all `}
    >
      <div className=" flex justify-center items-center  bg-center bg-cover rounded-xl shadow-md overflow-hidden bg-gray-300 ">
        <img
          src={imgUrl}
          alt="PlacePhoto"
          style={{ width: '140px', height: '140px' }}
          className="flex shrink-0 object-cover"
        />
      </div>
    </div>
  );
};

export default PlaceCard;
