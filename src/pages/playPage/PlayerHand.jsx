import Card from "./Card";

const PlayerHand = ({ cards, playerName, playerScore, avatarUrl }) => {
  return (
    <div className="w-2/3 h-[150px] absolute -bottom-8 flex justify-center bg-white border-1 border-gray-200 shadow-md rounded-lg mx-10">
      <div className="w-full bg-gray-100  border-2 m-2 rounded-md shadow-inner justify-center items-center flex ">
        {/* Container for trump indicator and cards */}
        <div className="flex items-center z-10">
          <div className="mr-4 flex flex-col items-center">
            <div className="text-sm font-medium text-gray-700">수집된 갯수</div>
            <div className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full mt-1 shadow">
              <span className="text-lg">0</span>
            </div>
          </div>
          <div className="flex -ml-2">
            {cards.map((card, index) => (
              <Card
                key={index}
                suit={card.suit}
                rank={card.rank}
                className="shadow-lg"
              />
            ))}
          </div>
        </div>

        {/* Player information section */}
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 flex items-center pr-4 z-10">
          <div className="flex flex-col items-center mr-3">
            <img
              src={avatarUrl}
              alt={`${playerName} avatar`}
              className="w-14 h-14 rounded-full border-2 border-gray-300 shadow"
            />
            <p className="mt-2">{playerName}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerHand;
