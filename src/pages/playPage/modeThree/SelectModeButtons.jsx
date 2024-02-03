const SelectModeButtons = ({ onClick }) => {
  return (
    <nav className=" absolute top-8 flex gap-4 ">
      <button
        onClick={() => onClick(1)}
        className=" font-semibold hover:scale-110 transition-all w-24 items-center justify-center p-2 shadow-xl rounded-md bg-blue-300"
      >
        분석 리스트
      </button>
      <button
        onClick={() => onClick(2)}
        className=" font-semibold hover:scale-110 transition-all w-24 items-center justify-center p-2 shadow-xl rounded-md bg-blue-300"
      >
        조합하기
      </button>

      <button
        onClick={() => onClick(3)}
        className=" font-semibold hover:scale-110 transition-all w-24 items-center justify-center p-2 shadow-xl rounded-md bg-blue-300"
      >
        제안하기
      </button>
    </nav>
  );
};

export default SelectModeButtons;
