import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/authContext/AuthContext';
import './myList.scss';
import List from '../../components/list/List';
import { FavContext } from '../../context/favContext/FavContext';
import { get_User_Fav } from '../../context/favContext/apiCalls';
import Navbar from '../../components/navbar/Navbar';
import { get_User_History } from '../../context/historyContext/apiCalls';
import { HistoryContext } from '../../context/historyContext/HistoryContext';
import { WatchLaterContext } from '../../context/watchLaterContext/WatchLaterContext';
import { get_User_WatchLater } from '../../context/watchLaterContext/apiCalls';
import { LikesContext } from '../../context/likesContext/LikesContext';
import { get_User_Likes } from '../../context/likesContext/apiCalls';
import Modal from '../../components/modal/Modal'; // Import the Modal component
import axiosInstance from '../../api/axiosInstance';
import { updateUser } from '../../context/authContext/apiCalls';

export default function MyList() {
    const { user, dispatch: dispatchUser } = useContext(AuthContext);
    const { fav, dispatch: dispatchFav } = useContext(FavContext);
    const { history, dispatch: dispatchHistory } = useContext(HistoryContext);
    const { watch, dispatch: dispatchWatchLater } = useContext(WatchLaterContext);
    const { likes, dispatch: dispatchLikes } = useContext(LikesContext);

    const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

    useEffect(() => {
        get_User_Fav(user._id, dispatchFav);
    }, [dispatchFav, user._id]);

    useEffect(() => {
        get_User_History(user._id, dispatchHistory);
    }, [dispatchHistory, user._id]);

    useEffect(() => {
        get_User_WatchLater(user._id, dispatchWatchLater);
    }, [dispatchWatchLater, user._id]);

    useEffect(() => {
        get_User_Likes(user._id, dispatchLikes);
    }, [dispatchLikes, user._id]);

    const handleEdit = () => {
        setIsModalOpen(true); // Open the modal when edit button is clicked
    };

    const handleModalClose = () => {
        setIsModalOpen(false); // Close the modal
    };


    const handleProfileUpdate = async (updatedData) => {
        updateUser(updatedData, dispatchUser)
    };

    // Scroll to top
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // This enables smooth scrolling
        });
    }, []);

    

    return (
        <div className="my-list">
            <div className="profile-section">
                <div className="profile-info">
                    <img
                        src={user.profilePic || "https://images.pexels.com/photos/6899260/pexels-photo-6899260.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"}
                        alt={user.username} className="profile-avatar" />
                    <h2 className="profile-name">{user.username}</h2>
                    <p className="profile-email">{user.email}</p>

                    {/* Adding Account Created and Updated Information */}
                    <div className="profile-dates">
                        <p>Account Created On: {new Date(user.createdAt).toLocaleDateString()}</p>
                        <p>Last Updated: {new Date(user.updatedAt).toLocaleDateString()}</p>
                    </div>
                </div>

                {/* Edit Button */}
                <button className="edit-button" onClick={handleEdit}>Edit Profile</button>
            </div>

            {fav?.content?.length > 0 ? (<List list={fav} />) : (null)}
            {history?.content?.length > 0 ? (<List list={history} />) : (null)}
            {watch?.content?.length > 0 ? (<List list={watch} />) : (null)}
            {likes?.likes?.content?.length > 0 ? (<List list={likes.likes} />) : (null)}
            {likes?.dislikes?.content?.length > 0 ? (<List list={likes.dislikes} />) : (null)}

            {/* Modal for Editing Profile */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                user={user}
                onSubmit={handleProfileUpdate}
            />
        </div>
    );
}
