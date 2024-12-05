import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Castlist.css';

const CastList = ({ movieId }) => {
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false); 

  useEffect(() => {
    const fetchCast = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}/credits`,
          {
            params: { api_key: '013044f24bc916f73380c8a21b491d6b' },
          }
        );
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

  if (loading) {
    return <p>Loading cast...</p>;
  }


  const handleShowMore = () => {
    setShowAll((prevShowAll) => !prevShowAll);
  };

  const castToShow = showAll ? cast : cast.slice(0, 10); 

  return (
    <div className="cast-list">
      <div className="cast-header">
        <h2>Cast</h2>
        <button className="more-button" onClick={handleShowMore}>
          {showAll ? 'Show Less' : 'Show More'}
        </button>
      </div>
      <ul>
        {castToShow.map((member) => (
          <li key={member.id}>
            <img
              src={`https://image.tmdb.org/t/p/w200/${member.profile_path}`}
              alt={member.name}
              className="cast-image"
            />
            <div>
              <p>
                <strong>{member.name}</strong>
              </p>
              <p>Character: {member.character}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CastList;
