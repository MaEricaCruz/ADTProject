import React from 'react';
import './MovieCards.css';

const MovieCards = ({ movie, onClick }) => {
  return (
    <div className="movie-card" onClick={onClick}>
      <h1>Movies</h1>
      <img
        src={movie.posterPath || 'placeholder-image.jpg'} 
        alt={movie.title}
        className="movie-poster"
      />
      <h3 className="movie-title">{movie.title}</h3>
    </div>
  );
};

export default MovieCards;
