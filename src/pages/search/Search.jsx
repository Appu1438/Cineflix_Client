import React, { useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import Navbar from '../../components/navbar/Navbar'; // Your navbar component
import './search.scss'
import { useNavigate } from 'react-router-dom';
const MovieSearch = () => {
    const [searchQuery, setSearchQuery] = useState(''); // Single search bar input
    const [movies, setMovies] = useState([]);
    const navigate = useNavigate()
    const handleSearch = async () => {
        try {
            const response = await axiosInstance.get('movies/search', {
                params: { title: searchQuery }, // Searching by title for simplicity
            });
            setMovies(response.data);
        } catch (error) {
            console.error('Error fetching movies', error);
        }
    };

    const handleChange = (id) => {
        const newPath = `/info/${id}`;
        navigate(newPath);
    };

    return (
        <div className="search-page">
            <Navbar /> {/* Include the Navbar component */}
            <div className="search-container">
                <div className="search-bar">
                    <input
                        autoFocus
                        type="text"
                        placeholder="Search movie"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value)
                            handleSearch()
                        }}
                    />
                    <button onClick={handleSearch}>Search</button>
                </div>

                {/* Search Results
                <div className="search-results">
                    {movies.length > 0 ? (
                        <ul>
                            {movies.map((movie) => (
                                <li key={movie._id} className="search-result-item">
                                    <h3>{movie.title}</h3>
                                    <p>{movie.genre.join(', ')}</p>
                                    <span>{movie.duration}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No movies found. Try a different search.</p>
                    )}
                </div> */}
            </div>
            <div className="recommendedMoviesContainer">
                {movies?.length > 0 ? (
                    movies.map((movie) => (
                        <div key={movie._id} className="recommendedMovieCard" onClick={() => handleChange(movie._id)}>
                            <div className="movieImageContainer">
                                <img src={movie.imgsm} alt={movie.title} className="movieImage" />
                                <div className="movieInfoOverlay">
                                    <h3 className="movieTitle">{movie.title}</h3>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No movies found</p>
                )}
            </div>
        </div>
    );
};

export default MovieSearch;
