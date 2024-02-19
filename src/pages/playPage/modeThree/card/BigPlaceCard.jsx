const BigPlaceCard = ({ img }) => {
  return (
    <div
      className={` w-full h-full items-center justify-center bg-white shadow-md rounded-xl animate-jump `}
    >
      <div className=" w-full h-full  flex px-4 py-4 ">
        <img
          src={img}
          alt="PlacePhoto"
          className="w-full h-full shadow-md overflow-hidden mx-auto bg-gray-300 rounded-lg shrink-0 object-cover"
        />
      </div>
    </div>
  );
};

export default BigPlaceCard;
