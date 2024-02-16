import FavoriteIcon from "@mui/icons-material/Favorite";

//title, imgUrl, id, likesCount
const ResultCard = ({ place }) => {
  // console.log("place", place);
  const likesLimit = Math.min(place.likes, 4);
  const likesArray = Array(place.likes).fill(null);

  return (
    <div
      className={`w-[160px] h-[180px] bg-transparent cursor-pointer group perspective relative`}
    >
      <div className="absolute z-10 -top-10 grid grid-cols-4 items-center ">
        {likesArray.map((_, index) => (
          <div
            key={index}
            className="w-8 h-8 bg-white rounded-full flex justify-center items-center m-1 animate-jump-in"
          >
            <FavoriteIcon style={{ color: "red" }} />
          </div>
        ))}
      </div>
      <div className="relative w-full h-full hover:scale-105 hover:border-green-400 transition-all">
        <div className="absolute bg-white text-black  shadow-xl w-full h-full rounded-lg">
          <img src={place.thumbnailImg} className="w-full h-full rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
