import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/authPage/LoginPage.jsx";
import HomePage from "./pages/homePage/HomePage.jsx";
import ResisterPage from "./pages/authPage/ResisterPage.jsx";
import CreateRoomPage from "./pages/createRoomPage/CreateRoomPage.jsx";
import WaitingPage from "./pages/waitingPage/WaitingPage.jsx";
import PlayRoomPage from "./pages/playPage/PlayRoomPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    // errorElement: <NotFount />,
    children: [
      {
        index: true,
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <ResisterPage />,
      },
      {
        path: "/entry",
        element: <CreateRoomPage />,
      },
      {
        path: "/waiting-friends/:roomId",
        element: <WaitingPage />,
      },
      {
        path: "/play-room/:roomId",
        element: <PlayRoomPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
