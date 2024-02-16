import { useEffect, useState } from "react";

const PopupContainer = ({ children }) => {
  return <div className="fixed inset-0 z-50 overflow-hidden">{children}</div>;
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

  if (!message) return null;

  return (
    <PopupContainer>
      <div
        className={`absolute bottom-5 right-5 shadow-2xl border-2 rounded-lg bg-white p-8 ${
          exit ? "popup-exit" : "popup-enter"
        }`}
        style={{ width: "400px", height: "500px" }} // Adjust width as needed
      >
        <div className="text-center flex flex-col gap-2 font-tenada">
          <h1 className="  text-4xl font-bold">{message.action}</h1>

          <img
            src={message.restaurantData.thumbnailImg}
            alt="PlacePhoto"
            className="w-full h-full shadow-md overflow-hidden mx-auto bg-gray-300 rounded-lg shrink-0 object-cover object-center"
          />
          <h1 className=" text-2xl">#{message.restaurantData.name}</h1>
          <h1 className=" text-2xl">
            #{message.restaurantData.foodCategories}
          </h1>
          <h1 className=" text-2xl">⭐️{message.restaurantData.rating}</h1>
          <ul className="flex justify-center gap-2  ">
            {message.restaurantData.moodKeywords.map((keyword, index) => (
              <li key={index} className="bg-gray-300 p-1 rounded-lg text-xl">
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
