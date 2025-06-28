import React, { useMemo } from 'react';
import Leftsidebar from '../../Component/Leftsidebar/Leftsidebar';
import Showvideogrid from '../../Component/Showvideogrid/Showvideogrid';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const Search = () => {
  const { searchquery } = useParams();
  const videoData = useSelector((state) => state?.videoreducer?.data || []);

  // Case-insensitive filtering
  const filteredVideos = useMemo(() => {
    return videoData.filter(video =>
      video?.videotitle?.toLowerCase().includes(searchquery?.toLowerCase())
    );
  }, [videoData, searchquery]);

  return (
    <div className="container_Pages_App">
      <Leftsidebar />
      <div className="container2_Pages_App">
        <Showvideogrid vid={filteredVideos} />
      </div>
    </div>
  );
};

export default Search;
