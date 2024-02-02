import React from "react";
import MicButton from "./MicButton";
import CloseRoomButton from "./CloseRoomButton";
import CameraButton from "./CameraButton";
import { connect } from "react-redux";

const RoomButton = () => {
  return (
    <div className="w-full h-[35px] bg-[#40BFFF] rounded-b-lg flex justify-center items-center">
      <MicButton />
      <CameraButton />
      <CloseRoomButton />
    </div>
  );
};

const mapStoreStateToProps = ({ room }) => {
  return {
    ...room,
  };
};

export default connect(mapStoreStateToProps)(RoomButton);
