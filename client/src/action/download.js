import axios from "axios";
import {
  DOWNLOADS_REQUEST,
  DOWNLOADS_SUCCESS,
  DOWNLOADS_FAIL,
  ADD_DOWNLOAD_REQUEST,
  ADD_DOWNLOAD_SUCCESS,
  ADD_DOWNLOAD_FAIL,
} from "./type";

export const addToDownloads = (downloadData) => async (dispatch) => {
  try {
    dispatch({ type: ADD_DOWNLOAD_REQUEST });

    const { data } = await axios.post("https://youtube-clone-6q33.onrender.com/api/downloads/add", downloadData);

    // This part is important: check for failure from backend
    if (!data.success) {
      dispatch({ type: ADD_DOWNLOAD_FAIL, payload: data.message || "Download failed" });

      return { payload: { 
        success: false, 
        limitReached: !!data.limitReached, 
        message: data.message || "Download blocked" 
      }};
    }

    dispatch({ type: ADD_DOWNLOAD_SUCCESS, payload: data });
    return { payload: { success: true, ...data } };

  } catch (error) {
    const errMsg = error.response?.data?.message || "Failed to add download";
    dispatch({ type: ADD_DOWNLOAD_FAIL, payload: errMsg });

    return { payload: { success: false, message: errMsg } };
  }
};


// ✅ Get all downloads for the user
export const getDownloads = (userId) => async (dispatch) => {
  try {
    dispatch({ type: DOWNLOADS_REQUEST });

    const { data } = await axios.get(`https://youtube-clone-6q33.onrender.com/api/downloads/user/${userId}`);
    dispatch({ type: DOWNLOADS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: DOWNLOADS_FAIL,
      payload: error.response?.data?.message || "Failed to fetch downloads",
    });
  }
};