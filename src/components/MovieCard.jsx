import React from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import "./MovieCard.css";

const MovieCard = ({ movie, isFavorite, toggleFavorite }) => {
  return (
    <div className="movie-card">
      <Link to={`/movie/${movie.id}`}>
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
        />
        <h3>{movie.title}</h3>
        <p>Release Date: {movie.release_date}</p>
      </Link>
      <button className="favorite-btn" onClick={() => toggleFavorite(movie)}>
        {isFavorite ? <FaHeart color="red" /> : <FaRegHeart />}
      </button>
    </div>
  );
};

export default MovieCard;
