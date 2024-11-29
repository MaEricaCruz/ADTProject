import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import './Main.css';

function Main() {
  const accessToken = localStorage.getItem('accessToken');
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
  };

  useEffect(() => {
    if (
      accessToken === undefined ||
      accessToken === '' ||
      accessToken === null
    ) {
      handleLogout();
    }
  }, []);
  return (
    <div className='Main'>
      <div className='container'>
        <div className='navigation'>
          <ul>
            <li>
              <a onClick={() => navigate('/')}>Movies</a>
            </li>

            
            <li className="dropdown">
              <Link to="#" className="dropdown-toggle" onClick={toggleDropdown}>Genre</Link>
              {dropdownOpen && (
                <ul className="dropdown-menu">
                  <li><Link to="/main/genre/action">Action</Link></li>
                  <li><Link to="/main/genre/animation">Animation</Link></li>
                  <li><Link to="/main/genre/crime">Crime</Link></li>
                  <li><Link to="/main/genre/family">Family</Link></li>
                  <li><Link to="/main/genre/horror">Horror</Link></li>
                  <li><Link to="/main/genre/mystery">Mystery</Link></li>
                  <li><Link to="/main/genre/romance">Romance</Link></li>
                  <li><Link to="/main/genre/soap">Soap</Link></li>
                  <li><Link to="/main/genre/tv-movie">TV Movie</Link></li>
                  <li><Link to="/main/genre/adventure">Adventure</Link></li>
                  <li><Link to="/main/genre/biography">Biography</Link></li>
                  <li><Link to="/main/genre/comedy">Comedy</Link></li>
                  <li><Link to="/main/genre/drama">Drama</Link></li>
                  <li><Link to="/main/genre/fantasy">Fantasy</Link></li>
                  <li><Link to="/main/genre/sci-fi">Sci-Fi & Fantasy</Link></li>
                  <li><Link to="/main/genre/talk">Talk</Link></li>
                  <li><Link to="/main/genre/war">Reality</Link></li>
                 <li><Link to="/main/genre/war">War</Link></li>
                </ul>
              )}
            </li>
            
            {accessToken ? (
              <li className='logout'>
                <a onClick={handleLogout}>Logout</a>
              </li>
            ) : (
              <li className='login'>
                <a onClick={() => alert('Go to Login page')}>Login</a>
              </li>
            )}
          </ul>
        </div>
        <div className='outlet'>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Main;
