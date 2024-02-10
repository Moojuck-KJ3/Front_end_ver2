import VideoContainer from "./VideoContainer";

const UserVideoContainer = ({ localStream, remoteStrem, handList }) => {
  return (
    <div className=" flex flex-col w-1/5 h-full gap-4">
      <div className="flex flex-col justify-center bg-white p-4 mx-2  rounded-lg shadow-2xl border-2 flex-grow">
        <VideoContainer mediaStream={localStream} />

        <div className=" w-full flex justify-center items-center p-2 gap-2 h-full">
          <div className="flex flex-col gap-1  w-full h-full border-2 border-dashed flex-grow p-1  items-center font-tenada mt-1">
            <div className="text-center w-full font-tenada ">선호하는 음식</div>
            {handList.selectedFoodTag?.map((tag, index) => (
              <div
                key={index}
                className="bg-gray-300 w-full text-center rounded-lg"
              >{`#${tag}`}</div>
            ))}
          </div>
          <div className="flex flex-col w-full h-full border-2 border-dashed flex-grow p-1  items-center font-tenada gap-1 mt-1">
            <div className="text-center w-full font-tenada ">
              선호하는 분위기
            </div>
            {handList.selectedMoodTag?.map((tag, index) => (
              <div
                key={index}
                className="bg-gray-300 w-full text-center rounded-lg"
              >{`#${tag}`}</div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center bg-white p-4 mx-2  rounded-lg shadow-2xl border-2 flex-grow">
        <VideoContainer mediaStream={localStream} />

        <div className=" w-full flex justify-center items-center p-2 gap-2 h-full">
          <div className="flex flex-col gap-1  w-full h-full border-2 border-dashed flex-grow p-1  items-center font-tenada mt-1">
            <div className="text-center w-full font-tenada ">선호하는 음식</div>
            {handList.selectedFoodTag?.map((tag, index) => (
              <div
                key={index}
                className="bg-gray-300 w-full text-center rounded-lg"
              >{`#${tag}`}</div>
            ))}
          </div>
          <div className="flex flex-col w-full h-full border-2 border-dashed flex-grow p-1  items-center font-tenada gap-1 mt-1">
            <div className="text-center w-full font-tenada ">
              선호하는 분위기
            </div>
            {handList.selectedMoodTag?.map((tag, index) => (
              <div
                key={index}
                className="bg-gray-300 w-full text-center rounded-lg"
              >{`#${tag}`}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserVideoContainer;
