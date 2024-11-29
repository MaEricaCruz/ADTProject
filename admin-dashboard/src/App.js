import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { MovieProvider } from './context/MovieContext';
import { Route, createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';

import Login from './pages/Public/Login/Login';
import Register from './pages/Public/Register/Register';
//import Dashboard from './pages/Main/Dashboard/Dashboard';
import Main from './pages/Main/Main';
import Movie from './pages/Main/Movie/Movie';
import Lists from './pages/Main/Movie/Lists/Lists';
import Form from './pages/Main/Movie/Form/Form';
import Home from './pages/Main/Movie/Home/Home';
import CastCrew from './pages/Main/Movie/Lists/CastCrew';
import AdMovie from './pages/Main/Movie/Form/AdMovie';


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
            path: '/main/movies/form/:movieId?',
            element: <Form />,
          },  
          {
            path: '/main/movies/form/AdMovie',
            element: <AdMovie />,
          },  
          <Route path="/main/movies/form/:movieId/cast-crew" element={<CastCrew />} />
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
