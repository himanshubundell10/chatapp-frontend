import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  loader: true,
};

export const authReducer = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userExists: (state, action) => {
      state.user = action.payload;
      state.loader = false;
    },
    userNotExists: (state) => {
      state.user = null;
      state.loader = false;
    },
  },
});

export const { userExists, userNotExists } = authReducer.actions;
