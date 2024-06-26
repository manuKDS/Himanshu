import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import productionReducer from "./productionSlice";

export default configureStore({
  reducer: {
    user: userReducer,
    production: productionReducer,
  },
});
