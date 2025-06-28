import { combineReducers } from "redux";
import authreducer from "./auth";
import currentuserreducer from "./currentuser";
import chanelreducer from "./chanel";
import videoreducer from "./video";
import commentreducer from "./comment";
import historyreducer from "./history";
import likedvideoreducer from "./likedvideo";
import watchlaterreducer from "./watchlater";
import downloadReducer from "./download"; // Fixed import name

export default combineReducers({
  authreducer,
  currentuserreducer,
  videoreducer,
  chanelreducer,
  commentreducer,
  historyreducer,
  downloadReducer, // Consistent naming
  likedvideoreducer,
  watchlaterreducer
});