const CreateRoomPageFooter = ({ onStart }) => {
  return (
    <div className="flex items-center mt-3">
      <button
        onClick={onStart}
        className="tracking-wide font-semibold bg-blue-300 text-gray-100 py-2 px-12 rounded-lg hover:bg-blue-400 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
      >
        <span className="">시작하기</span>
      </button>
    </div>
  );
};

export default CreateRoomPageFooter;