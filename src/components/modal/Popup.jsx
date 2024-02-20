import { useEffect, useState } from "react";

const PopupContainer = ({ children }) => {
  return <div className="fixed inset-0 z-10  overflow-hidden">{children}</div>;
};

const Popup = ({ message, onClose }) => {
  console.log(message);
  const [exit, setExit] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExit(true);
      setTimeout(onClose, 500); // Delay the onClose to allow the exit animation to play
    }, 3000);

    return () => clearTimeout(timer); // Clear the timer if the component is unmounted
  }, [onClose]);

  return (
    <PopupContainer>
      <div
        className={`absolute bottom-5 font-bold right-5 shadow-2xl border-2 rounded-lg bg-white p-8 ${
          exit ? "popup-exit" : "popup-enter"
        }`}
        style={{ width: "450px", height: "600px" }}
      >
        <div className="text-center flex flex-col gap-2  font-DalseoHealing">
          <h1 className="text-4xl font-bold">{message.action}</h1>

          <img
            src={message?.restaurantData?.thumbnailImg}
            alt="PlacePhoto"
            className="w-full h-64 shadow-md overflow-hidden mx-auto bg-gray-300 rounded-lg shrink-0 object-cover object-center"
          />
          <h1 className=" text-2xl">#{message?.restaurantData?.name}</h1>
          <h1 className=" text-2xl">
            #{message?.restaurantData.foodCategories}
          </h1>
          <h1 className=" text-2xl">⭐️{message?.restaurantData?.rating}</h1>
          <ul className="flex flex-wrap justify-center space-x-2 gap-1 p-2">
            {message?.restaurantData.moodKeywords
              .slice(0, 5)
              .map((keyword, index) => (
                <li
                  key={index}
                  className="whitespace-nowrap bg-gray-200 text-black text-lg font-bold  rounded-full px-3 py-2"
                >
                  #{keyword}
                </li>
              ))}
          </ul>
        </div>
        {/* 
        <button
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition duration-300"
          onClick={onClose}
        >
          Close
        </button> */}
      </div>
    </PopupContainer>
  );
};

export default Popup;
