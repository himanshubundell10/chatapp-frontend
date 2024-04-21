import { configureStore } from "@reduxjs/toolkit";
import api from "./api/api";
import { authReducer } from "./reducer/auth";
import { chatReducer } from "./reducer/chat";
import { miscReducer } from "./reducer/misc";

export const store = configureStore({
  reducer: {
    [authReducer.name]: authReducer.reducer,
    [miscReducer.name]: miscReducer.reducer,
    [chatReducer.name]: chatReducer.reducer,
    [api.reducerPath]: api.reducer,
  },

  middleware: (defaultMiddleware) => [...defaultMiddleware(), api.middleware],
});
