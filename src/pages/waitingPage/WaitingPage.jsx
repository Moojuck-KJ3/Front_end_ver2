import { useNavigate, useParams } from "react-router-dom";
import WaitingFreindVideoContainer from "../createRoomPage/video/WaitingFreindVideoContainer";
import CreateRoomPageFooter from "../createRoomPage/CreateRoomPageFooter";
import CopyToClipboardButton from "./ClipboardClipboardCopyButton";
import { useCallback, useEffect, useRef, useState } from "react";
import socket from "../../realtimeComunication/socket";
import Typewriter from "../../components/type/TypeWriter";

const pc_config = {
  iceServers: [
    { urls: "stun:stun2.1.google.com:19302" },
    {
      urls: import.meta.env.VITE_APP_TURN_SERVER_URL,
      username: import.meta.env.VITE_APP_TURN_SERVER_USERNAME,
      credential: import.meta.env.VITE_APP_TURN_SERVER_CREDENTIALS,
    },
  ],
};

const WaitingPage = ({ localStream, roomDetail, setRoomDetail }) => {
  // 개발 끝나면, isAllPlayerReady False로 바꾸기
  const [isAllPlayerReady, setIsAllPlayerReady] = useState(true);
  const navigator = useNavigate();
  const { roomId } = useParams();
  const [progressValue, setProgressValue] = useState(50);
  const pcsRef = useRef({});
  const [users, setUsers] = useState([]);

  const createPeerConnection = useCallback((socketId) => {
    try {
      console.log("createPeerConnection is called", socketId);
      const pc = new RTCPeerConnection(pc_config);

      pc.onicecandidate = (e) => {
        if (!e.candidate) return;
        socket.emit("send-candidate", {
          candidate: e.candidate,
          candidateSendID: socket.id,
          candidateReceiveID: socketId,
        });
        console.log("send-candidate is called");
      };

      pc.oniceconnectionstatechange = (e) => {
        console.log(e);
      };

      pc.ontrack = (e) => {
        console.log("ontrack success");
        setUsers((oldUsers) =>
          oldUsers
            .filter((user) => user.socketId !== socketId)
            .concat({
              socketId: socketId,
              stream: e.streams[0],
            })
        );
      };

      if (localStream) {
        console.log("localstream add");
        localStream.getTracks().forEach((track) => {
          if (!localStream) return;
          pc.addTrack(track, localStream);
        });
      } else {
        console.log("no local stream");
      }

      return pc;
    } catch (e) {
      console.error(e);
      return undefined;
    }
  }, []);

  useEffect(() => {
    console.log("pcsRef");
    console.log(pcsRef);
    console.log("users");
    console.log(users);
    const handleConnection = () => {
      console.log("join-room is called");
      socket.emit("join-room", roomId);
    };
    socket.on("connect", handleConnection);
    socket.on("all-users", (allUsers) => {
      console.log("all-users is called");
      allUsers.forEach(async (user) => {
        console.log(user);
        if (!localStream) return;
        const pc = createPeerConnection(user.socketId);
        if (!pc) return;
        pcsRef.current = { ...pcsRef.current, [user.socketId]: pc };
        try {
          const localSdp = await pc.createOffer({
            offerToReceiveAudio: true,
            offerToReceiveVideo: true,
          });
          console.log("create offer success");
          await pc.setLocalDescription(new RTCSessionDescription(localSdp));
          socket.emit("send-connection-offer", {
            sdp: localSdp,
            offerSendID: socket.id,
            offerReceiveID: user.socketId,
          });
        } catch (e) {
          console.error(e);
        }
      });
    });

    socket.on("send-connection-offer", async (data) => {
      const { sdp, offerSendID } = data;
      console.log("send-connection-offer");
      if (!localStream) return;
      const pc = createPeerConnection(offerSendID);
      if (!pc) return;
      pcsRef.current = { ...pcsRef.current, [offerSendID]: pc };
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(sdp));
        console.log("answer set remote description success");
        const localSdp = await pc.createAnswer({
          offerToReceiveVideo: true,
          offerToReceiveAudio: true,
        });
        await pc.setLocalDescription(new RTCSessionDescription(localSdp));
        socket.emit("answer", {
          sdp: localSdp,
          answerSendID: socket.id,
          answerReceiveID: offerSendID,
        });
      } catch (e) {
        console.error(e);
      }
    });

    socket.on("answer", (data) => {
      const { sdp, answerSendID } = data;
      console.log("get answer");
      const pc = pcsRef.current[answerSendID];
      if (!pc) return;
      pc.setRemoteDescription(new RTCSessionDescription(sdp));
    });

    socket.on("send-candidate", async (data) => {
      console.log("get candidate");
      const pc = pcsRef.current[data.candidateSendID];
      if (!pc) return;
      await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
      console.log("candidate add success");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createPeerConnection, localStream]);

  useEffect(() => {
    const handleAllPlayerReady = () => {
      console.log("All players are ready");
      setIsAllPlayerReady(true);
      setProgressValue(100);
    };

    const handleStartPlayRoomResponse = (data) => {
      console.log("Starting the play-room", data);

      setRoomDetail((prev) => ({
        ...prev,
        purposeCoordinate: {
          lat: data.coordinates[0],
          lng: data.coordinates[1],
        },
        roomMemberCount: data.roomMemberCount,
      }));
      navigator(`/play-room/${roomId}`);
    };

    socket.on("all-player-ready", handleAllPlayerReady);
    socket.on("start-play-room-response", handleStartPlayRoomResponse);

    return () => {
      socket.off("all-player-ready", handleAllPlayerReady);
      socket.off("start-play-room-response", handleStartPlayRoomResponse);
    };
  }, [navigator, setRoomDetail, roomId]);

  useEffect(() => {
    if (isAllPlayerReady) {
      console.log("The Room Creator can now start the game.");
    }
  }, [isAllPlayerReady]);

  const handleStartGame = () => {
    if (isAllPlayerReady) {
      const data = {
        roomId: roomId,
        coordinates: [
          roomDetail.purposeCoordinate.lat,
          roomDetail.purposeCoordinate.lng,
        ],
      };
      socket.emit("start-play-room", data);
    } else {
      console.log("Not all players are ready");
    }
  };

  return (
    <div className="bg-[url('/BackGroundImg_2.jpg')] min-h-screen text-gray-800 flex justify-center items-center">
      <div className=" animate-fade-up">
        <div className="sm-m-10 bg-white shadow-2xl py-4 px-10 rounded-2xl flex flex-col jus justify-center items-center">
          <div className="flex">
            <h1 className=" font-bold justify-center font-tenada text-2xl">
              친구를 기다리는 중
            </h1>
            <div>
              <Typewriter text="...." delay={300} infinite />
            </div>
          </div>
          <CopyToClipboardButton roomId={roomId} />
        </div>

        {/* 메인 컨텐츠  */}
        <div className="h-full w-full mt-5 p-10 flex flex-col items-center  bg-white shadow-xl rounded-xl justify-center">
          {/* 비디오 */}
          <WaitingFreindVideoContainer
            localStream={localStream}
            // remoteStreams={remoteStreams}
            users={users}
          />
          {/* 버튼 */}
          <CreateRoomPageFooter
            isActivate={isAllPlayerReady}
            onStart={handleStartGame}
            progressValue={progressValue}
          />
        </div>
      </div>
    </div>
  );
};

export default WaitingPage;
