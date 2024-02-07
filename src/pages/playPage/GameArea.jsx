const GameArea = ({ children }) => {
  return (
    <div className="relative mt-5 px-10 w-full h-full flex flex-col justify-center items-center ">
      {children}
    </div>
  );
};

export default GameArea;
