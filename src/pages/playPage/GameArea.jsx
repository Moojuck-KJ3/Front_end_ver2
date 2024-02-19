const GameArea = ({ children }) => {
  return (
    <div className="flex-grow px-12 flex flex-row justify-between items-stretch">
      {children}
    </div>
  );
};

export default GameArea;
