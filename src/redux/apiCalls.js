import axiosInstance from "@/auth_services/instance";
import { updateStart, updateSuccess, updateFailure } from "./userSlice";

export const updateUser = async (user, dispatch) => {
  dispatch(updateStart());
  try {
    const res = await axiosInstance.post(process.env.API_SERVER + "users", user);
    dispatch(updateSuccess(res.data));
  } catch (err) {
    dispatch(updateFailure());
  }
};

export const removeUser = async (user, dispatch) => {
  dispatch(updateStart());
  try {
    const res = await axiosInstance.delete(process.env.API_SERVER + "users" + user);
    dispatch(updateSuccess(res.data));
  } catch (err) {
    dispatch(updateFailure());
  }
};
