const RightSideCard = ({ img }) => {
  return (
    <div
      className={`w-full h-72 flex bg-white shadow-md rounded-xl animate-fade `}
    >
      <img
        src={img}
        alt="PlacePhoto"
        className="w-full h-ull shadow-md overflow-hidden mx-auto bg-gray-300 rounded-lg shrink-0 object-cover object-center"
      />
    </div>
  );
};

export default RightSideCard;
