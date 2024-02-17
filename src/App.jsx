import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/homePage/HomePage";
import LoginPage from "./pages/authPage/LoginPage";
import ResisterPage from "./pages/authPage/ResisterPage";
import CreateRoomPage from "./pages/createRoomPage/CreateRoomPage";
import PlayRoomPage from "./pages/playPage/PlayRoomPage";
import WaitingPage from "./pages/waitingPage/WaitingPage";
import { useLocalCameraStream } from "./realtimeComunication/webRTCManager";
import { useEffect, useState } from "react";
import { SocketProvider } from "./realtimeComunication/SocketContext";

function App() {
  const { localStream } = useLocalCameraStream();

  const [roomDetail, setRoomDetail] = useState({
    roomId: "",
    purposeCoordinate: { lat: null, lng: null },
    roomMemberCount: 0,
    playerInfo: null,
    userStreams: {},
  });

  useEffect(() => {
    console.log(roomDetail);
  }, [roomDetail]);

  return (
    <BrowserRouter>
      <SocketProvider>
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
                roomDetail={roomDetail}
                setRoomDetail={setRoomDetail}
              />
            }
          />
        </Routes>
      </SocketProvider>
    </BrowserRouter>
  );
}

export default App;
