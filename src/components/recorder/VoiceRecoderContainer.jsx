const VoiceRecoderContainer = ({ children }) => {
  return (
    <div
      className={
        " w-96 h-72 relative bg-white shadow-2xl rounded-lg duration-500 hover:scale-105 hover:shadow-xl animate-fade"
      }
    >
      <div className="flex flex-col justify-center items-centerp">
        {children}
      </div>
    </div>
  );
};

export default VoiceRecoderContainer;
