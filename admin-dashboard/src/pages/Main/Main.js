import { useEffect, useState } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import './Main.css';
import Logo from '../../assets/Logo.png';
import SearchIcon from '../../assets/Search-icon.png';

function Main() {
  const accessToken = localStorage.getItem('accessToken');
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
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
          <img src={Logo} alt="Logo" className="logo" />
          <ul className="navbar-menu">
            <li>
            <a href="/main/movies/home">Home</a>
            </li>

            <li>
            <a href="/main/movies">Movies</a>
            </li>
          </ul>
        </div>
        
       <div className="navbar-right">
          {/*<div className="search-box">
            <img src={SearchIcon} alt="Search" className="search-icon" />
            <input type="text" placeholder="Enter keywords..." />
          </div>*/}

          <a onClick={handleLogout}>Logout</a>
        </div>
      </div>

      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}

export default Main;
