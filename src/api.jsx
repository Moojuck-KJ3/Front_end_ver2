import axios from "axios";
//import { logout } from "./shared/utils/auth";

export const logout = () => {
  localStorage.clear();
  window.location.pathname = "/login";
};

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_APP_BACKEND_PROD_URL + "/api", // main url
  timeout: 7000,
});

apiClient.interceptors.request.use(
  (config) => {
    const userDetails = localStorage.getItem("user");

    if (userDetails) {
      const token = JSON.parse(userDetails).token;
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// public routes
export const login = async (data) => {
  try {
    const response = await apiClient.post("/users/login", data);

    const responseData = {
      id: response.data.userDetails._id,
      token: response.data.userDetails.token,
      username: response.data.userDetails.username,
      email: response.data.userDetails.email,
    };

    return responseData;
  } catch (exception) {
    return {
      error: true,
      exception,
    };
  }
};

export const register = async (data) => {
  try {
    const response = await apiClient.post("/users/register", data);

    const responseData = {
      id: response.data._id,
      username: response.data.userDetails.username,
      token: response.data.userDetails.token,
      email: response.data.userDetails.email,
    };

    return responseData;
  } catch (exception) {
    return {
      error: true,
      exception,
    };
  }
};

// Room API
// 1. 모든 요청은 roomId를 파라미터로 받는다
// 2. get 요청엔 response가 있음
// 3. post 요청엔 response가 없음 (socket.io로 통신하고 해당 방의 모든 유저에게 브로드캐스트하는 방식)

// 음식 종류 수집 페이지에서 유저가 말한 음식 종류를 서버에 전달한다
// data : {userSpeech : string}
export const sendFoodCategorySpeech = async (roomId, data) => {
  try {
    return await apiClient.post(
      `/foodcategories/speech?roomId=${roomId}`,
      data
    );
  } catch (exception) {
    checkResponseCode(exception);
    return {
      error: true,
      exception,
    };
  }
};

// 처음에 client에서 대량의 data를 받을 것
// 따라서 server에서 '정제된' 키워드를 socket으로 받을 예정이다
// data : {userSpeech : string}
export const sendMoodKeywordSpeech = async (roomId, data) => {
  try {
    return await apiClient.post(`/keywords/mood/speech?roomId=${roomId}`, data);
  } catch (exception) {
    checkResponseCode(exception);
    return {
      error: true,
      exception,
    };
  }
};

// play-room 진입 시, 식당 리스트들을 받기 위한 요청
// data : {"purposeCoordinate" : {lat : number, lng : number}}
/*
  response : [
    {
      restId : string,
      restName : string, 
      rating : number,            // 별점
      foodCategory : string[],
      moodKeyword : string[],
      menu : string[], 
      thumbnailURL : string,
      position : {number,number}, // 좌표
      “miniStarUrl” : string,
      “BigStarUrl” : string,
      “FoodUrl” : string,
    }
  ]
*/

export const getRestaurantList = async (roomId, data, retries = 3) => {
  const requestFunction = () =>
    apiClient.post(`/restaurants/get?roomId=${roomId}`, data);
  return await retryRequest(requestFunction, retries);
};

const checkResponseCode = (exception) => {
  const responseCode = exception?.response?.status;

  if (responseCode) {
    (responseCode === 401 || responseCode === 403) && logout();
  }
};

// 중요한 요청의 경우, 실패시
// 재시도 하도록 해당 모듈을 추가함
const retryRequest = async (requestFunction, retries = 3, delay = 1000) => {
  try {
    return await requestFunction();
  } catch (error) {
    if (retries > 0) {
      console.log(`Request failed, retrying (${retries}/${3})`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return retryRequest(requestFunction, retries - 1, delay);
    } else {
      console.error("Max retries exceeded. Request failed.");
      throw error;
    }
  }
};
