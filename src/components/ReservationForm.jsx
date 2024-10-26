import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Form.css"; // Make sure this path is correct
import { useParams, useNavigate } from "react-router-dom";

const ReservationForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const API_KEY = "1d1d8844ae1e746c459e7be85c15c840";

  useEffect(() => {
    const fetchMovie = async () => {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`
      );
      setMovie(response.data);
    };
    fetchMovie();
  }, [id]);

  const movieTitle = movie?.title;
  const ticketPrice = 10;
  console.log("ReservationForm rendered", { movieTitle, ticketPrice });
  const [tickets, setTickets] = useState(1);
  const [seats, setSeats] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (seats.length !== tickets) {
      alert("Please select the same number of seats as tickets.");
      return;
    }
    // Handle reservation submission logic here
    console.log("Reservation submitted:", { tickets, seats, movieTitle });
    // You might want to send this data to a backend API
  };

  const handleSeatChange = (e) => {
    const selectedSeats = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setSeats(selectedSeats);
  };

  const handleHomeClick = () => {
    navigate("/");
  };

  return (
    <div className="form-overlay">
      <div className="form-container">
        <h2>Reserve Tickets for {movieTitle}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Number of Tickets (max 5):
            <input
              type="number"
              min="1"
              max="5"
              value={tickets}
              onChange={(e) => setTickets(Number(e.target.value))}
              required
            />
          </label>
          <label>
            Select Seats:
            <select multiple value={seats} onChange={handleSeatChange} required>
              {[...Array(20)].map((_, i) => (
                <option key={i} value={`Seat ${i + 1}`}>
                  Seat {i + 1}
                </option>
              ))}
            </select>
          </label>
          <p>Total Price: ${tickets * ticketPrice} (Pay at theater)</p>
          <button type="submit">Reserve</button>
          <button type="button" onClick={handleHomeClick}>
            Home
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReservationForm;
