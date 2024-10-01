// src/components/recommendedMovies/RecommendedMovies.jsx

import React from 'react';
import './recommendMovies.scss';
import { Link } from 'react-router-dom';

const RecommendedMovies = ({ movies }) => {
    return (
        <div className="recommendedMoviesContainer">
            {movies.map((movie) => (
                <div key={movie._id} className="recommendedMovieCard">
                    <Link to="/watch" state={{ id: movie._id }} className='link'>

                        <div className="movieImageContainer">
                            <img src={movie.imgsm} alt={movie.title} className="movieImage" />
                        </div>
                        <h3 className="movieTitle">{movie.title}</h3>
                    </Link>
                </div>
            ))
            }
        </div >
    );
};

export default RecommendedMovies;
