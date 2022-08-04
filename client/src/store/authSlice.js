import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuth: false,
  user: null,
  otp: {
    phone: "",
    email: "",
    hash: "",
  },
  register: {
    fullname: "",
    username: "",
    email: "",
    password: "",
    skill: "",
    interest: "",
    avatar: "",
    location: "",
  },
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      const { user } = action.payload;
      state.user = user;
      if (user === null) state.isAuth = false;
      else state.isAuth = true;
    },
    setOtp: (state, action) => {
      const { phone, hash, email } = action.payload;
      state.otp.phone = phone ? phone : "";
      state.otp.email = email ? email : "";
      state.otp.hash = hash;
    },
    setRegisterResponse: (state, action) => {
      state.register.fullname = action.payload.fullname;
      state.register.username = action.payload.username;
      state.register.email = action.payload.email;
      state.register.password = action.payload.password;
    },
    setSkillInterest: (state, action) => {
      state.register.skill = action.payload.skill;
      state.register.interest = action.payload.interest;
    },
    setAvatar: (state, action) => {
      state.register.avatar = action.payload;
    },
    setLocation: (state, action) => {
      state.register.location = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setAuth,
  setOtp,
  setRegisterResponse,
  setSkillInterest,
  setAvatar,
  setLocation,
} = authSlice.actions;

export default authSlice.reducer;
