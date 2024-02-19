import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import CircularProgress from "@mui/joy/CircularProgress";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { logout } from "../../api";

const CreateRoomPageFooter = ({
  isActivate,
  onStart,
  progressValue,
  users,
  isRestaurantListsReady,
}) => {
  const handleLogout = () => {
    logout();
  };
  return (
    <div className="flex mt-4 items-center gap-2">
      <button
        onClick={handleLogout}
        className="tracking-wide font-semibold bg-gray-200 text-black text-lg p-2 rounded-lg hover:bg-gray-300 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
      >
        <ChevronLeftIcon />
      </button>

      <button
        onClick={onStart}
        disabled={!isActivate || !isRestaurantListsReady}
        className={`tracking-wide font-semibold ${
          !isActivate || !isRestaurantListsReady
            ? "bg-blue-300"
            : "bg-blue-500 hover:bg-blue-600"
        } text-gray-100 py-2 px-12 rounded-lg transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none 
        ${
          !isActivate || !isRestaurantListsReady
            ? "cursor-not-allowed opacity-50"
            : ""
        }`}
      >
        <span className="">시작하기</span>
      </button>
      <CircularProgress color="success" value={progressValue}>
        {progressValue < 100 ? (
          `${users.length} / 4`
        ) : (
          <CheckCircleIcon style={{ color: "green" }} />
        )}
      </CircularProgress>
    </div>
  );
};

export default CreateRoomPageFooter;
