import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './VideoList.css';

const Videos = ({ movieId }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/videos`, {
          params: { api_key: '013044f24bc916f73380c8a21b491d6b' },
        });
        setVideos(response.data.results);
      } catch (error) {
        console.error('Error fetching video data:', error);
        alert('Failed to load video data.');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [movieId]);

  const handleSaveVideos = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (videos.length === 0) {
      alert('No video data to save.');
      return;
    }

    try {
      const response = await axios.post(`/movies/${movieId}/videos`, {
        videos,
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      alert('Videos data saved successfully!');
    } catch (error) {
      console.error('Error saving videos data:', error);
      alert('Error saving videos data.');
    }
  };

  if (loading) {
    return <p>Loading videos...</p>;
  }

  return (
    <div className="videos">
      {/**<button onClick={handleSaveVideos}>Save Videos</button>**/}
      {videos.length > 0 ? (
        <ul>
          {videos.map((video) => (
            <li key={video.id}>
              <iframe
                title={video.name}
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/${video.key}`}
                allowFullScreen
              ></iframe>
              <p>{video.name}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No videos found for this movie.</p>
      )}
    </div>
  );
};

export default Videos;
