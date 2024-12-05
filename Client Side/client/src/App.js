import logo from './logo.svg';
import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MovieContextProvider from './context/MovieContext';

import Login from './Pages/Public/Login/Login';
import Register from './Pages/Public/Register/Register';
import Dashboard from './Pages/Main/Dashboard/Dashboard';
import Home from './Pages/Main/Movie/Home/Home';
import Main from './Pages/Main/Main';
import View from './Pages/Main/Movie/View/View';
import Castlist from './Pages/Main/Movie/View/Castlist';
import VideoList from './Pages/Main/Movie/View/VideoList';
import Photoslist from './Pages/Main/Movie/View/Photolist';


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
          path: '/main/dashboard',
         element: <Dashboard />,
        },
        {
          path: '/main/movies/home',
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
    ],
  },
]);

function App() {
  return (
    <div className='App'>
      <MovieContextProvider>
        <RouterProvider router={router} />
      </MovieContextProvider>
    </div>
  );
}

export default App;
