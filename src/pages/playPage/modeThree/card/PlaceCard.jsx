import React from "react";

const PlaceCard = ({ imgUrl }) => {
  // React.useEffect(() => {
  //   console.log("PlaceCard place", place);
  // }, []);

  const handleClick = () => {
    console.log("안녕");
  };
  return (
    <div
      onClick={handleClick}
      className={` rounded-xl my-4 p-2 hover:scale-105  bg-white shadow-2xl border-transparent cursor-pointer transition-all border-2 hover:border-green-400 `}
    >
      <div className=" flex justify-center items-center  bg-center bg-cover rounded-xl shadow-md overflow-hidden bg-gray-300 ">
        <img
          src={imgUrl}
          alt="PlacePhoto"
          style={{ width: "140px", height: "140px" }}
          className="flex shrink-0 object-cover"
        />
      </div>
      <ul className="flex flex-col leading-8 my-2 gap-2">
        <li className="px-2 py-1 relative bg-gray-100 rounded-lg select-none  text-gray-500 text-sm  overflow-hidden">
          <h1 className=" text-center truncate">#고즈넉한</h1>
        </li>
        <li className="px-2 py-1 relative bg-gray-100 rounded-lg select-none  text-gray-500 text-sm  overflow-hidden">
          <h1 className=" text-center truncate">#세련된</h1>
        </li>
        <li className="px-2 py-1 relative bg-gray-100 rounded-lg select-none  text-gray-500 text-sm  overflow-hidden">
          <h1 className=" text-center truncate">#한식</h1>
        </li>
      </ul>
    </div>
  );
};

export default PlaceCard;
