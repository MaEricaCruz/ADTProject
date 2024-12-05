import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import './Main.css';
import logos from '../../assets/logos.png'

function Main() {
  const accessToken = localStorage.getItem('accessToken');
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false); 

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/');
  };

  const handleDashboardToggle = () => {
    setIsMenuOpen(!isMenuOpen);
    console.log("Dashboard menu toggled!");
  };

  useEffect(() => {
    if (!accessToken) {
      handleLogout();
    }
  }, [accessToken]);

  return (
    <div className="Main">
      <div className="navbar">
        <div className="navbar-left">
          <img src={logos} alt="logos" className="logos" />
        </div>

        <button className="hamburger-button" onClick={handleDashboardToggle}>
        <div className={`line ${isMenuOpen ? 'open' : ''}`}></div>
          <div className={`line ${isMenuOpen ? 'open' : ''}`}></div>
          <div className={`line ${isMenuOpen ? 'open' : ''}`}></div>
        </button>
      </div>

      {isMenuOpen && (
        <div className="dashboard-popup">
          <div className="dashboard-content">
            <ul className="dashboard-menu">
            <div className="navbar-left">
          <img src={logos} alt="logos" className="logo" />
        </div>
              <li>
                <a href="/main/movies/home">Home</a>
              </li>
              <li>
                <a href="/main/movies/home">Genre</a>
              </li>
              <li>
                <a href="/main/movies">Movies</a>
              </li>
              <li>
                <a href="/main/movies">Watchlist</a>
              </li>
            </ul>
            <div className="navbar-right">
              <a onClick={handleLogout}>Logout</a>
            </div>
          </div>
        </div>
      )}

      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}

export default Main;
