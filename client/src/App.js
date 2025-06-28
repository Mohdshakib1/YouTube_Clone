import './App.css';
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import Navbar from './Component/Navbar/Navbar';
import Allroutes from "../src/Allroutes";
import { BrowserRouter as Router } from 'react-router-dom';
import Drawersliderbar from '../src/Component/Leftsidebar/Drawersliderbar';
import Createeditchannel from './Pages/Channel/Createeditchannel';
import Videoupload from './Pages/Videoupload/Videoupload';

import { fetchallchannel } from './action/channeluser';
import { getallvideo } from './action/video';
import { getallcomment } from './action/comment';
import { getallhistory } from './action/history';
import { getalllikedvideo } from './action/likedvideo';
import { getallwatchlater } from './action/watchlater';
import { getDownloads } from './action/download';

function App() {
  const [toggledrawersidebar, settogledrawersidebar] = useState({
    display: "none"
  });

  const dispatch = useDispatch();
  const currentuser = useSelector(state => state.currentuserreducer);

  // ✅ Load user from localStorage into Redux
  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem("Profile"));
    if (profile) {
      dispatch({ type: "FETCH_CURRENT_USER", payload: profile });
    }
  }, [dispatch]);

  // ✅ Fetch initial app data
  useEffect(() => {
    dispatch(fetchallchannel());
    dispatch(getallvideo());
    dispatch(getallcomment());
    dispatch(getallhistory());
    dispatch(getalllikedvideo());
    dispatch(getallwatchlater());

    if (currentuser?.result?._id) {
      dispatch(getDownloads(currentuser.result._id));
    }
  }, [dispatch, currentuser]);

  const toggledrawer = () => {
    settogledrawersidebar(prevState => ({
      display: prevState.display === "none" ? "flex" : "none"
    }));
  };

  const [editcreatechanelbtn, seteditcreatechanelbtn] = useState(false);
  const [videouploadpage, setvideouploadpage] = useState(false);

  return (
    <Router>
      {videouploadpage && (
        <Videoupload setvideouploadpage={setvideouploadpage} />
      )}

      {editcreatechanelbtn && (
        <Createeditchannel seteditcreatechanelbtn={seteditcreatechanelbtn} />
      )}

      <Navbar
        seteditcreatechanelbtn={seteditcreatechanelbtn}
        toggledrawer={toggledrawer}
      />

      <Drawersliderbar
        toggledraw={toggledrawer}
        toggledrawersidebar={toggledrawersidebar}
      />

      <Allroutes
        seteditcreatechanelbtn={seteditcreatechanelbtn}
        setvideouploadpage={setvideouploadpage}
      />
    </Router>
  );
}

export default App;
