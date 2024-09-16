import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import MovieList from './components/MovieList';
import MovieDetails from './components/MovieDetails';
import LoadingSpinner from './components/LoadingSpinner';

const API_KEY = 'a265b18f41d898759c0a1e109b1e3bb9'; // Replace with your TMDb API key
const API_URL = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`;

const App = () => {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const url = searchQuery
          ? `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${searchQuery}`
          : API_URL;
        const response = await axios.get(url);
        setMovies(response.data.results);
      } catch (error) {
        console.error('Error fetching the movies:', error);
      }
      setLoading(false);
    };
    fetchMovies();
  }, [searchQuery]);

  const handleSearch = (event) => {
    event.preventDefault();
    setSearchQuery(event.target.elements.query.value);
  };

  return (
    <Router>
      <div className="App">
        <header className="header">
          <h1>MovieHub</h1>
          <form className="search-bar" onSubmit={handleSearch}>
            <input 
              type="text" 
              name="query" 
              placeholder="Search for movies..." 
            />
            <button type="submit">Search</button>
          </form>
        </header>
        {loading && <LoadingSpinner />}
        <Routes>
          <Route path="/" element={<MovieList movies={movies} />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
