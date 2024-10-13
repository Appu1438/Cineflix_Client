import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import Navbar from '../../components/navbar/Navbar'; // Your navbar component
import './search.scss';
import { useNavigate } from 'react-router-dom';

const MovieSearch = () => {
    const [searchQuery, setSearchQuery] = useState(localStorage.getItem('searchQuery') || ''); // Load from localStorage
    const [movies, setMovies] = useState(); // Load from localStorage
    const navigate = useNavigate();

    const handleSearch = async () => {
        try {
            const response = await axiosInstance.get('movies/search', {
                params: { text: searchQuery },
            });
            setMovies(response.data);
            localStorage.setItem('movies', JSON.stringify(response.data)); // Save results to localStorage
        } catch (error) {
            console.error('Error fetching movies', error);
        }
    };

    const handleChange = (id) => {
        const newPath = `/info/${id}`;
        navigate(newPath);
    };

    useEffect(() => {
        localStorage.setItem('searchQuery', searchQuery); // Save query to localStorage
        if (searchQuery) {
            handleSearch(); // Perform search if query is not empty
        }
    }, [searchQuery]);

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
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button onClick={handleSearch}>Search</button>
                </div>
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
