import React, { createContext, useContext, useState } from 'react';


const MovieContext = createContext();

export const useMovieContext = () => {
  return useContext(MovieContext);
};

export const MovieProvider = ({ children }) => {
  const [movieList, setMovieList] = useState([]);
  const [movie, setMovie] = useState(null);

  return (
    <MovieContext.Provider value={{ movieList, setMovieList, movie, setMovie }}>
      {children}
    </MovieContext.Provider>
  );
};
