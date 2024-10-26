import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./MovieDetail.css";
import { useNavigate } from "react-router-dom";
const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const API_KEY = "1d1d8844ae1e746c459e7be85c15c840";
  const navigate = useNavigate();
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`
        );
        setMovie(response.data);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };
    fetchMovie();
  }, [id]);

  const handleReserveClick = () => {
    navigate(`/reservation/${id}`);
  };

  if (!movie) return <p>Loading...</p>;

  return (
    <div className="movie-detail">
      <h2>{movie.title}</h2>
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
      />
      <p>{movie.overview}</p>
      <p>
        <strong>Release Date:</strong> {movie.release_date}
      </p>
      <p>
        <strong>Rating:</strong> {movie.vote_average}
      </p>

      <button onClick={handleReserveClick}>Reserve Tickets</button>
    </div>
  );
};

export default MovieDetail;
