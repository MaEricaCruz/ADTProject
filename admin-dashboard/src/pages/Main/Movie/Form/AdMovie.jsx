import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import './AdMovie.css';

const AdMovie = () => { 
  const [query, setQuery] = useState('');
  const [searchedMovieList, setSearchedMovieList] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(undefined);
  const [formState, setFormState] = useState({
    title: '',
    overview: '',
    popularity: '',
    releaseDate: '',
    voteAverage: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  let { movieId } = useParams();

  useEffect(() => {
    if (movieId) {
      axios.get(`/movies/${movieId}`)
        .then((response) => {
          const movie = response.data;
          setFormState({
            title: movie.title,
            overview: movie.overview,
            popularity: movie.popularity,
            releaseDate: movie.releaseDate,
            voteAverage: movie.voteAverage,
          });
          setSelectedMovie(movie);
        })
        .catch((error) => console.error(error));
    }
  }, [movieId]);

  const handleSearch = useCallback(async () => {
    if (!query) return;
    try {
      const response = await axios.get('https://api.themoviedb.org/3/search/movie', {
        params: {
          api_key: '013044f24bc916f73380c8a21b491d6b', // TMDB API key
          query,
          include_adult: false,
          language: 'en-US',
          page: currentPage,
        },
        headers: {
          Accept: 'application/json',
        },
      });

      if (response.data && response.data.results) {
        setSearchedMovieList(response.data.results);
        setTotalPages(response.data.total_pages);
        if (response.data.results.length === 0) {
          alert('No movies found for your search query.');
        }
      } else {
        setSearchedMovieList([]);
        alert('Unexpected response format');
      }
    } catch (error) {
      console.error("API Error:", error.response ? error.response.data : error.message);
      alert('An error occurred: ' + (error.response ? error.response.data.status_message : error.message));
    }
  }, [query, currentPage]);

  useEffect(() => {
    if (query) {
      handleSearch();
    }
  }, [query, currentPage, handleSearch]);

  const handleSelectMovie = (movie) => {
    setFormState({
      title: movie.original_title,
      overview: movie.overview,
      popularity: movie.popularity,
      releaseDate: movie.release_date,
      voteAverage: movie.vote_average,
    });
    setSelectedMovie(movie);
  };

  const handleSave = () => {
    const accessToken = localStorage.getItem('accessToken');

    if (!selectedMovie) {
      alert('Please search and select a movie.');
      return;
    }

    const data = {
      tmdbId: selectedMovie.id,
      title: formState.title,
      overview: formState.overview,
      popularity: formState.popularity,
      releaseDate: formState.releaseDate,
      voteAverage: formState.voteAverage,
      backdropPath: `https://image.tmdb.org/t/p/original/${selectedMovie.backdrop_path}`,
      posterPath: `https://image.tmdb.org/t/p/original/${selectedMovie.poster_path}`,
      isFeatured: 0,
    };

    axios({
      method: movieId ? 'patch' : 'post',
      url: movieId ? `/movies/${movieId}` : '/movies',
      data: data,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then(() => {
        alert('Movie saved successfully!');
        navigate('/main/movies');
      })
      .catch(() => {
        alert('Error saving movie. Please try again.');
      });
  };

  useEffect(() => {
    if (selectedMovie) {
      setFormState({
        title: selectedMovie.original_title,
        overview: selectedMovie.overview,
        popularity: selectedMovie.popularity,
        releaseDate: selectedMovie.release_date,
        voteAverage: selectedMovie.vote_average,
      });
    }
  }, [selectedMovie]);

  return (
    <>
      <h1>{movieId !== undefined ? 'Edit ' : 'Create '} Movie</h1>
      {movieId === undefined && (
        <>
          <div className='search-container'>
            Search Movie:{' '}
            <input
              type='text'
              onChange={(event) => setQuery(event.target.value)}
            />
            <button type='button' onClick={handleSearch}>
              Search
            </button>
            <div className='searched-movie'>
              {searchedMovieList.map((movie) => (
                <p key={movie.id} onClick={() => handleSelectMovie(movie)}>
                  {movie.original_title}
                </p>
              ))}
            </div>
          </div>
          <div className='pagination'>
            <button
              onClick={() => {
                if (currentPage > 1) setCurrentPage(currentPage - 1);
              }}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>{` Page ${currentPage} of ${totalPages}`}</span>
            <button
              onClick={() => {
                if (currentPage < totalPages) setCurrentPage(currentPage + 1);
              }}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
          <hr />
        </>
      )}
      <div className='container'>
        <form>
          {selectedMovie && (
            <img
              className='poster-image'
              src={`https://image.tmdb.org/t/p/original/${selectedMovie.poster_path}`}
              alt="Movie poster"
            />
          )}
          <div className='field'>
            Title:
            <input
              type='text'
              value={formState.title}
              onChange={(e) => setFormState({ ...formState, title: e.target.value })}
            />
          </div>
          <div className='field'>
            Overview:
            <textarea
              rows={10}
              value={formState.overview}
              onChange={(e) => setFormState({ ...formState, overview: e.target.value })}
            />
          </div>
          <div className='field'>
            Popularity:
            <input
              type='text'
              value={formState.popularity}
              onChange={(e) => setFormState({ ...formState, popularity: e.target.value })}
            />
          </div>
          <div className='field'>
            Release Date:
            <input
              type='text'
              value={formState.releaseDate}
              onChange={(e) => setFormState({ ...formState, releaseDate: e.target.value })}
            />
          </div>
          <div className='field'>
            Vote Average:
            <input
              type='text'
              value={formState.voteAverage}
              onChange={(e) => setFormState({ ...formState, voteAverage: e.target.value })}
            />
          </div>
          <nav>
            <ul className='tabs'>
              <li
                onClick={() => {
                  navigate(`/main/movies/form/${movieId}/cast-crew`);
                }}
              >
                Cast & Crews
              </li>
              <li
                onClick={() => {
                  navigate(`/main/movies/form/${movieId}/videos`);
                }}
              >
                Videos
              </li>
              <li
                onClick={() => {
                  navigate(`/main/movies/form/${movieId}/photos`);
                }}
              >
                Photos
              </li>
            </ul>
          </nav>
        </form>
      </div>
      <button type='button' onClick={handleSave}>
        {movieId ? 'Update' : 'Save'}
      </button>
      <button
        type='button'
        onClick={() => {
          if (window.confirm('Are you sure you want to exit?')) {
            navigate('/main/movies');
          }
        }}
      >
        Back
      </button>
      {movieId !== undefined && selectedMovie && (
        <div>
          <hr />
          <Outlet />
        </div>
        
      )}
    </>
  );
};

export default AdMovie;
