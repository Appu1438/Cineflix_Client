import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import './movieInfo.scss';
import { AuthContext } from '../../context/authContext/AuthContext';
import { FavContext } from '../../context/favContext/FavContext';
import { LikesContext } from '../../context/likesContext/LikesContext';
import axiosInstance from '../../api/axiosInstance';
import Spinner from '../../components/spinner/Spinner';
import { formatCount } from '../../utils/formatCount';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { ReviewsComponent } from '../../components/review/Review';
import StarComponent from '../../components/starComponent/StarComponent';
import RecommendedMovies from '../../components/recommendMovies/RecommendMovies';
import VideoPlayer from '../../components/video/Video';
import Icons from '../../components/Icons/Icons';

const MovieInfo = () => {
    const location = useLocation();
    // const [id, setId] = useState(location.state.id)
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const { fav, dispatch: dispatchFav } = useContext(FavContext);
    const { likes, dispatch: dispatchLikes } = useContext(LikesContext);

    const [movie, setMovie] = useState(null);
    const [reviews, setReviews] = useState([]);


    const MySwal = withReactContent(Swal);

    // Scroll to top
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // This enables smooth scrolling
        });
    }, [id, reviews]);

    // Fetch movie details
    useEffect(() => {
        const controller = new AbortController();
        const { signal } = controller;

        const getMovie = async () => {
            try {
                const response = await axiosInstance.get(`movies/find/${id}`, { signal });
                if (id === response.data._id) {
                    setMovie(response.data);
                }
            } catch (error) {
                if (error.name !== 'CanceledError') {
                    console.error(error);
                }
            }
        };

        getMovie();
        return () => {
            controller.abort();
        };
    }, [id, fav, likes, reviews]);



    return (
        <div className="movieInfoContainer">
            {movie ? (
                <>
                    <div className="movieHeader">
                        <div className="trailer">
                            <VideoPlayer
                                key={movie._id}
                                videoUrl={movie.trailer}
                                subtitleUrl={movie.trailerSubtitle}
                            />
                            <Icons movie={movie} />

                        </div>
                        <div className="details">
                            <h1>{movie.title}</h1>
                            <p>{movie.desc}</p>
                            <p>{movie.genre.join(' ,  ')}</p>



                            <div className="averageRating">
                                <h4>Rating: {movie.average.toFixed(1)}/5</h4>
                                <StarComponent rating={movie.average} />
                            </div>

                        </div>
                    </div>

                    {/* Reviews Section */}
                    <div className="reviewsSection">
                        <h2>Reviews {movie.reviewcount !== undefined ? `(${formatCount(movie.reviewcount)})` : ""}</h2>
                        <ReviewsComponent id={id} user={user} reviews={reviews} setReviews={setReviews} />
                    </div>

                    {/* Recomendation section*/}
                    {movie && (
                        <div className="recommendedMovies">
                            <h2>Recommended Movies</h2>
                            <RecommendedMovies movieId={id} />
                        </div>
                    )}

                </>
            ) : (
                <Spinner />
            )}
        </div>
    );

};

export default MovieInfo;
