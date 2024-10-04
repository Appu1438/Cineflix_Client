import React, { useEffect, useState } from 'react';
import './recommendMovies.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

const RecommendedMovies = ({ movieId }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [relatedMovies, setRelatedMovies] = useState(null);

    const handleChange = (id) => {
        // Determine the navigation path based on the current location
        const newPath = location.pathname.includes('/info') ? `/info/${id}` : `/watch/${id}`;
        navigate(newPath);
    };

    useEffect(() => {
        const fetchRelatedMovies = async () => {
            try {
                console.log('related', movieId)
                const movieResponse = await axiosInstance.get(`movies/find/${movieId}`);
                const movieData = movieResponse.data;
                const response = await axiosInstance.get(`movies/related/${movieData.genre}`, {
                    params: { movieId: movieData._id } // Send movieId as a query parameter
                });
                console.log(response.data)
                setRelatedMovies(response.data);

            } catch (error) {
                console.error('Failed to fetch related movies:', error);
            }
        };

        fetchRelatedMovies();
    }, [movieId]);


    return (
        <div className="recommendedMoviesContainer">
            {relatedMovies?.length > 0 ? (
                relatedMovies.map((movie) => (
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
    );
    
};

export default RecommendedMovies;
