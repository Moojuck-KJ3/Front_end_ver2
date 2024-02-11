const VoiceRecoderContainer = ({ children }) => {
  return (
    <div className="modal fixed w-full h-full -top-10 left-0 flex items-center justify-center  ">
      <div
        className={
          " w-96 h-100 relative bg-white shadow-2xl rounded-lg duration-500 hover:scale-105 hover:shadow-xl animate-fade"
        }
      >
        {children}
      </div>
    </div>
  );
};

export default VoiceRecoderContainer;
