import React from 'react'
import './Showvideo.css'
import { Link } from 'react-router-dom'
import moment from "moment"
const Showvideo = ({vid}) => {
    console.log(vid)
  return (
        <>
      <Link to={`/videopage/${vid._id}`}>
      <video
  src={`https://youtube-clone-6q33.onrender.com/${vid.resolutions?.[0]?.path || vid.filepath}`}
  className='video_ShowVideo'
  preload="metadata"
  muted
  playsInline
/>
    </Link>
    <div className="video_description">
        <div className="Chanel_logo_App">
            <div className="fstChar_logo_App">
            <>{vid?.uploader?.charAt(0).toUpperCase()}</>
            </div>
        </div>
    
    <div className="video_details">
        <p className="title_vid_ShowVideo">{vid?.videotitle}</p>
        <pre className="vid_views_UploadTime">{vid?.uploader}</pre>
        <pre className="vid_views_UploadTime">
            {vid?.views} views <div className="dot"></div>{moment(vid?.createdat).fromNow()}
        </pre>
    </div>
    </div>
    </>
  )
}

export default Showvideo