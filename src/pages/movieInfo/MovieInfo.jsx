import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './movieInfo.scss';
import {
    PlayArrow,
    Add,
    FavoriteBorder,
    ThumbUpAltOutlined,
    ThumbDownOutlined,
    Delete
} from '@mui/icons-material';
import { AuthContext } from '../../context/authContext/AuthContext';
import { FavContext } from '../../context/favContext/FavContext';
import { WatchLaterContext } from '../../context/watchLaterContext/WatchLaterContext';
import { LikesContext } from '../../context/likesContext/LikesContext';
import { add_User_Fav, get_User_Fav, remove_User_Fav } from '../../context/favContext/apiCalls';
import { add_User_WatchLater, get_User_WatchLater, remove_User_WatchLater } from '../../context/watchLaterContext/apiCalls';
import { toast } from 'react-toastify';
import { add_User_Likes, get_User_Likes, remove_User_Likes } from '../../context/likesContext/apiCalls';
import StarRatingComponent from 'react-star-rating-component';
import axiosInstance from '../../api/axiosInstance';
import Spinner from '../../components/spinner/Spinner';
import { formatCount } from '../../utils/formatCount';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { ReviewsComponent } from '../../components/review/Review';
import StarComponent from '../../components/starComponent/StarComponent';


const MovieInfo = () => {
    const location = useLocation();
    const id = location.state.id;
    const { user } = useContext(AuthContext);
    const { fav, dispatch: dispatchFav } = useContext(FavContext);
    const { watch, dispatch: dispatchWatchLater } = useContext(WatchLaterContext);
    const { likes, dispatch: dispatchLikes } = useContext(LikesContext);

    const [movie, setMovie] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState('');
    const [rating, setRating] = useState(0);

    const MySwal = withReactContent(Swal);


    // Fetch user-specific data
    useEffect(() => {
        get_User_Fav(user._id, dispatchFav);
    }, [dispatchFav, user._id]);

    useEffect(() => {
        get_User_WatchLater(user._id, dispatchWatchLater);
    }, [dispatchWatchLater, user._id]);

    useEffect(() => {
        get_User_Likes(user._id, dispatchLikes);
    }, [dispatchLikes, user._id]);

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

    // Fetch reviews for the movie
    useEffect(() => {
        if (!movie?._id) return;

        const fetchReviews = async () => {
            try {
                const response = await axiosInstance.get(`movies/review/${movie._id}`);
                setReviews(response.data);
            } catch (error) {
                console.error('Failed to fetch reviews:', error);
            }
        };
        fetchReviews();
    }, [movie]);

    // Handle adding/removing from favorites
    const handleFav = async () => {
        try {
            if (fav?.content?.includes(movie._id)) {
                await remove_User_Fav({ userId: user._id, movieId: movie._id }, dispatchFav);
                toast.info("Removed from favorites!");
            } else {
                await add_User_Fav({ userId: user._id, movieId: movie._id }, dispatchFav);
                toast.success("Added to favorites!");
            }
        } catch (error) {
            toast.error("Failed to update favorites!");
        }
    };

    // Handle adding/removing from Watch Later
    const handleWatchLater = async () => {
        try {
            if (watch?.content?.includes(movie._id)) {
                await remove_User_WatchLater({ userId: user._id, movieId: movie._id }, dispatchWatchLater);
                toast.info("Removed from Watch Later!");
            } else {
                await add_User_WatchLater({ userId: user._id, movieId: movie._id }, dispatchWatchLater);
                toast.success("Added to Watch Later!");
            }
        } catch (error) {
            toast.error("Failed to update Watch Later!");
        }
    };

    // Handle like/dislike actions
    const handleLike = async () => {
        add_User_Likes({ userId: user._id, movieId: movie._id }, dispatchLikes);
    };

    const handleDislike = async () => {
        remove_User_Likes({ userId: user._id, movieId: movie._id }, dispatchLikes);
    };

    // Handle star rating for new review
    const onStarClick = (nextValue) => {
        setRating(nextValue);
    };

    // Handle adding a new review
    const handleAddReview = async () => {
        if (!newReview.trim()) {
            toast.error('Review cannot be empty!');
            return;
        }

        // Check if the rating is selected
        if (rating === 0) { // Assuming rating is initialized to 0 when no selection is made
            toast.error('Please select a rating!');
            return;
        }

        try {
            const response = await axiosInstance.post(`movies/review/${movie._id}`, {
                userId: user._id,
                userName: user.username,
                review: newReview,
                rating
            });
            setReviews((prev) => [...prev, response.data.review]);
            setNewReview('');
            setRating(0);
            toast.success('Review added!');
        } catch (error) {
            toast.error('Failed to add review!');
        }
    };

    //Handle deleting review

    const handleDltReview = async (id) => {
        if (!id) {
            toast.error('Review Not Found');
            return;
        }

        // SweetAlert2 confirmation dialog
        MySwal.fire({
            title: 'Are you sure?',
            text: "Do you really want to delete this review? This action cannot be undone.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#e50914',
            cancelButtonColor: '#555',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axiosInstance.delete(`movies/review/${movie._id}`, {
                        params: {
                            reviewId: id
                        }
                    });

                    if (response.status === 200) {
                        toast.success('Review deleted successfully');
                        // Optionally update the UI by removing the deleted review from the local state
                        setReviews(prevReviews => prevReviews.filter(review => review._id !== id));
                    } else {
                        toast.error('Failed to delete the review');
                    }
                } catch (error) {
                    console.error(error);
                    toast.error('An error occurred while deleting the review');
                }
            }
        });
    };


    return (
        <div className="movieInfoContainer">
            {movie ? (
                <>
                    <div className="movieHeader">
                        <div className="trailer">
                            <iframe
                                src={movie.trailer}
                                title="Movie Trailer"
                                allow="fullscreen"
                                className="trailerVideo"
                            />
                        </div>
                        <div className="details">
                            <h1>{movie.title}</h1>
                            <p>{movie.desc}</p>
                            <div className="icons">
                                <Link to="/watch" state={{ movie }} className="link">
                                    <div className="iconContainer">
                                        <PlayArrow className="icon" />
                                        <span className="iconLabel">Play</span>
                                    </div>
                                </Link>

                                <div className="iconContainer" onClick={handleWatchLater}>
                                    <Add className={watch?.content?.includes(movie._id) ? "icon hovered" : "icon"} />
                                    <span className="iconLabel">Watch Later</span>
                                </div>

                                <div className="iconContainer" onClick={handleFav}>
                                    <FavoriteBorder className={fav?.content?.includes(movie._id) ? "icon hovered" : "icon"} />
                                    <span className="iconLabel">Favorite </span>
                                    {movie.favCount ? formatCount(movie.favCount) : ""}
                                </div>

                                <div className="iconContainer" onClick={handleLike}>
                                    <ThumbUpAltOutlined className={likes?.likes?.content?.includes(movie._id) ? "icon hovered" : "icon"} />
                                    <span className="iconLabel">Like</span>
                                    {movie.likes ? formatCount(movie.likes) : ""}
                                </div>

                                <div className="iconContainer" onClick={handleDislike}>
                                    <ThumbDownOutlined className={likes?.dislikes?.content?.includes(movie._id) ? "icon hovered" : "icon"} />
                                    <span className="iconLabel">Dislike </span>
                                    {movie.dislikes ? formatCount(movie.dislikes) : ""}
                                </div>
                            </div>

                            <div className="averageRating">
                                <h4>Rating: {movie.average.toFixed(1)}/5</h4>
                                <StarComponent rating={movie.average}/>
                            </div>
                        </div>
                    </div>

                    {/* Reviews Section */}
                    <div className="reviewsSection">
                        <h2>Reviews {movie.reviewcount !== undefined ? `(${formatCount(movie.reviewcount)})` : ""}</h2>
                        <ReviewsComponent movie={movie} reviews={reviews} user={user} setReviews={setReviews} />
                      
                        <div className="addReview">
                            <h3>Add Your Review</h3>
                            <StarRatingComponent
                                name="rateMovie"
                                starCount={5}
                                value={rating}
                                onStarClick={onStarClick}
                                starColor="#FFD700"
                                emptyStarColor="#CCCCCC"
                                className="starRatingInput"
                            />
                            <textarea
                                value={newReview}
                                onChange={(e) => setNewReview(e.target.value)}
                                placeholder="Write your review here..."
                            />
                            <button onClick={handleAddReview}>Submit Review</button>
                        </div>

                    </div>
                </>
            ) : (
                <Spinner />
            )}
        </div>
    );

};

export default MovieInfo;
