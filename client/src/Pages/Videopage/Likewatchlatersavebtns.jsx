import React, { useEffect, useState } from 'react';
import { BsThreeDots } from "react-icons/bs";
import {
  AiFillDislike, AiFillLike,
  AiOutlineDislike, AiOutlineLike
} from "react-icons/ai";
import {
  MdPlaylistAddCheck, MdFileDownload, MdCheckCircle
} from "react-icons/md";
import {
  RiHeartAddFill, RiPlayListAddFill,
  RiShareForwardLine
} from "react-icons/ri";
import "./Likewatchlatersavebtn.css";
import { useSelector, useDispatch } from 'react-redux';
import { likevideo } from '../../action/video';
import { addtolikedvideo, deletelikedvideo } from "../../action/likedvideo";
import { addtowatchlater, deletewatchlater } from '../../action/watchlater';

const Likewatchlatersavebtns = ({
  vv,
  vid,
  onDownload,
  isDownloaded,
  isDownloading,
  downloadProgress
}) => {
  const dispatch = useDispatch();
  const [savevideo, setsavevideo] = useState(false);
  const [dislikebtn, setdislikebtn] = useState(false);
  const [likebtn, setlikebtn] = useState(false);

  const currentuser = useSelector(state => state.currentuserreducer);
  const likedvideolist = useSelector(state => state.likedvideoreducer);
  const watchlaterlist = useSelector(state => state.watchlaterreducer);

  useEffect(() => {
    if (currentuser?.result?._id) {
      const likedData = Array.isArray(likedvideolist?.data) ? likedvideolist.data : [];
      const watchLaterData = Array.isArray(watchlaterlist?.data) ? watchlaterlist.data : [];

      const isLiked = likedData.some(
        (q) => q.videoid === vid && q.viewer === currentuser.result._id
      );
      const isSaved = watchLaterData.some(
        (q) => q.videoid === vid && q.viewer === currentuser.result._id
      );

      setlikebtn(isLiked);
      setsavevideo(isSaved);
    }
  }, [currentuser, likedvideolist, watchlaterlist, vid]);

  if (!vv || typeof vv !== 'object') return null;

  const togglesavedvideo = () => {
    if (currentuser?.result?._id) {
      if (savevideo) {
        setsavevideo(false);
        dispatch(deletewatchlater({ videoid: vid, viewer: currentuser.result._id }));
      } else {
        setsavevideo(true);
        dispatch(addtowatchlater({ videoid: vid, viewer: currentuser.result._id }));
      }
    } else {
      alert("Please login to save video");
    }
  };

  const togglelikevideo = (e, lk) => {
    if (currentuser?.result?._id) {
      if (likebtn) {
        setlikebtn(false);
        dispatch(likevideo({ id: vid, Like: lk - 1 }));
        dispatch(deletelikedvideo({ videoid: vid, viewer: currentuser.result._id }));
      } else {
        setlikebtn(true);
        dispatch(likevideo({ id: vid, Like: lk + 1 }));
        dispatch(addtolikedvideo({ videoid: vid, viewer: currentuser.result._id }));
        setdislikebtn(false);
      }
    } else {
      alert("Please login to like video");
    }
  };

  const toggledislikevideo = (e, lk) => {
    if (currentuser?.result?._id) {
      if (dislikebtn) {
        setdislikebtn(false);
      } else {
        setdislikebtn(true);
        if (likebtn) {
          dispatch(likevideo({ id: vid, Like: lk - 1 }));
          dispatch(deletelikedvideo({ videoid: vid, viewer: currentuser.result._id }));
        }
        setlikebtn(false);
      }
    } else {
      alert("Please login to dislike video");
    }
  };

  return (
    <div className="btns_cont_videoPage">
      <div className="btn_VideoPage">

        {/* Like Button */}
        <div className="like_videoPage" onClick={(e) => togglelikevideo(e, vv.Like)}>
          {likebtn ? (
            <AiFillLike size={22} className='btns_videoPage' />
          ) : (
            <AiOutlineLike size={22} className='btns_videoPage' />
          )}
          <b>{vv.Like}</b>
        </div>

        {/* Dislike Button */}
        <div className="like_videoPage" onClick={(e) => toggledislikevideo(e, vv.Like)}>
          {dislikebtn ? (
            <AiFillDislike size={22} className='btns_videoPage' />
          ) : (
            <AiOutlineDislike size={22} className='btns_videoPage' />
          )}
          <b>DISLIKE</b>
        </div>

        {/* Save to Watch Later */}
        <div className="like_videoPage" onClick={togglesavedvideo}>
          {savevideo ? (
            <>
              <MdPlaylistAddCheck size={22} className='btns_videoPage' />
              <b>Saved</b>
            </>
          ) : (
            <>
              <RiPlayListAddFill size={22} className='btns_videoPage' />
              <b>Save</b>
            </>
          )}
        </div>

        {/* Download Button */}
        <div className="download_video" onClick={onDownload}>
          {isDownloading ? (
            <>
              <div className="download-spinner"></div>
              <b>{downloadProgress || 0}%</b>
            </>
          ) : isDownloaded ? (
            <>
              <MdCheckCircle size={22} className='btns_videoPage downloaded-icon' />
              <b>Downloaded</b>
            </>
          ) : (
            <>
              <MdFileDownload size={22} className='btns_videoPage' />
              <b>Download</b>
            </>
          )}
        </div>

        {/* Thanks */}
        <div className="like_videoPage">
          <RiHeartAddFill size={22} className="btns_videoPage" />
          <b>Thanks</b>
        </div>

        {/* Share */}
        <div className="like_videoPage">
          <RiShareForwardLine size={22} className='btns_videoPage' />
          <b>Share</b>
        </div>

        {/* More */}
        <div className="btn_VideoPage">
          <BsThreeDots />
        </div>

      </div>
    </div>
  );
};

export default Likewatchlatersavebtns;
