export const SET_ROOM_ID = "SET_ROOM_ID";

export const setRoomId = (roomId) => ({
  type: SET_ROOM_ID,
  payload: roomId,
});

const initialState = {
  roomId: "", // 초기값은 빈 문자열로 설정
};

const roomReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ROOM_ID:
      return {
        ...state,
        roomId: action.payload,
      };
    default:
      return state;
  }
};

export default roomReducer;
