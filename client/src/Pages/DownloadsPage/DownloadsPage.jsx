import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDownloads } from "../../action/download";
import "./DownloadsPage.css";

const DownloadsPage = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.currentuserreducer);
  const { downloads } = useSelector(state => state.downloadReducer);
  const API = process.env.REACT_APP_API || "https://youtube-clone-6q33.onrender.com";

  const videoRefs = useRef([]);

  useEffect(() => {
    if (currentUser?.result?._id) {
      dispatch(getDownloads(currentUser.result._id));
    }
  }, [dispatch, currentUser]);

  const handlePlay = (index) => {
    videoRefs.current.forEach((video, i) => {
      if (i !== index && video && !video.paused) {
        video.pause();
      }
    });
  };

  if (!currentUser?.result?._id) {
    return (
      <div className="downloads-container">
        <h2>Your Downloads</h2>
        <p className="login-warning">⚠️ Please login to see your downloaded videos.</p>
      </div>
    );
  }

  return (
    <div className="downloads-container">
      <h2>Your Downloads</h2>
      {downloads.length === 0 ? (
        <p className="empty-download">No downloads yet.</p>
      ) : (
        <div className="downloads-grid">
          {downloads.map((download, i) => (
            <div key={i} className="download-card">
              <video
                ref={(el) => (videoRefs.current[i] = el)}
                src={`${API}/${download.path}`}
                controls
                className="download-video"
                onPlay={() => handlePlay(i)}
              />
              <div className="download-meta">
                <h3 className="video-title">{download.title || "Untitled Video"}</h3>
                <p><strong>Resolution:</strong> {download.resolution}</p>
               <p><strong>Downloaded on:</strong> {download.createdAt ? new Date(download.createdAt).toLocaleDateString() : "Unknown"}</p>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DownloadsPage;
