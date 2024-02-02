import React from "react";
import VoiceRecoder from "../recorder/VoiceRecoder";

const TranscriptCard = ({ title, link }) => {
  return (
    <div className="w-72 h-72 bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl">
      <div className="flex flex-col justify-between items-center px-4 py-3 w-72">
        <div>
          <span className="text-gray-400 mr-3 uppercase text-xs">안녕</span>
          <p className="text-lg font-bold text-black truncate block capitalize">
            {title}
          </p>
        </div>
        <div className="flex items-center m-5">

        </div>
      </div>
    </div>
  );
};

export default TranscriptCard;
