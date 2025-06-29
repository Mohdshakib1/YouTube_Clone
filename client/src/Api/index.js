import axios from "axios"

const API = axios.create({ baseURL: 'https://youtube-clone-6q33.onrender.com' });

API.interceptors.request.use((req) => {
  const profile = localStorage.getItem("Profile");
  if (profile) {
    req.headers.Authorization = `Bearer ${JSON.parse(profile).token}`;
  }
  return req;
});

export const apiInstance = API;

export const login=(authdata)=>API.post("/user/login",authdata);
export const updatechaneldata=(id,updatedata)=>API.patch(`/user/update/${id}`,updatedata)
export const fetchallchannel=()=>API.get("/user/getallchannel");

export const uploadvideo=(filedata,fileoption)=>API.post("/video/uploadvideo",filedata,fileoption)
export const getvideos=()=>API.get("/video/getvideos");
export const likevideo=(id,Like)=>API.patch(`/video/like/${id}`,{Like});
export const viewsvideo=(id)=>API.patch(`/video/view/${id}`);

export const postcomment=(commentdata)=>API.post('/comment/post',commentdata)
export const deletecomment=(id)=>API.delete(`/comment/delete/${id}`)
export const editcomment=(id,commentbody)=>API.patch(`/comment/edit/${id}`,{commentbody})
export const getallcomment=()=>API.get('/comment/get')

export const addtohistory=(historydata)=>API.post("/video/history",historydata)
export const getallhistory=()=>API.get('/video/getallhistory')
export const deletehistory=(userid)=>API.delete(`/video/deletehistory/${userid}`)

export const addtolikevideo=(likedvideodata)=>API.post('/video/likevideo',likedvideodata)
export const getalllikedvideo=()=>API.get('/video/getalllikevide')
export const deletelikedvideo=(videoid,viewer)=>API.delete(`/video/deletelikevideo/${videoid}/${viewer}`)

export const addtowatchlater=(watchlaterdata)=>API.post('/video/watchlater',watchlaterdata)
export const getallwatchlater=()=>API.get('/video/getallwatchlater')
export const deletewatchlater=(videoid,viewer)=>API.delete(`/video/deletewatchlater/${videoid}/${viewer}`)


export const addToDownloads = (userId, videoId) =>
  axios.post("https://youtube-clone-6q33.onrender.com/api/downloads/add", { userId, videoId });

export const getDownloads = (userId) =>
  axios.get(`https://youtube-clone-6q33.onrender.com/api/downloads/user/${userId}`);

export const upgradePremium = (userId) =>
  axios.post(`https://youtube-clone-6q33.onrender.com/api/downloads/premium/${userId}`);





