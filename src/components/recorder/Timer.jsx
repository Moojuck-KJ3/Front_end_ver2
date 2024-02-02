import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";

const Timer = ({ onTimeout, timeLeft, setTimeLeft }) => {
  useEffect(() => {
    // Exit early when we reach 0
    if (timeLeft === 0) {
      onTimeout();
      return;
    }
    // Save intervalId to clear the interval when the
    // component re-renders or unmounts
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, onTimeout]);

  return (
    <div className="w-full justify-center items-center relative">
      <div className="flex justify-center items-center">
        <CircularProgress disableShrink />
      </div>
      <div className=" font-semibold text-lg w-full items-center absolute top-1">
        {timeLeft}
      </div>
    </div>
  );
};

export default Timer;
