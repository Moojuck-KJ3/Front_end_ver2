import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/homePage/HomePage";
import LoginPage from "./pages/authPage/LoginPage";
import ResisterPage from "./pages/authPage/ResisterPage";
import CreateRoomPage from "./pages/createRoomPage/CreateRoomPage";
import PlayRoomPage from "./pages/playPage/PlayRoomPage";
import WaitingPage from "./pages/waitingPage/WaitingPage";
import { useLocalCameraStream } from "./realtimeComunication/webRTCManager";

function App() {
  const { localStream } = useLocalCameraStream();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<ResisterPage />} />
        <Route path="/entry" element={<CreateRoomPage />} />
        <Route
          path="/waiting-friends/:roomId"
          element={<WaitingPage localStream={localStream} />}
        />
        <Route
          path="/play-room/:roomId"
          element={<PlayRoomPage localStream={localStream} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
