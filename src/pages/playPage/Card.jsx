const Card = ({ suit, rank }) => {
  const suitSymbol = {
    hearts: "♥",
    spades: "♠",
    diamonds: "♦",
    clubs: "♣",
  }[suit];

  return (
    <div
      className={`flex items-center justify-center h-24 w-16 bg-white rounded shadow-md m-1 border-2 ${
        suit === "hearts" || suit === "diamonds" ? "text-red-500" : "text-black"
      }`}
    >
      <span className="text-xl font-bold">
        {rank} {suitSymbol}
      </span>
    </div>
  );
};

export default Card;
