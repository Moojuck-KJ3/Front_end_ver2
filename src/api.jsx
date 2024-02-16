import axios from "axios";
//import { logout } from "./shared/utils/auth";

export const logout = () => {
  localStorage.clear();
  window.location.pathname = "/login";
};

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_APP_BACKEND_PROD_URL + "/api", // main url
  timeout: 30000,
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

export const getRestaurantList = async (roomId, data, retries = 3) => {
  const requestFunction = () =>
    apiClient.post(`/restaurants?roomId=${roomId}`, data);
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
