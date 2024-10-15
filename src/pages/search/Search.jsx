import React, { useContext, useEffect, useState, useCallback } from 'react';
import axiosInstance from '../../api/axiosInstance';
import Navbar from '../../components/navbar/Navbar';
import './search.scss';
import { useNavigate } from 'react-router-dom';
import { HistoryContext } from '../../context/historyContext/HistoryContext';
import { AuthContext } from '../../context/authContext/AuthContext';
import { get_User_History } from '../../context/historyContext/apiCalls';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { toast } from 'react-toastify';
import _ from 'lodash'; // Import lodash for debounce

const MovieSearch = () => {
    const { user } = useContext(AuthContext);
    const { history, dispatch: dispatchHis } = useContext(HistoryContext);
    const [searchQuery, setSearchQuery] = useState(localStorage.getItem('search') || '');
    const [movies, setMovies] = useState([]);
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        get_User_History(user._id, dispatchHis);
    }, [user, dispatchHis]);

    // Debounced search function
    const debouncedSearch = useCallback(
        _.debounce(async (query) => {
            if (query.length >= 3) { // Perform the search only if the query length is 3 or more characters
                try {
                    const response = await axiosInstance.get('movies/search', {
                        params: { text: query },
                    });
                    setMovies(response.data);
                    setShowSuggestions(false);
                    localStorage.setItem('search', query);

                } catch (error) {
                    console.error('Error fetching movies', error);
                }
            }
        }, 1000), [] // The delay is 300 milliseconds
    );

    useEffect(() => {
        if (searchQuery) {
            debouncedSearch(searchQuery);
        }
    }, [searchQuery, debouncedSearch]);

    const handleInputChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.length > 0) {
            const suggestions = history.search.filter((item) =>
                item.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredSuggestions(suggestions);
        } else {
            // Show all search history if the input is empty
            setFilteredSuggestions(history?.search?.reverse());
        }
        setShowSuggestions(true);
    };

    const handleFocus = () => {
        // Show full search history when input is focused
        setFilteredSuggestions(history?.search?.reverse());
        setShowSuggestions(true);
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchQuery(suggestion);
        setShowSuggestions(false);
        debouncedSearch(suggestion)
    };

    const handleChange = (id) => {
        navigate(`/info/${id}`);
    };

    return (
        <div className="search-page">
            <Navbar />
            <div className="search-container">
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search movie"
                        value={searchQuery}
                        onChange={handleInputChange}
                        onFocus={handleFocus} // Show suggestions on focus
                    />
                    {/* <button onClick={() => handleSearch(searchQuery)}>Search</button> */}
                </div>
                {showSuggestions && filteredSuggestions?.length > 0 && (
                    <ul className="suggestions-list">
                        {filteredSuggestions?.map((suggestion, index) => (
                            <li
                                key={index}
                                onClick={() => handleSuggestionClick(suggestion)}
                            >
                                <AccessTimeIcon className="time-icon" /> {/* Time icon */}
                                {suggestion}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className="recommendedMoviesContainer">
                {movies.length > 0 ? (
                    movies.map((movie) => (
                        <div
                            key={movie._id}
                            className="recommendedMovieCard"
                            onClick={() => handleChange(movie._id)}
                        >
                            <div className="movieImageContainer">
                                <img
                                    src={movie.imgsm}
                                    alt={movie.title}
                                    className="movieImage"
                                />
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
