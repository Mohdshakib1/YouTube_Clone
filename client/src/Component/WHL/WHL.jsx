import React from 'react';
import Leftsidebar from '../Leftsidebar/Leftsidebar';
import './WHL.css';
import WHLvideolist from './WHLvideolist';
import { useSelector, useDispatch } from 'react-redux';
import { clearhistory } from '../../action/history';

const WHL = ({ page, videolist }) => {
  const currentuser = useSelector(state => state.currentuserreducer);
  const dispatch = useDispatch();

  const handleclearhistory = () => {
    if (currentuser?.result?._id) {
      dispatch(clearhistory({ userid: currentuser.result._id }));
    } else {
      alert("Please login to clear history");
    }
  };

  return (
    <div className="container_Pages_App">
      <Leftsidebar />
      <div className="container2_Pages_App">
        <div className="conatiner_whl">
          <div className="box_WHL leftside_whl">
            <b>Your {page} Shown Here</b>
            {page === "History" && currentuser?.result?._id && (
              <div className="clear_History_btn" onClick={handleclearhistory}>
                Clear History
              </div>
            )}
          </div>

          <div className="rightSide_whl">
            <h1>{page}</h1>
            <div className="whl_list">
              {currentuser?.result?._id ? (
                <WHLvideolist
                  page={page}
                  currentuser={currentuser.result._id}
                  videolist={videolist}
                />
              ) : (
                <p style={{ padding: "1rem", color: "gray" }}>
                  Please log in to view your {page}.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WHL;
