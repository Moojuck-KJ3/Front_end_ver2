import FavoriteIcon from "@mui/icons-material/Favorite";
import "./HeartEffect.css";

const ResultCard = ({ place }) => {
  const likesLimit = Math.min(place.likes, 4);
  const likesArray = Array(likesLimit).fill(null);

  return (
    <div
      className={`w-[160px] h-[180px] bg-transparent cursor-pointer group perspective relative`}
    >
      <div
        className="absolute z-10 -top-4 grid grid-cols-4 items-center gap-8 w-12/13"
        style={{ transform: "translateX(-8px)" }}
      >
        {likesArray.map((_, index) => (
          <div
            key={index}
            className="w-8 h-8 flex justify-center items-center m-1 animate-jump-in"
          >
            {/* <FavoriteIcon style={{ color: "red" }} /> */}
            <div className="heart"></div>
          </div>
        ))}
      </div>
      <div className="relative w-full h-full hover:scale-105 transition-all hover:border-2 hover:border-green-400 animate-twinkling">
        <div className="absolute bg-white text-black  shadow-xl w-full h-full rounded-lg">
          <img src={place.thumbnailImg} className="w-full h-full rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
