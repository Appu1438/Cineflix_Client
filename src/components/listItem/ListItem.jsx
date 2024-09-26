import './listItem.scss'
import PlayArrow from '@mui/icons-material/PlayArrow';
import Add from '@mui/icons-material/Add';
import ThumbUpAltOutlined from '@mui/icons-material/ThumbUpAltOutlined';
import ThumbDownOutlined from '@mui/icons-material/ThumbDownOutlined';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS
import { useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { add_User_Fav, get_User_Fav, remove_User_Fav } from '../../context/favContext/apiCalls';
import { AuthContext } from '../../context/authContext/AuthContext';
import { FavContext } from '../../context/favContext/FavContext';
import { add_User_WatchLater, remove_User_WatchLater } from '../../context/watchLaterContext/apiCalls';
import { WatchLaterContext } from '../../context/watchLaterContext/WatchLaterContext';
import { add_User_Likes, remove_User_Likes } from '../../context/likesContext/apiCalls';
import { LikesContext } from '../../context/likesContext/LikesContext';

export default function ListItem({ index, item, scrolled }) {
    const [isHovered, setIsHovered] = useState(false);
    const [movie, setMovie] = useState({});
    const [hoverLeft, setHoverLeft] = useState(0);
    const hoverRef = useRef();

    const { user } = useContext(AuthContext)
    const { fav, dispatch: dispatchFav } = useContext(FavContext)
    const { watch, dispatch: dispatchWatchLater } = useContext(WatchLaterContext)
    const { likes, dispatch: dispatcLikes } = useContext(LikesContext)

    useEffect(() => {
        if (isHovered && hoverRef.current) {
            const itemRect = hoverRef.current.getBoundingClientRect();
            const windowWidth = window.innerWidth;
            const hoverWidth = 360; // Width after hover
            const remainingSpace = windowWidth - itemRect.right;

            // If there's not enough space on the right, adjust to fit within the window
            if (remainingSpace < hoverWidth - itemRect.width) {
                setHoverLeft(-(hoverWidth - itemRect.width));
            } else {
                setHoverLeft(0);
            }
        }
    }, [isHovered]);

    useEffect(() => {
        const controller = new AbortController();
        const { signal } = controller;
        const getMovie = async () => {
            try {
                const response = await axiosInstance.get(`movies/find/${item}`, { signal });
                item === response.data._id && setMovie(response.data); console.log(response.data)
            } catch (error) {
                if (error.name === 'CanceledError') {
                    console.log('Request canceled', error.message);
                } else {
                    console.error(error);
                }
            }
        };

        getMovie();
        return () => {
            controller.abort();
        }
    }, [item, fav, likes]);


    const handleFav = async () => {
        if (fav?.content?.includes(movie._id)) {
            try {
                const response = await remove_User_Fav({ userId: user._id, movieId: movie._id }, dispatchFav);
                if (response) {
                    console.log('Toast should display - removed');
                    toast.info("Removed from favorites!");
                }
            } catch (error) {
                console.log('Error:', error);
                toast.error("Failed to remove from favorites!");
            }
        } else {
            try {
                const response = await add_User_Fav({ userId: user._id, movieId: movie._id }, dispatchFav);
                if (response) {
                    console.log('Toast should display - added');
                    toast.success("Added to favorites!");
                }
            } catch (error) {
                console.log('Error:', error);
                toast.error("Failed to add to favorites!");
            }
        }
    };

    const handleWatchLater = async () => {
        if (watch?.content?.includes(movie._id)) {
            // Remove from Watch Later if already added
            try {
                const response = await remove_User_WatchLater({ userId: user._id, movieId: movie._id }, dispatchWatchLater);
                if (response) { // Check if response is successful
                    toast.info("Removed from Watch Later!");
                }
            } catch (error) {
                toast.error("Failed to remove from Watch Later!");
            }
        } else {
            // Add to Watch Later if not added
            try {
                const response = await add_User_WatchLater({ userId: user._id, movieId: movie._id }, dispatchWatchLater);
                if (response) { // Check if response is successful
                    toast.success("Added to Watch Later!");
                }
            } catch (error) {
                toast.error("Failed to add to Watch Later!");
            }
        }
    };


    const handleLike = async () => {
        add_User_Likes({ userId: user._id, movieId: movie._id }, dispatcLikes)
    }
    const handleDisLike = async () => {
        remove_User_Likes({ userId: user._id, movieId: movie._id }, dispatcLikes)
    }

    return (
        <div
            className={isHovered && !scrolled ? 'listItem hover' : 'listItem'}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            ref={hoverRef}
        // style={{ left: isHovered ? `${hoverLeft}px` : '0px' }}
        >
            <img src={movie.imgsm} alt={movie.title} />

            {isHovered && !scrolled && (
                <>
                    <video src={movie.trailer} autoPlay loop controls />
                    <div className="itemInfo">
                        <div className="icons">
                            <Link to="/watch" state={{ movie }} className="link">
                                <div className="iconContainer">
                                    <PlayArrow className="icon" />
                                    <span className="iconLabel">Play</span>
                                </div>
                            </Link>

                            <div className="iconContainer" onClick={handleWatchLater}>
                                <Add className={watch?.content?.includes(movie._id) ? "icon hovered" : "icon "} />
                                <span className="iconLabel">Watch Later</span>
                            </div>

                            <div className="iconContainer" onClick={handleFav}>
                                <FavoriteBorder className={fav?.content?.includes(movie._id) ? "icon hovered" : "icon"} />
                                <span className="iconLabel">Favorite</span>
                                {/* <span className="iconLabel">{movie.favCount}</span> */}
                            </div>

                            <div className="iconContainer" onClick={handleLike}>
                                <ThumbUpAltOutlined className={likes?.likes?.content?.includes(movie._id) ? "icon hovered" : "icon"} />
                                <span className="iconLabel">Like</span>
                                {/* <span className="iconLabel">{movie.likes}</span> */}
                            </div>

                            <div className="iconContainer" onClick={handleDisLike}>
                                <ThumbDownOutlined className={likes?.dislikes?.content?.includes(movie._id) ? "icon hovered" : "icon"} />
                                <span className="iconLabel">Dislike</span>
                                {/* <span className="iconLabel">{movie.dislikes}</span> */}
                            </div>
                        </div>

                        <div className="itemInfoTop">
                            <span>{movie.duration}</span>
                            <span className='limit'>+{movie.limit}</span>
                            <span>{movie.year}</span>
                        </div>
                        <div className="title">{movie.title}</div>
                        <div className="desc">{movie.desc}</div>
                        <div className="genre">
                            {Array.isArray(movie?.genre) ? movie.genre.join(', ') : movie?.genre}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
