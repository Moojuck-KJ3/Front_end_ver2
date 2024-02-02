const VoiceRecoderContainer = ({ children, onReady }) => {
  return (
    <div
      className={`w-72 h-72 relative bg-white shadow-2xl rounded-xl duration-500 hover:scale-105 hover:shadow-xl animate-fade ${
        onReady ? " border-8 border-blue-200" : ""
      }`}
    >
      <div className="flex flex-col justify-center items-centerp">
        {children}
      </div>
    </div>
  );
};

export default VoiceRecoderContainer;
