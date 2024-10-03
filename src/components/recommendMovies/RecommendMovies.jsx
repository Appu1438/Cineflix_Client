import React from 'react';
import './recommendMovies.scss';
import { useLocation, useNavigate } from 'react-router-dom';

const RecommendedMovies = ({ movies }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleChange = (id) => {
        // Determine the navigation path based on the current location
        const newPath = location.pathname.includes('/info') ? `/info/${id}` : `/watch/${id}`;
        navigate(newPath);
    };

    return (
        <div className="recommendedMoviesContainer">
            {movies.map((movie) => (
                <div key={movie._id} className="recommendedMovieCard" onClick={() => handleChange(movie._id)}>
                    <div className="movieImageContainer">
                        <img src={movie.imgsm} alt={movie.title} className="movieImage" />
                        <div className="movieInfoOverlay">
                            <h3 className="movieTitle">{movie.title}</h3>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default RecommendedMovies;
