import React from 'react';
import './recommendMovies.scss';

const RecommendedMovies = ({ movies, state }) => {

    const handleChange = (id) => {
        state(id);
    }

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
