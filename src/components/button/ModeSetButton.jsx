import React from "react";

const MODE = {
  MODE1: "MODE_NUMBER_ONE",
  MODE2: "MODE_NUMBER_TWO",
  MODE3: "MODE_NUMBER_THREE",
  MODE4: "MODE_NUMBER_FOUR",
};

const ModeSetButton = ({ setRoomMode }) => {
  return (
    <div className=" absolute top-0 right-0 flex gap-2 m-4">
      <button
        onClick={() => setRoomMode(MODE.MODE1)}
        className="w-5 h-5 bg-white rounded-full"
      >
        1
      </button>
      <button
        onClick={() => setRoomMode(MODE.MODE2)}
        className="w-5 h-5 bg-white rounded-full"
      >
        2
      </button>

      <button
        onClick={() => setRoomMode(MODE.MODE3)}
        className="w-5 h-5 bg-white rounded-full"
      >
        3
      </button>
      <button
        onClick={() => setRoomMode(MODE.MODE4)}
        className="w-5 h-5 bg-white rounded-full"
      >
        4
      </button>
    </div>
  );
};

export default ModeSetButton;
