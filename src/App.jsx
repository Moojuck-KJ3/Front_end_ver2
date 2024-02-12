import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/homePage/HomePage";
import LoginPage from "./pages/authPage/LoginPage";
import ResisterPage from "./pages/authPage/ResisterPage";
import CreateRoomPage from "./pages/createRoomPage/CreateRoomPage";
import PlayRoomPage from "./pages/playPage/PlayRoomPage";
import WaitingPage from "./pages/waitingPage/WaitingPage";
import {
  useLocalCameraStream,
  usePeerConnection,
} from "./realtimeComunication/webRTCManager";
import { useEffect, useState } from "react";

function App() {
  const { localStream } = useLocalCameraStream();
  const { remoteStreams } = usePeerConnection(localStream);

  const [roomDetail, setRoomDetail] = useState({
    roomId: "",
    purposeCoordinate: { lat: null, lng: null },
    roomMemberCount: 0,
    playerId: null,
    playerStreams: {},
  });

  useEffect(() => {
    console.log(roomDetail);
  }, [roomDetail]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<ResisterPage />} />
        <Route
          path="/entry"
          element={
            <CreateRoomPage
              localStream={localStream}
              roomDetail={roomDetail}
              setRoomDetail={setRoomDetail}
            />
          }
        />
        <Route
          path="/waiting-friends/:roomId"
          element={
            <WaitingPage
              localStream={localStream}
              remoteStreams={remoteStreams}
              roomDetail={roomDetail}
              setRoomDetail={setRoomDetail}
            />
          }
        />
        <Route
          path="/play-room/:roomId"
          element={
            <PlayRoomPage
              localStream={localStream}
              remoteStreams={remoteStreams}
              roomDetail={roomDetail}
              setRoomDetail={setRoomDetail}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
