import { useNavigate } from 'react-router-dom';
import './Home.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import MovieCards from '../../../../components/MovieCards/MovieCards';
import { useMovieContext } from '../../../../context/MovieContext';

const Home = () => {
  const navigate = useNavigate();
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const { movieList, setMovieList, setMovie } = useMovieContext();


  const getMovies = () => {
    axios
      .get('/movies') 
      .then((response) => {
        const movies = response.data;
        setMovieList(movies);

        
        if (movies.length) {
          const random = Math.floor(Math.random() * movies.length);
          setFeaturedMovie(movies[random]);
        }
      })
      .catch((error) => console.error('Failed to fetch movies:', error));
  };


  useEffect(() => {
    getMovies();
  }, []);


  useEffect(() => {
    const interval = setInterval(() => {
      if (movieList.length) {
        const random = Math.floor(Math.random() * movieList.length);
        setFeaturedMovie(movieList[random]);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [movieList]);

  return (
    <div className="main-container">
    {featuredMovie && (
  <div
    className="featured-backdrop"
    style={{
      backgroundImage: `url(${
        featuredMovie.backdropPath
          ? `https://image.tmdb.org/t/p/original/${featuredMovie.backdropPath}`
          : featuredMovie.posterPath || 'placeholder-backdrop.jpg'
      })`,
    }}
  >
    <div className="movie-details">
      <h1 className="featured-movie-title">{featuredMovie.title}</h1>
      <p className="movie-info">
        {`HD | ${featuredMovie.releaseDate ? new Date(featuredMovie.releaseDate).getFullYear()  : 'N/A' }| ${featuredMovie.voteAverage.toFixed(1)  || 'N/A' }`}</p>
  
      <p className="movie-description">{featuredMovie.overview || 'No description available.'}</p>
      <button
        className="watch-now-button"
        onClick={() => navigate(`/movies/${featuredMovie.id}`)}
      >
        Watch Now
      </button>
    </div>
  </div>
)}

<p className="page-title">Trending Movies</p>
{movieList && movieList.length ? (
  <div className="list-container">
    {movieList.map((movie) => (
      <MovieCards
        key={movie.id}
        movie={movie}
        onClick={() => {
          navigate(`/movies/${movie.id}`);
          setMovie(movie);
        }}
      />
    ))}
  </div>
) : (
  <div>Loading movies...</div>
)}

    </div>
  );
};

export default Home;
