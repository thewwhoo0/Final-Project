import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Change Switch to Routes
import axios from "axios";
import MovieCard from "./components/MovieCard";
import SearchBar from "./components/SearchBar"; // Changed from SearchBar,js to SearchBar.js
import Footer from "./components/Footer";
import Header from "./components/Header"; // Make sure to import Header
import FeaturedMovies from "./components/FeaturedMovies";
import ReservationForm from "./components/ReservationForm";
import "./App.css";
import MovieDetail from "./components/MovieDetail";

const HomePage = ({
  isSearching,
  featuredMovies,
  searchResults,
  movies,
  favorites,
  toggleFavorite,
  handlePageChange,
  currentPage,
  totalPages,
}) => (
  <>
    {!isSearching && <FeaturedMovies movies={featuredMovies} />}
    <div className="movie-list">
      {(isSearching ? searchResults : movies).map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          isFavorite={favorites.some((fav) => fav.id === movie.id)}
          toggleFavorite={toggleFavorite}
        />
      ))}
    </div>
    {!isSearching && (
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    )}
  </>
);

const FavoritesPage = ({ favorites, toggleFavorite }) => (
  <div className="favorites-list">
    <h2>Favorites</h2>
    <div className="movie-list">
      {favorites.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          isFavorite={true}
          toggleFavorite={toggleFavorite}
        />
      ))}
    </div>
  </div>
);

function App() {
  const [movies, setMovies] = useState([]);
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [theme, setTheme] = useState("light");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Fetch movies from the MovieDB API
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/popular?api_key=1d1d8844ae1e746c459e7be85c15c840&page=${currentPage}`
        );
        setMovies(response.data.results);
        setTotalPages(response.data.total_pages);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, [currentPage]);

  // Load theme from local storage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // Apply theme to body and store in local storage
  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Toggle theme function
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const toggleFavorite = (movie) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.some((fav) => fav.id === movie.id)) {
        return prevFavorites.filter((fav) => fav.id !== movie.id);
      } else {
        return [...prevFavorites, movie];
      }
    });
  };

  // Fetch featured movies
  useEffect(() => {
    const fetchFeaturedMovies = async () => {
      try {
        const [topRated, popular, upcoming] = await Promise.all([
          axios.get(
            `https://api.themoviedb.org/3/movie/top_rated?api_key=1d1d8844ae1e746c459e7be85c15c840&page=1`
          ),
          axios.get(
            `https://api.themoviedb.org/3/movie/popular?api_key=1d1d8844ae1e746c459e7be85c15c840&page=1`
          ),
          axios.get(
            `https://api.themoviedb.org/3/movie/upcoming?api_key=1d1d8844ae1e746c459e7be85c15c840&page=1`
          ),
        ]);

        const combinedMovies = [
          ...topRated.data.results,
          ...popular.data.results,
          ...upcoming.data.results.slice(0, 2),
        ];

        setFeaturedMovies(combinedMovies);
      } catch (error) {
        console.error("Error fetching featured movies:", error);
      }
    };

    fetchFeaturedMovies();
  }, []);

  const handleSearch = async (query) => {
    setIsSearching(true);
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=1d1d8844ae1e746c459e7be85c15c840&query=${query}&page=1`
      );
      setSearchResults(response.data.results);
    } catch (error) {
      console.error("Error searching movies:", error);
    }
  };

  const clearSearch = () => {
    setIsSearching(false);
    setSearchResults([]);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    document.body.classList.toggle("dark-mode", isDarkMode);
  }, [isDarkMode]);

  return (
    <Router>
      <div className={`App ${isDarkMode ? "dark-mode" : ""}`}>
        <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        <SearchBar onSearch={handleSearch} />
        {isSearching && (
          <button onClick={clearSearch} className="clear-search">
            Clear Search
          </button>
        )}
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                isSearching={isSearching}
                featuredMovies={featuredMovies}
                searchResults={searchResults}
                movies={movies}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                handlePageChange={handlePageChange}
                currentPage={currentPage}
                totalPages={totalPages}
              />
            }
          />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/reservation/:id" element={<ReservationForm />} />
          <Route
            path="/favorites"
            element={
              <FavoritesPage
                favorites={favorites}
                toggleFavorite={toggleFavorite}
              />
            }
          />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
