const GameArea = ({ children }) => {
  return (
    <div className="flex-grow px-14 py-4 flex flex-row justify-between items-stretch">
      {children}
    </div>
  );
};

export default GameArea;
