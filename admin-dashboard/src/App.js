import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { MovieProvider } from './context/MovieContext';
import { Route, Routes, createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';

import Login from './pages/Public/Login/Login';
import Register from './pages/Public/Register/Register';
//import Dashboard from './pages/Main/Dashboard/Dashboard';
import Main from './pages/Main/Main';
import Movie from './pages/Main/Movie/Movie';
import Lists from './pages/Main/Movie/Lists/Lists';
import Form from './pages/Main/Movie/Form/Form';
import Home from './pages/Main/Movie/Home/Home';
import View from './pages/Main/Movie/View/View';
import Castlist from './pages/Main/Movie/View/Castlist';
import VideoList from './pages/Main/Movie/View/VideoList';
import Photoslist from './pages/Main/Movie/View/Photolist';


const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/main',
    element: <Main />,
    children: [
      {
        path: '/main/movies',
        element: <Movie />,
        children: [
          {
            path: '/main/movies',
            element: <Lists />,
          },
            {
              path: 'home',
              element: <Home />,
            },
            {
                path: '/main/movies/view/:movieId',
                element: <View />,                     
            },
            {
              path: '/main/movies/castlist/',
              element: <Castlist />,
            },
            {
              path: '/main/movies/videolist/',
              element: <VideoList />,
            },
            {
              path: '/main/movies/photolist/',
              element: <Photoslist />,
            },
          {
            path: '/main/movies/form/:movieId?',
            element: <Form />,
          },      

   
        ],
      },
    ],
  },
]);


function App() {
  return (
    <MovieProvider>
      <RouterProvider router={router} />
    </MovieProvider>
  );
}

export default App;

