import React from "react";

const PlaceCard = ({ place }) => {
  return (
    <img
      src={place.thumbnailImg}
      alt="thumbnailImg"
      className="flex h-full shrink-0 object-cover rounded-xl animate-jump"
    />
  );
};

export default PlaceCard;

{
  /* <div
className={`rounded-xl m-1 h-full bg-white shadow-2xl border-transparent cursor-pointer transition-all border-2 hover:border-green-400 `}  > */
}

// </div>
