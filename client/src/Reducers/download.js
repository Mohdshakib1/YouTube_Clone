import {
  DOWNLOADS_REQUEST,
  DOWNLOADS_SUCCESS,
  DOWNLOADS_FAIL,
  ADD_DOWNLOAD_REQUEST,
  ADD_DOWNLOAD_SUCCESS,
  ADD_DOWNLOAD_FAIL,
  REMOVE_DOWNLOAD,
  DOWNLOAD_ERROR
} from "../action/type";

const initialState = {
  downloads: [],
  loading: false,
  error: null,
};

const download = (state = initialState, action) => {
  switch (action.type) {
    case DOWNLOADS_REQUEST:
    case ADD_DOWNLOAD_REQUEST:
      return { ...state, loading: true };

    case DOWNLOADS_SUCCESS:
      return { ...state, downloads: action.payload, loading: false };

    case ADD_DOWNLOAD_SUCCESS:
      return {
        ...state,
        downloads: [...state.downloads, action.payload],
        loading: false,
      };

    case DOWNLOADS_FAIL:
    case ADD_DOWNLOAD_FAIL:
    case DOWNLOAD_ERROR:
      return { ...state, error: action.payload, loading: false };

    case REMOVE_DOWNLOAD:
      return {
        ...state,
        downloads: state.downloads.filter(d => d._id !== action.payload),
      };

    default:
      return state;
  }
};

export default download;
