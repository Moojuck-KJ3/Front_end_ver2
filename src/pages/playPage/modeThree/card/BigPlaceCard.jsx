const BigPlaceCard = ({ img }) => {
  return (
    <div
      className={` w-full h-full justify-center it bg-white shadow-md rounded-xl animate-jump `}
    >
      <div className=" w-full max-h-60 flex px-4 py-4 ">
        <img
          src={img}
          alt="PlacePhoto"
          className="shadow-md overflow-hidden mx-auto bg-gray-300 rounded-lg shrink-0 object-fill"
        />
      </div>
    </div>
  );
};

export default BigPlaceCard;
