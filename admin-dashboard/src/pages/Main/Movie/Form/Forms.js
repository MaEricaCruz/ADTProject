import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import './Form.css';


const Form = () => {
  const [query, setQuery] = useState('');
  const [searchedMovieList, setSearchedMovieList] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(undefined);
  const [formState, setFormState] = useState({
    title: '',
    overview: '',
    popularity: '',
    releaseDate: '',
    voteAverage: '',
    casts: [],
    videos: [], 
    photos: [],
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const { movieId } = useParams();
  const [casts, setCasts] = useState([]);
  const [videos, setVideos] = useState([]);
  const [photos, setPhotos] = useState([]);

  
  const handleSearch = useCallback(async () => {
    if (!query) return;
    try {
      const response = await axios.get('https://api.themoviedb.org/3/search/movie', {
        params: {
          api_key: '013044f24bc916f73380c8a21b491d6b',
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
      backdropPath: movie.backdropPath,
      posterPath: movie.backdropPath,
      casts: [],
      videos: [],
      photos: [],
    });
    setSelectedMovie(movie);
  };
  
  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        if (movieId) {
          // Fetch movie details
          const movieResponse = await axios.get(`/movies/${movieId}`);
          const movie = movieResponse.data;
  
          setFormState({
            title: movie.title,
            overview: movie.overview,
            popularity: movie.popularity,
            releaseDate: movie.releaseDate,
            voteAverage: movie.voteAverage,
            backdropPath: movie.backdropPath,
            posterPath: movie.backdropPath,
            casts: [],
            videos: [],
            photos: [],
          });
          setSelectedMovie(movie);

           // Fetch cast                        
           const castResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
            headers: {
              Accept: 'application/json',
              Authorization: 'Bearer 013044f24bc916f73380c8a21b491d6b',

            },
          });
          setCasts(castResponse.data.cast);
          setFormState((prevData) => ({
            ...prevData,
            casts: castResponse.data.cast,
          }));
  
          // Fetch videos
          const videoResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US`, {
            headers: {
              Accept: 'application/json',
              Authorization: 'Bearer 013044f24bc916f73380c8a21b491d6b',
            },
          });
          setVideos(videoResponse.data.results);
          setFormState((prevData) => ({
            ...prevData,
            videos: videoResponse.data.results,
          }));
  
          // Fetch photos
          const photoResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/images`, {
            headers: {
              Accept: 'application/json',
              Authorization: 'Bearer 013044f24bc916f73380c8a21b491d6b',
            },
          });
          setPhotos(photoResponse.data.backdrops);
          setFormState((prevData) => ({
            ...prevData,
            photo: photoResponse.data.backdrops,
          }));
        }
      } catch (error) {
        console.error('Error fetching movie data:', error);
        alert('An error occurred while fetching the movie data. Please try again later.');
      }
    };
  
    fetchMovieData();
  }, [movieId]);
  

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
      cast: formState.cast,
      videos: formState.videos,
      photos: formState.photos,
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

  const handleUpdate = handleSave;

  useEffect(() => {
    if (movieId) {
     
      axios.get(`/movies/${movieId}`)
      .then((response) => {
        const movieData = response.data;
        setSelectedMovie({
          id: movieData.tmdbId,
          original_title: movieData.title,
          overview: movieData.overview,
          popularity: movieData.popularity,
          poster_path: movieData.posterPath.replace("https://image.tmdb.org/t/p/original/", ""),
          release_date: movieData.releaseDate,
          vote_average: movieData.voteAverage,
        });
        setFormState({
          title: movieData.title,
          overview: movieData.overview,
          popularity: movieData.popularity,
          releaseDate: movieData.releaseDate,
          voteAverage: movieData.voteAverage,
          videos: movieData.videos || [], 
          casts: movieData.casts || [], 
          photos: movieData.photos || [],
        });
      })
  }
  }, [movieId]);



  return (
    <div className="form-container">
      <h3>{movieId !== undefined ? 'Edit ' : 'Create '} Movie</h3>
      {movieId === undefined && (
        <>
          <div className="movie-container">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search for a movie..."
                onChange={(event) => setQuery(event.target.value)}
              />
              <button className="search-btn" onClick={handleSearch}>
                Search
              </button>
            </div>

            <div className="searched-movie">
              {searchedMovieList.map((movie) => (
                <p key={movie.id} onClick={() => handleSelectMovie(movie)}>
                  {movie.original_title}
                </p>
              ))}
            </div>

            <div className="paginations">
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
          </div>
        </>
      )}

      <div className="container">
        {selectedMovie && (
          <img
            className="poster-image"
            src={`https://image.tmdb.org/t/p/original/${selectedMovie.poster_path}`}
            alt="Movie poster"
          />
        )}

        <div className="form-fields">
          <div className="field title-field">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={formState.title}
              onChange={(e) => setFormState({ ...formState, title: e.target.value })}
            />
          </div>
          <div className="field overview-field">
            <label htmlFor="overview">Overview</label>
            <textarea
              id="overview"
              rows={10}
              value={formState.overview}
              onChange={(e) => setFormState({ ...formState, overview: e.target.value })}
            />
          </div>
          <div className="field popularity-field">
            <label htmlFor="popularity">Popularity</label>
            <input
              type="text"
              value={formState.popularity}
              onChange={(e) => setFormState({ ...formState, popularity: e.target.value })}
            />
          </div>
          <div className="field releasedate-field">
            <label htmlFor="releasedate">Release Date</label>
            <input
              type="text"
              value={formState.releaseDate}
              onChange={(e) => setFormState({ ...formState, releaseDate: e.target.value })}
            />
          </div>
          <div className="field voteaverage-field">
            <label htmlFor="voteaverage">Vote Average</label>
            <input
              type="text"
              value={formState.voteAverage}
              onChange={(e) => setFormState({ ...formState, voteAverage: e.target.value })}
            />
          </div>
          {selectedMovie && (
<>
<h2>Cast</h2>
    <div className="casts">
        {casts.length > 0 ? (
            casts.map(member => (
                <div key={member.id} className="cast-item">
                    <h3>{member.name}</h3>
                    <p>Character: {member.character}</p>
                    {member.profile_path && (
                        <img
                            src={`https://image.tmdb.org/t/p/w500/${member.profile_path}`}
                            alt={member.name}
                        />
                    )}
                </div>
            ))
        ) : (
            <p>No cast information available.</p>
        )}
    </div>
    <h2>Videos</h2>
    <div className="videos">
        {videos.length > 0 ? (
            videos.map(video => (
                <div key={videos.id} className="video-item">
                    <h3>{videos.name}</h3>
                    <iframe
                        src={`https://www.youtube.com/embed/${video.key}`}
                        title={video.name}
                        frameBorder="0"
                        allowFullScreen
                    ></iframe>
                </div>
            ))
        ) : (
            <p>No videos available.</p>
        )}
    </div>

    <h2>Photos</h2>
   <div className="photos">
    {photos.length > 0 ? (
        photos.map((photo, index) => (
            <div key={index} className="photo-item">
                {photo.file_path && (
                    <img
                        src={`https://image.tmdb.org/t/p/w500/${photo.file_path}`}
                        alt={`Photo ${index + 1}`}
                        className="photo-image"
                    />
                )}
            </div>
        ))
    ) : (
        <p>No photos available.</p>
    )}
</div>

</>
      )}

          <div className="button-container">
            <button className="save-btn" type="button" onClick={handleSave}>
              {movieId ? 'Update' : 'Save'}
            </button>
            <button
              className="back-btn"
              type="button"
              onClick={() => {
                if (window.confirm('Are you sure you want to exit?')) {
                  navigate('/main/movies');
                }
              }}
            >
              Back
            </button>
          </div>
        </div>
      </div>

      {movieId !== undefined && selectedMovie && (
        <div>
          <hr />
          <Outlet />
        </div>
      )}
    </div>
  );
};

export default Form;