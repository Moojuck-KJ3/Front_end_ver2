const BigPlaceCard = ({ img }) => {
  return (
    <div className={` w-full bg-white shadow-md rounded-xl animate-jump `}>
      <div className="flex px-5 py-1 ">
        <img
          src={img}
          alt="PlacePhoto"
          style={{ width: "150px", height: "150px" }}
          className="shadow-md overflow-hidden mx-auto bg-gray-300 rounded-lg shrink-0 object-fit"
        />
      </div>
    </div>
  );
};

export default BigPlaceCard;
