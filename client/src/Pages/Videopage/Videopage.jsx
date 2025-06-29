import React, { useEffect, useState, useRef } from 'react';
import axios from "axios";
import "./Videopage.css";
import moment from 'moment';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Likewatchlatersavebtns from './Likewatchlatersavebtns';
import Comment from '../../Component/Comment/Comment';

import { viewvideo } from '../../action/video';
import { addtohistory } from '../../action/history';
import { fetchCurrentUser } from "../../action/currentuser";
import { addToDownloads, getDownloads } from '../../action/download';
import { FaCrown, FaTimes } from "react-icons/fa";

const Videopage = () => {
  const { vid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const API = process.env.REACT_APP_API || "https://youtube-clone-6q33.onrender.com";

  const vids = useSelector(state => state.videoreducer);
  const currentUser = useSelector(state => state.currentuserreducer);
const downloadState = useSelector(state => state.downloadReducer);
const downloads = downloadState.downloads || [];

  const videoList = vids?.data || [];
  const vv = videoList?.find((q) => q._id === vid);

  const [currentPath, setCurrentPath] = useState("");
  const [selectedQuality, setSelectedQuality] = useState("");
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [premiumLoading, setPremiumLoading] = useState(false);
  const [animationText, setAnimationText] = useState("");
  const [isBlocked, setIsBlocked] = useState(false);

  const videoRef = useRef(null);
  const commentRef = useRef(null);
  const gestureRef = useRef({ count: 0, side: '', timeout: null });
  const viewedRef = useRef(false);

useEffect(() => {
  if (!viewedRef.current && vid) {
    dispatch(viewvideo({ id: vid }));
    viewedRef.current = true;
  }
}, [vid]);


  useEffect(() => {
    if (currentUser?.result?._id) {
      dispatch(getDownloads(currentUser.result._id));
      const expiry = new Date(currentUser.result?.premiumExpiresAt);
      setIsPremium(currentUser.result?.isPremium && expiry > new Date());
    }
  }, [currentUser, dispatch]);


  useEffect(() => {
    if (downloads?.length > 0 && currentUser?.result?._id) {
      const downloaded = downloads.filter(d => d.userId === currentUser.result._id);
      const today = new Date().toDateString();
      const todaysDownloads = downloaded.filter(d => new Date(d.createdAt).toDateString() === today);
      const hasDownloadedThis = downloaded.some(d => d.videoId === vid);
      setIsDownloaded(hasDownloadedThis);
      if (todaysDownloads.length >= 1 && !hasDownloadedThis) {
        setIsBlocked(true);
      } else {
        setIsBlocked(false);
      }
    }
  }, [downloads, vid, currentUser]);


  useEffect(() => {
    if (currentUser?.result?._id) {
      dispatch(addtohistory({ videoid: vid, viewer: currentUser.result._id }));
    }
    
  }, [vid, currentUser, dispatch]);

  useEffect(() => {
    if (vv?.resolutions?.length > 0) {
      setCurrentPath(vv.resolutions[0].path);
      setSelectedQuality(vv.resolutions[0].res);
    } else if (vv?.filepath) {
      setCurrentPath(vv.filepath);
    }
  }, [vv]);

  const handleQualityChange = (e) => {
    const selectedRes = vv.resolutions.find(r => r.res === e.target.value);
    if (selectedRes) {
      setCurrentPath(selectedRes.path);
      setSelectedQuality(selectedRes.res);
      videoRef.current?.load();
    }
  };

  const handleDownload = async () => {
  if (!currentUser?.result?._id) return alert("Please login to download");

  const alreadyDownloaded = downloads?.some(d => d.videoId === vv._id && d.userId === currentUser.result._id);
  if (alreadyDownloaded) return alert("Video already downloaded");

  const today = new Date().toDateString();
  const userDownloadsToday = downloads.filter(
    d => d.userId === currentUser.result._id && new Date(d.createdAt).toDateString() === today
  );

  if (!isPremium && userDownloadsToday.length >= 1) {
    alert("❌ You can only download 1 video per day. Please upgrade to premium.");
    setShowPremiumModal(true);
    return;
  }

  setIsDownloading(true);
  try {
    const response = await dispatch(addToDownloads({
      userId: currentUser.result._id,
      videoId: vv._id,
      resolution: selectedQuality
    }));

    if (response?.payload?.success) {
      setIsDownloaded(true);
      alert("✅ Download successful");
      dispatch(getDownloads(currentUser.result._id));
    } else {
      alert("❌ Download failed");
    }
  } catch {
    alert("❌ Download failed");
  } finally {
    setIsDownloading(false);
  }
};




  const handleGestureTap = (side) => {
    const now = Date.now();
    if (!gestureRef.current.taps) gestureRef.current.taps = [];
    gestureRef.current.taps.push({ time: now, side });
    clearTimeout(gestureRef.current.timeout);

    gestureRef.current.timeout = setTimeout(() => {
      const recent = gestureRef.current.taps.filter(tap => now - tap.time < 700);
      const sameSide = recent.filter(tap => tap.side === side);
      const count = sameSide.length;
      const v = videoRef.current;
      if (!v) return;

      if (count === 1 && side === 'center') {
        if (v.paused) {
          v.play();
          setAnimationText("▶️");
        } else {
          v.pause();
          setAnimationText("⏸️");
        }
      } else if (count === 2) {
        if (side === 'left') {
          v.currentTime = Math.max(0, v.currentTime - 10);
          setAnimationText("-10s");
        } else if (side === 'right') {
          v.currentTime = Math.min(v.duration, v.currentTime + 10);
          setAnimationText("+10s");
        }
      } else if (count === 3) {
        if (side === 'center') {
          const currentIndex = videoList.findIndex(video => video._id === vid);
          const nextVideo = videoList[(currentIndex + 1) % videoList.length];
         navigate(`/videopage/${nextVideo._id}`);
        } else if (side === 'left') {
          commentRef.current?.scrollIntoView({ behavior: 'smooth' });
          setAnimationText("💬");
        } else if (side === 'right') {
          window.close();
          setTimeout(() => {
            window.location.href = 'about:blank';
          }, 100);
        }
      }

      gestureRef.current.taps = [];
      setTimeout(() => setAnimationText(""), 1000);
    }, 600);
  };

  const loadRazorpayScript = () => new Promise(resolve => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  const handlePremiumUpgrade = async () => {

      if (!currentUser?.result?._id) {
    alert("⚠️ Please login first to upgrade to premium");
    setShowPremiumModal(false);
    return;
  }

  const loaded = await loadRazorpayScript();
  if (!loaded) return alert("Razorpay SDK failed to load");

  try {
    const { data: order } = await axios.post(`${API}/api/payment/create-order`);
    const options = {
      key: "rzp_test_5YBxNR7cwxlViu",
      amount: order.amount,
      currency: order.currency,
      name: "YourTube Premium",
      description: "Unlimited downloads",
      order_id: order.id,
      handler: async (res) => {
        const verify = await axios.post(`${API}/api/payment/verify`, {
          ...res,
          userId: currentUser.result._id
        });
        if (verify.data.success) {
          alert("✅ Premium activated. Please login again.");

          // Logout user and redirect
          localStorage.removeItem("Profile");
          dispatch({ type: "FETCH_CURRENT_USER", payload: null });
          setShowPremiumModal(false);
          navigate("/");
        } else {
          alert("❌ Payment verification failed.");
        }
      },
      prefill: {
        name: currentUser.result.name || "User",
        email: currentUser.result.email || "email@example.com",
      },
      theme: { color: "black" }
    };
    new window.Razorpay(options).open();
  } catch (err) {
    console.error(err);
    alert("❌ Something went wrong");
  }
};


  return (
    <div className="container_videoPage">
      <div className="container2_videoPage">
        <div className="video_display_screen_videoPage">
    <div className="video-wrapper">
            <video
  ref={videoRef}
  src={`${API}/${currentPath}`}
  className="video_ShowVideo_videoPage"
  key={currentPath}
  controls
  playsInline
  disablePictureInPicture
  onContextMenu={(e) => e.preventDefault()} // prevent right-click download
/>

            <div className="tap-zone tap-left" onClick={() => handleGestureTap('left')}></div>
            <div className="tap-zone tap-center" onClick={() => handleGestureTap('center')}></div>
            <div className="tap-zone tap-right" onClick={() => handleGestureTap('right')}></div>
            {animationText && <div className="tap-gesture-animation">{animationText}</div>}
          </div>

      

          <div className="quality_premium_section">
            {vv?.resolutions?.length > 0 && (
              <div className="quality_selector">
                <strong>Quality:</strong>
                <select value={selectedQuality} onChange={handleQualityChange} disabled={isDownloading}>
                  {vv.resolutions.map((resObj, index) => (
                    <option key={index} value={resObj.res}>{resObj.res}</option>
                  ))}
                </select>
              </div>
            )}
            {isPremium ? (
              <div className="premium-badge"><FaCrown /> Premium Member</div>
            ) : (
              <button className="premium_button" onClick={() => setShowPremiumModal(true)} disabled={isDownloading}>
                Go Premium
              </button>
            )}
          </div>

          <div className="video_details_videoPage">
            <p className="video_title_VideoPage">{vv?.videotitle}</p>
            <div className="views_date_btns_VideoPage">
              <div className="views_videoPage">{vv?.views} views • {moment(vv?.createdAt).fromNow()}</div>
              <Likewatchlatersavebtns vv={vv} vid={vid} onDownload={handleDownload} isDownloaded={isDownloaded} isDownloading={isDownloading} currentuser={currentUser} />
            </div>
            <Link to='/' className='chanel_details_videoPage'>
              <b className="chanel_logo_videoPage"><p>{vv?.uploader?.charAt(0).toUpperCase()}</p></b>
              <p className="chanel_name_videoPage">{vv?.uploader}</p>
            </Link>
            <div className="comments_VideoPage" ref={commentRef}>
              <h2><u>Comments</u></h2>
              <Comment videoid={vv?._id} />
            </div>
          </div>
        </div>
      </div>

      {showPremiumModal && (
        <div className="premium-modal-overlay">
          <div className="premium-modal">
            <button className="close-modal" onClick={() => setShowPremiumModal(false)} disabled={premiumLoading}><FaTimes /></button>
            <h3>Go Premium</h3>
            <p>Unlock unlimited video downloads</p>
            <div className="premium-features">
              <ul>
                <li>Unlimited downloads</li>
                <li>No daily limits</li>
                <li>Highest quality videos</li>
                <li>Ad-free experience</li>
              </ul>
            </div>
            <div className="premium-price">Only <span>₹499</span>/month</div>
            <button className="upgrade-button" onClick={handlePremiumUpgrade} disabled={premiumLoading}>
              {premiumLoading ? 'Processing...' : 'Upgrade Now'}
            </button>
            <p className="cancel-info">Cancel anytime</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Videopage;