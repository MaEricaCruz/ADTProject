import { useNavigate } from 'react-router-dom';
import './Lists.css';
import { useEffect, useState } from 'react';
import axios from 'axios';



const Lists = () => {
  const accessToken = localStorage.getItem('accessToken');
  const navigate = useNavigate();
  const [lists, setLists] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 13;

  const getMovies = () => {
    axios.get('/movies').then((response) => {
      setLists(response.data);
      setTotalPages(Math.ceil(response.data.length / itemsPerPage));    
    });
  };

  useEffect(() => {
    getMovies();
  }, []);

  
  const handleDelete = (id) => {
    const isConfirm = window.confirm('Are you sure that you want to delete this movie?');
    if (isConfirm) {
      axios
        .delete(`/movies/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then(() => {
          alert('Movie deleted successfully!');
          setLists((prevLists) => prevLists.filter((movie) => movie.id !== id));
          getMovies();
        })
        .catch((error) => {
          console.error('Delete error:', error);
          alert('Failed to delete movie. Please try again.');
        });
    }
  };
  

           
  const displayedMovies = lists.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );



  return (
    <div className='lists-container'>
      <h1>Creating Movie</h1>
      <div className='create-container'>
        <button
          type='button'
          onClick={() => {
            navigate('/main/movies/form');
          }}
        >
         Add Movie
        </button>
      </div>
      <div className='table-container'>
        <table className='movie-lists'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedMovies.map((movie) => (
              <tr key={movie.id}>
                <td>{movie.id}</td>
                <td>{movie.title}</td>
                <td>
                  <button
                    type='button'
                    onClick={() => {
                      navigate('/main/movies/form/' + movie.id);
                    }}
                  >
                    Edit
                  </button>
                  <button type='button' onClick={() => handleDelete(movie.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
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
      </div>
    </div>
  );
};

export default Lists;

