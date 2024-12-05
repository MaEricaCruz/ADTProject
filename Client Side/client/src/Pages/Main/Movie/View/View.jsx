import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './View.css';
import CastList from './Castlist';
import Photolist from './Photolist';
import VideoList from './VideoList';

const View = () => {
  const { movieId } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getView = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}`,
          {
            params: {
              api_key: '013044f24bc916f73380c8a21b491d6b',
              language: 'en-US',
            },
          }
        );
        console.log('Movie data:', response.data);
        setItem(response.data);
        window.scrollTo(0, 0);
      } catch (error) {
        console.error('Failed to fetch movie details:', error);
        setError('Failed to load movie details.');
      } finally {
        setLoading(false);
      }
    };

    getView();
  }, [movieId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      {item && (
        <>
          <div
            className="banner"
            style={{
              backgroundImage: `url(https://image.tmdb.org/t/p/original/${item.backdrop_path || item.poster_path})`,
            }}
          ></div>
          <div className="movie-content">
            <div className="poster">
              <img
                src={`https://image.tmdb.org/t/p/w300/${item.poster_path}`}
                alt={item.title || item.name}
              />
            </div>
            <div className="movie-content__info">
              <h1 className="title">{item.title || item.name}</h1>
              <p className="overviews">{item.overview}</p>
              <div className="cast">
                <div className="section__header"></div>
                <CastList movieId={movieId} />
              </div>
              <div className="videos">
              </div>
              <VideoList movieId={movieId} />
              <div className="photo">
              </div>
              <Photolist movieId={movieId} />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default View;
