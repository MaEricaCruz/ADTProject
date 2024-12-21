import { useNavigate } from 'react-router-dom';
import './Home.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useMovieContext } from '../../../../context/MovieContext';
import MovieCards from '../../../../components/MovieCards/MovieCards';


const Home = () => {
  const navigate = useNavigate();
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const { movieList, setMovieList, setMovie } = useMovieContext();
  const [trailerKey, setTrailerKey] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);


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

  const handleShowMore = () => {
    setShowAll((prevShowAll) => !prevShowAll);
  };

  const movieToShow = showAll ? movieList : movieList.slice(0, 10);


  const watchTrailer = async (movieId) => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieId}/videos`,
        {
          params: {
            api_key: '013044f24bc916f73380c8a21b491d6b', 
            language: 'en-US',
          },
        }
      );
      const trailers = response.data.results;
      const trailer = trailers.find((vid) => vid.type === 'Trailer' && vid.site === 'YouTube');
      if (trailer) {
        setTrailerKey(trailer.key);
        setIsModalOpen(true);
      } else {
        alert('No trailer available for this movie.');
      }
    } catch (error) {
      console.error('Error fetching trailer:', error);
      alert('Failed to fetch the trailer. Please try again later.');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTrailerKey(null);
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

  const setSelectedMovie = (movie) => {
    console.log('Selected movie:', movie);
  };


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
          onClick={() => {
            setSelectedMovie(featuredMovie);
          }}
        >
          <div className="movie-details">
            <h1 className="featured-movie-title">{featuredMovie.title}</h1>
            <p className="movie-info">
              {`HD | ${
                featuredMovie.releaseDate
                  ? new Date(featuredMovie.releaseDate).getFullYear()
                  : 'N/A'
              } | ${featuredMovie.voteAverage.toFixed(1) || 'N/A'}`}
            </p>
            <p className="movie-description">
              {featuredMovie.overview || 'No description available.'}
            </p>

            <button
               className="watch-now-button"
               onClick={() => { console.log('Navigating to movie ID:', featuredMovie.tmdbId);
               navigate(`/main/movies/view/${featuredMovie.tmdbId}`);}}>Watch Now
            </button>

            <button
              className="watch-trailer-button"
              onClick={() => watchTrailer(featuredMovie.tmdbId || featuredMovie.id)}>Watch Trailer
            </button>
          </div>
        </div>
      )}

      <p className="page-title">Movies</p>
      {movieList && movieList.length ? (
        <div className="list-container">
          {movieList.map((movie) => (
            <MovieCards
              key={movie.id}
              movie={movie}
              onClick={() => {console.log('Navigating to movie ID:',  movie.tmdbId);
                navigate(`/main/movies/view/${movie.tmdbId}`);
                setMovie(movie);
              }}
            />
          ))}
        </div>
      ) : (
        <div>Loading movies...</div>
      )}

      {isModalOpen && trailerKey && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeModal}>
              ×
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}`}
              width="560"
              height="315"
              title="YouTube Trailer"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
