import { useNavigate, useParams } from "react-router-dom";
import WaitingFreindVideoContainer from "../createRoomPage/video/WaitingFreindVideoContainer";
import CreateRoomPageFooter from "../createRoomPage/CreateRoomPageFooter";
import {
  useChatConnection,
  usePeerConnection,
} from "../../realtimeComunication/webRTCManager";
import CopyToClipboardButton from "./ClipboardClipboardCopyButton";

const WaitingPage = ({ localStream }) => {
  const { roomId } = useParams();
  const { peerConnection, guestStream } = usePeerConnection(localStream);
  useChatConnection(peerConnection);

  const handleStartGame = () => {
    // navigator(`/play-room/${roomId}`);
  };

  return (
    <div className=" min-h-screen text-gray-800 flex justify-center items-center">
      <div className="w-[500px] h-[600px] animate-fade-up">
        <div className="sm-m-10 bg-white shadow-xl py-4 rounded-xl flex flex-col jus justify-center items-center">
          <h1 className=" font-bold justify-center">친구를 기다리는 중...</h1>
          <CopyToClipboardButton gameCode={roomId} />
        </div>

        {/* 메인 컨텐츠  */}
        <div className="h-full w-full mt-5 flex flex-col items-center  bg-white shadow-xl rounded-xl justify-center">
          {/* 비디오 */}
          <WaitingFreindVideoContainer
            localStream={localStream}
            remoteStrem={guestStream}
          />
          {/* 버튼 */}
          <CreateRoomPageFooter onStart={handleStartGame} />
        </div>
      </div>
    </div>
  );
};

export default WaitingPage;
