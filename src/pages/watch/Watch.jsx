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
import StarRatingComponent from 'react-star-rating-component';
import axiosInstance from '../../api/axiosInstance';
import Spinner from '../../components/spinner/Spinner';
import { formatCount } from '../../utils/formatCount';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { ReviewsComponent } from '../../components/review/Review';
import StarComponent from '../../components/starComponent/StarComponent';
import { HistoryContext } from '../../context/historyContext/HistoryContext';
import { add_User_History } from '../../context/historyContext/apiCalls';
import RecommendedMovies from '../../components/recommendMovies/RecommendMovies';
import ListItem from '../../components/listItem/ListItem';
import VideoPlayer from '../../components/video/Video';
const Watch = () => {
    const location = useLocation();
    const { id } = useParams()
    const { user } = useContext(AuthContext);
    const { dispatch } = useContext(HistoryContext)
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

    // Fetch reviews for the movie
    useEffect(() => {
        if (!id) return; // Check if movie ID is available and if reviews are already fetched

        const controller = new AbortController();
        const { signal } = controller;

        const fetchReviews = async () => {
            try {
                const response = await axiosInstance.get(`movies/review/${id}`, { signal });
                setReviews(response.data);
            } catch (error) {
                console.error('Failed to fetch reviews:', error);
            }
        };

        fetchReviews();

        return () => {
            controller.abort();
        };
    }, [id]);


    //History
    useEffect(() => {
        add_User_History({ userId: user._id, movieId: movie?._id }, dispatch)
    }, [dispatch, user?._id, movie?._id])


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
            setReviews((prev) => [response.data.review, ...prev]);
            setNewReview('');
            setRating(0);
            toast.success('Review added!');
        } catch (error) {
            toast.error('Failed to add review!');
        }
    };


    return (
        <div className="movieInfoContainer">
            {movie ? (
                <>
                    <div className="detailsReviewsContainer">
                        <div className="movieHeader">
                            <div className="trailer">
                                <VideoPlayer
                                    key={movie._id}
                                    videoQualities={[
                                        {
                                            label: '360P', url: movie.video
                                        },
                                        {
                                            label: '480P', url: "https://firebasestorage.googleapis.com/v0/b/cineflix-79be6.appspot.com/o/items%2F1725823905055videoplayback%20(4).mp4?alt=media&token=18744a18-a2aa-47da-b61c-d848ccd0a225"
                                        },
                                        {
                                            label: '720P', url: "https://firebasestorage.googleapis.com/v0/b/cineflix-79be6.appspot.com/o/items%2F1725685863201videoplayback%20(1).mp4?alt=media&token=33ff34dc-82f9-4df9-9c3a-1bdaf173d33b"
                                        }
                                    ]}
                                    subtitleUrl={movie.videoSubtitle}
                                />
                            </div>

                            <div className="details">
                                <h1>Watch : {movie.title}</h1>
                                <p>{movie.desc}</p>
                                <p>{movie.genre.join(' ,  ')}</p>
                                <div className="icons">
                                    <Link to={`/info/${movie._id}`} className="link">
                                        <div className="iconContainer">
                                            <Info className="icon" />
                                            <span className="iconLabel">Info</span>
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
                                    <StarComponent rating={movie.average} />
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
                    </div>

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
