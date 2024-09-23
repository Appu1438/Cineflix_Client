import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../../context/authContext/AuthContext';
import './myList.scss';
import List from '../../components/list/List';
import { FavContext } from '../../context/favContext/FavContext';
import { get_User_Fav } from '../../context/favContext/apiCalls';
import Navbar from '../../components/navbar/Navbar';

export default function MyList() {
    const { user } = useContext(AuthContext);
    const { fav, dispatch } = useContext(FavContext);

    useEffect(() => {
        get_User_Fav(user._id, dispatch);
    }, [dispatch, user._id]);

    const handleEdit = () => {
        // Define what happens when edit button is clicked (e.g., open a modal or navigate to an edit profile page)
        console.log('Edit button clicked!');
    };

    return (
        <div className="my-list">
            <Navbar />
            <div className="profile-section">
                <div className="profile-info">
                    <img src={user.profilePic} alt={user.name} className="profile-avatar" />
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
            <List list={fav} />
        </div>
    );
}
