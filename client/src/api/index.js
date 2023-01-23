import axios from "axios";
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
  headers: {
    "Content-type": "application/json",
    Accept: "application/json",
  },
});

// List of all the endpoints
export const sendOtp = (data) => API.post("/api/send-otp", data);
export const verifyOtp = (data) => API.post("/api/verify-otp", data);
export const activate = (data) => API.post("/api/activate", data);
export const login = (data) => API.post("/api/login", data);
export const logout = () => API.post("/api/logout");
// Post mean create a room
export const createRoom = (data) => API.post("api/rooms", data);
export const getAllRooms = (page) => API.get(`/api/rooms?page=${page}`);
export const getRoomDetails = (roomId) => API.get(`/api/rooms/${roomId}`);
export const getAllUsers = (page) => API.get(`/api/peoples?page=${page}`);
export const getSingleUser = (userId) => API.get(`/api/user/${userId}`);
export const followUser = (userId) => API.put(`/api/user/${userId}/followUser`);

export const compileCode = (data) => API.post("api/compile", data);
export const submitCode = (data) => API.post("api/submit", data);
export const challangeFinished = (data) =>
  API.post("api/challangeFinished", data);

// Testing
export const deleteRoom = (roomId) =>
  API.post(`/api/room/${roomId}/deleteRoom`, roomId);

export const deleteSingleUser = (userId) =>
  API.delete(`/api/user/${userId}/deleteAccount`);

export const updateProfileImage = (imageDetails) =>
  API.put(`/api/user/${imageDetails.userId}/updateProfile`, imageDetails);

export const getAllFollowers = (userId) =>
  API.get(`/api/user/${userId}/getAllFollowers`);
export const getAllFollowing = (userId) =>
  API.get(`/api/user/${userId}/getAllFollowing`);

//Interceptors
API.interceptors.response.use(
  (config) => {
    return config; //we dont have to do anything with config
  },
  async (error) => {
    const originalRequest = error.config;
    //if the status code is 401 means it token expired so refresh the token
    if (
      error.response.status === 401 &&
      originalRequest &&
      !originalRequest._isRetry
    ) {
      //for the first time if then isRetry = undefined so we can enter but
      //we set it to true so next time it will not enter in it.
      originalRequest._isRetry = true;
      try {
        //call with axios not with API axios instance
        //bcz next time new instance will created and you cannot get the old one's data and methods
        await axios.get(`${process.env.REACT_APP_API_URL}/api/refresh`, {
          withCredentials: true, //for sending the cookies
        });

        return API.request(originalRequest);
      } catch (error) {
        console.log(error.message);
      }
    }
    throw error;
  }
);

export default API;
