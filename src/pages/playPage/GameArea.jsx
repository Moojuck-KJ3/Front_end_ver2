const GameArea = ({ children }) => {
  return (
    <div className=" relative mt-5 w-full h-full flex flex-col justify-center items-center border-[20px] border-gray-100 shadow-2xl rounded-full">
      {children}
    </div>
  );
};

export default GameArea;
