import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Photolist.css';

const Photos = ({ movieId }) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

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

  const handleShowMore = () => {
    setShowAll((prevShowAll) => !prevShowAll);
  };

  const photosToShow = showAll ? photos : photos.slice(0, 6);

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
      <div className="photos-header">
        <h2>Photos</h2>
        <button onClick={handleShowMore} className="show-more-button">
          {showAll ? 'Show Less' : 'Show More'}
        </button>
      </div>
      {photosToShow.length > 0 ? (
        <div className="photo-gallery">
          {photosToShow.map((photo) => (
            <img
              key={photo.file_path}
              src={`https://image.tmdb.org/t/p/w300/${photo.file_path}`}
              alt="Movie scene"
              className="photo-image"
            />
          ))}
        </div>
      ) : (
        <p>No photos found for this movie.</p>
      )}
    </div>
  );
};

export default Photos;
