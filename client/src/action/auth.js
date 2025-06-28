import * as api from "../Api";
import { setcurrentuser } from "./currentuser";

export const login = (authdata) => async (dispatch) => {
  try {
    const { data } = await api.login(authdata);
    dispatch({ type: "AUTH", data });
    dispatch(setcurrentuser(JSON.parse(localStorage.getItem('Profile'))));
  } catch (error) {
    alert(error);
  }
};

// Add this new action to fetch current user
export const fetchCurrentUser = () => async (dispatch) => {
  try {
    const profile = JSON.parse(localStorage.getItem('Profile'));
    if (profile && profile.token) {
      // You might need to create an API endpoint to fetch user details
      // For now, we'll just dispatch the stored profile
      dispatch(setcurrentuser(profile));
    }
  } catch (error) {
    console.error("Failed to fetch current user:", error);
  }
};