import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    userInfo: {
      user_id: null,
      user_name: null,
      name: null,
      email: null,
      role: null,
      organization: null,
      menu_role: null,
    },
    pending: null,
    error: null,
  },
  reducers: {
    assignUser: (state, action) => {
      state.user_id = action.payload.user_id;
      state.user_name = action.payload.user_name;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.organization = action.payload.organization;
      state.menu_role = action.payload.menu_role;
    },
    removeUser: (state) => {
      state.user_id = null;
      state.user_name = null;
      state.name = null;
      state.email = null;
      state.role = null;
      state.organization = null;
      state.menu_role = null;
    },
  },
});

export const { updateStart, updateSuccess, updateFailure } = userSlice.actions;

export default userSlice.reducer;
