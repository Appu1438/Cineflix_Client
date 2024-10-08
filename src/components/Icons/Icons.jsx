import React, { useContext, useEffect, useState } from 'react'
import './icons.scss'
import {
    PlayArrow,
    Add,
    FavoriteBorder,
    ThumbUpAltOutlined,
    ThumbDownOutlined,
    Delete,
    Share,
    Info
} from '@mui/icons-material';
import { add_User_Fav, get_User_Fav, remove_User_Fav } from '../../context/favContext/apiCalls';
import { AuthContext } from '../../context/authContext/AuthContext';
import { FavContext } from '../../context/favContext/FavContext';
import { WatchLaterContext } from '../../context/watchLaterContext/WatchLaterContext';
import { LikesContext } from '../../context/likesContext/LikesContext';
import { add_User_WatchLater, get_User_WatchLater, remove_User_WatchLater } from '../../context/watchLaterContext/apiCalls';
import { add_User_Likes, get_User_Likes, remove_User_Likes } from '../../context/likesContext/apiCalls';
import { toast } from 'react-toastify';
import { formatCount } from '../../utils/formatCount';
import { Link, useLocation } from 'react-router-dom';
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton, FacebookIcon, TwitterIcon, WhatsappIcon } from 'react-share'; // Importing share buttons and icons
import { Helmet } from 'react-helmet';

export default function Icons({ movie }) {
    const location = useLocation()
    const isInfoPage = location.pathname.includes('/info');


    const { user } = useContext(AuthContext);
    const { fav, dispatch: dispatchFav } = useContext(FavContext);
    const { watch, dispatch: dispatchWatchLater } = useContext(WatchLaterContext);
    const { likes, dispatch: dispatchLikes } = useContext(LikesContext);

    // State for sharing options
    const [shareOpen, setShareOpen] = useState(false);

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

    // Function to toggle share options
    const toggleShare = () => {
        setShareOpen(!shareOpen);
    };

    const shareUrl = `${window.location.origin}/watch/${movie._id}`;
    const shareTitle = movie.title || 'Check out this movie!';
    const shareDescription = movie.description || 'Watch this amazing movie!';
    const shareImage = movie.img || ''; // Assuming you have an image URL

    return (
        
        <div className="icons">
            <Link to={isInfoPage ? `/watch/${movie._id}` : `/info/${movie._id}`} className="link">
                <div className="iconContainer">
                    {isInfoPage ? (
                        <>
                            <PlayArrow className="icon" />
                            <span className="iconLabel">Play</span>
                        </>
                    ) : (
                        <>
                            <Info className="icon" />
                            <span className="iconLabel">Info</span>
                        </>
                    )}
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
            <div className="iconContainer" onClick={toggleShare}>
                <Share className="icon" />
                <span className="iconLabel">Share </span>
            </div>

            {/* Share options display */}
            {shareOpen && (
                <div className="shareOptions">
                    <FacebookShareButton url={shareUrl} quote={shareDescription} hashtag="#Movie">
                        <FacebookIcon size={32} round />
                    </FacebookShareButton>
                    <TwitterShareButton url={shareUrl} title={shareTitle}>
                        <TwitterIcon size={32} round />
                    </TwitterShareButton>
                    <WhatsappShareButton url={shareUrl} title={shareTitle} >
                        <WhatsappIcon size={32} round />
                    </WhatsappShareButton>
                </div>
            )}
        </div>
    )
}
