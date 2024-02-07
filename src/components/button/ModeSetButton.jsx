const MODE = {
  MODE1: 1,
  MODE2: 2,
  MODE3: 3,
  MODE4: 3,
};

const ModeSetButton = ({ setRoomMode }) => {
  return (
    <div className=" absolute bottom-36 z-10 flex gap-2 m-4">
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
