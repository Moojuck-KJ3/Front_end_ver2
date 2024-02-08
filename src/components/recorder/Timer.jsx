import { CircularProgress } from "@mui/material";
import { useEffect } from "react";

const Timer = ({ onTimeout, timeLeft, setTimeLeft }) => {
  useEffect(() => {
    if (timeLeft === 0) {
      onTimeout();
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, onTimeout]);

  return (
    <div className="w-full justify-center items-center relative">
      <div className="flex justify-center items-center">
        <CircularProgress disableShrink />
      </div>
      <div className="font-semibold text-lg w-full items-center absolute top-[16%] left-[48%] ">
        {timeLeft}
      </div>
    </div>
  );
};

export default Timer;
