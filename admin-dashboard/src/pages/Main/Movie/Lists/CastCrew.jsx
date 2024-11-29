import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function CastCrewPage() {
  const { movieId } = useParams(); 
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(true);

 
  useEffect(() => {
    const fetchCastAndCrew = async () => {
      try {
        const response = await fetch(`/api/movies/${movieId}/cast-crew`); 
        const data = await response.json();
        setCast(data.cast); 
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch cast and crew:", error);
        setLoading(false);
      }
    };

    fetchCastAndCrew();
  }, [movieId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="cast-crew-page">
      <h1>Cast & Crew</h1>
      <ul>
        {cast.length > 0 ? (
          cast.map((member, index) => (
            <li key={index}>
              <p>
                <strong>{member.name}</strong> - {member.role}
              </p>
            </li>
          ))
        ) : (
          <p>No cast and crew data available.</p>
        )}
      </ul>
    </div>
  );
}

export default CastCrewPage;
