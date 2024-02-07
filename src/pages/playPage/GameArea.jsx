const GameArea = ({ children }) => {
  return (
    <div className="bg-black relative mt-5 w-full h-full flex flex-col justify-center items-center ">
      {children}
    </div>
  );
};

export default GameArea;
