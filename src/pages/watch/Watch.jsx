import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import './watch.scss';
import {
    PlayArrow,
    Add,
    FavoriteBorder,
    ThumbUpAltOutlined,
    ThumbDownOutlined,
    Info
} from '@mui/icons-material';
import { AuthContext } from '../../context/authContext/AuthContext';
import { FavContext } from '../../context/favContext/FavContext';
import { WatchLaterContext } from '../../context/watchLaterContext/WatchLaterContext';
import { LikesContext } from '../../context/likesContext/LikesContext';
import { add_User_Fav, get_User_Fav, remove_User_Fav } from '../../context/favContext/apiCalls';
import { add_User_WatchLater, get_User_WatchLater, remove_User_WatchLater } from '../../context/watchLaterContext/apiCalls';
import { toast } from 'react-toastify';
import { add_User_Likes, get_User_Likes, remove_User_Likes } from '../../context/likesContext/apiCalls';
import axiosInstance from '../../api/axiosInstance';
import Spinner from '../../components/spinner/Spinner';
import { formatCount } from '../../utils/formatCount';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { ReviewsComponent } from '../../components/review/Review';
import StarComponent from '../../components/starComponent/StarComponent';
import { HistoryContext } from '../../context/historyContext/HistoryContext';
import { add_User_History, get_User_History } from '../../context/historyContext/apiCalls';
import RecommendedMovies from '../../components/recommendMovies/RecommendMovies';
import ListItem from '../../components/listItem/ListItem';
import VideoPlayer from '../../components/video/Video';
import Icons from '../../components/Icons/Icons';
const Watch = () => {
    const location = useLocation();
    const { id } = useParams()
    const { user } = useContext(AuthContext);
    const { history, dispatch } = useContext(HistoryContext)
    const { fav, dispatch: dispatchFav } = useContext(FavContext);
    const { watch, dispatch: dispatchWatchLater } = useContext(WatchLaterContext);
    const { likes, dispatch: dispatchLikes } = useContext(LikesContext);

    const [movie, setMovie] = useState(null);
    const [reviews, setReviews] = useState([]);

    const [watchedPosition, setWatchedPosition] = useState(0);

    const MySwal = withReactContent(Swal);

    // Fetch user-specific data
    useEffect(() => {
        get_User_History(user._id, dispatch);
    }, [dispatch, user._id]);

    useEffect(() => {
        get_User_Fav(user._id, dispatchFav);
    }, [dispatchFav, user._id]);

    useEffect(() => {
        get_User_WatchLater(user._id, dispatchWatchLater);
    }, [dispatchWatchLater, user._id]);

    useEffect(() => {
        get_User_Likes(user._id, dispatchLikes);
    }, [dispatchLikes, user._id]);

    // Scroll to top
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // This enables smooth scrolling
        });
    }, [id, reviews]);

    useEffect(() => {
        // Find the history entry for the corresponding movie ID
        const movieHistory = history?.content?.find(item => item.movieId === id);

        if (movieHistory) {
            // If found, update the watched position
            setWatchedPosition(movieHistory.watchedPosition);
        } else {
            // If not found, set to 0 or any default value you prefer
            setWatchedPosition(0);
        }
    }, [id, history]); // Adding history and movieId to dependencies


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

    const handleBeforeUnload = useCallback(() => {
        if (watchedPosition > 0) {
            // Only update history if the watched position is greater than 0
            add_User_History(
                { userId: user?._id, movieId: movie?._id, watchedPosition },
                dispatch
            );
        }
    }, [dispatch, user?._id, movie?._id, watchedPosition]);

    useEffect(() => {
        const beforeUnloadHandler = (event) => {
            handleBeforeUnload();
            // Optional: Add confirmation dialog (modern browsers may ignore this)
            // event.preventDefault();
            // event.returnValue = "";
        };

        // Add event listener
        window.addEventListener("beforeunload", beforeUnloadHandler);

        // Cleanup event listener
        return () => {
            window.removeEventListener("beforeunload", beforeUnloadHandler);
            handleBeforeUnload(); // Save history on unmount
        };
    }, [handleBeforeUnload]);



    return (
        <div className="movieInfoContainer">
            {movie ? (
                <>
                    <div className="detailsReviewsContainer">
                        <div className="movieHeader">
                            <div className="trailer">
                                <VideoPlayer
                                    key={movie._id}
                                    videoUrl={movie.video}
                                    subtitleUrl={movie.videoSubtitle}
                                    watchedPortion={watchedPosition}
                                    setWatchedPortion={setWatchedPosition}
                                />
                                <Icons movie={movie} />

                            </div>

                            <div className="details">
                                <h1>Watch : {movie.title}</h1>
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

export default Watch;
