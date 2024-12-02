import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Photolist.css';

const Photos = ({ movieId }) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/images`, {
          params: { api_key: '013044f24bc916f73380c8a21b491d6b' },
        });
        setPhotos(response.data.backdrops);
      } catch (error) {
        console.error('Error fetching photos:', error);
        alert('Failed to load photos.');
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, [movieId]);

  const handleSavePhotos = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (photos.length === 0) {
      alert('No photo data to save.');
      return;
    }

    try {
      const response = await axios.post(`/movies/${movieId}/photos`, {
        photos,
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      alert('Photos data saved successfully!');
    } catch (error) {
      console.error('Error saving photos data:', error);
      alert('Error saving photos data.');
    }
  };

  if (loading) {
    return <p>Loading photos...</p>;
  }

  return (
    <div className="photos">

      {/**<button onClick={handleSavePhotos}>Save Photos</button>**/}
      <div className="photos-grid">
        {photos.map((photo) => (
          <img
            key={photo.file_path}
            src={`https://image.tmdb.org/t/p/w300/${photo.file_path}`}
            alt="Movie scene"
            className="photo-image"
          />
        ))}
      </div>
    </div>
  );
};

export default Photos;
