import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Castlist.css';

const CastList = ({ movieId }) => {
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCast = async () => {
      try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
          params: { api_key: '013044f24bc916f73380c8a21b491d6b' },
        });
        setCast(response.data.cast);
      } catch (error) {
        console.error('Error fetching cast data:', error);
        alert('Failed to load cast data.');
      } finally {
        setLoading(false);
      }
    };

    fetchCast();
  }, [movieId]);

  const handleSaveCast = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (cast.length === 0) {
      alert('No cast data to save.');
      return;
    }

    try {
      const response = await axios.post(`/movies/${movieId}/cast`, {
        cast,
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      alert('Cast data saved successfully!');
    } catch (error) {
      console.error('Error saving cast data:', error);
      alert('Error saving cast data.');
    }
  };

  if (loading) {
    return <p>Loading cast...</p>;
  }

  return (
    <div className="cast-list">

      <ul>
        {cast.map((member) => (
          <li key={member.id}>
            <img
              src={`https://image.tmdb.org/t/p/w200/${member.profile_path}`}
              alt={member.name}
              className="cast-image"
            />
            <div>
              <p><strong>{member.name}</strong></p>
              <p>Character: {member.character}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CastList;
