import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./FeaturedMovies.css";

const FeaturedMovies = ({ movies }) => {
  console.log(movies);
  const [currentIndex, setCurrentIndex] = useState(0);
  const moviesPerPage = 3;

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + moviesPerPage >= movies.length ? 0 : prevIndex + moviesPerPage
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0
        ? movies.length - moviesPerPage
        : prevIndex - moviesPerPage
    );
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000); // Auto-play every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="featured-movies">
      <h2>Featured Movies</h2>
      <div className="featured-movies-carousel">
        <button className="carousel-button prev" onClick={prevSlide}>
          <FaChevronLeft />
        </button>
        <div className="carousel-container">
          {movies
            .slice(currentIndex, currentIndex + moviesPerPage)
            .map((movie) => (
              <Link
                to={`/movie/${movie.id}`}
                key={movie.id}
                className="featured-movie-card"
              >
                <div className="featured-movie-poster">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                  />
                </div>
                <div className="featured-movie-info">
                  <h3>{movie.title}</h3>
                  <p className="movie-rating">{movie.vote_average} / 10</p>
                  <p className="movie-overview">
                    {movie.overview.slice(0, 100)}...
                  </p>
                </div>
              </Link>
            ))}
        </div>
        <button className="carousel-button next" onClick={nextSlide}>
          <FaChevronRight />
        </button>
      </div>
      <div className="carousel-dots">
        {Array.from({ length: Math.ceil(movies.length / moviesPerPage) }).map(
          (_, index) => (
            <span
              key={index}
              className={`dot ${
                index === currentIndex / moviesPerPage ? "active" : ""
              }`}
              onClick={() => setCurrentIndex(index * moviesPerPage)}
            ></span>
          )
        )}
      </div>
    </div>
  );
};

export default FeaturedMovies;
