// src/components/modal/Modal.js
import React, { useRef, useState } from 'react';
import './modal.scss'; // Add your styles for the modal
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import storage from '../../firebase';

const Modal = ({ isOpen, onClose, user, onSubmit }) => {
    const [username, setUsername] = useState(user.username);
    const [profilePic, setProfilePic] = useState(user.profilePic);
    const [password, setPassword] = useState('');
    const [showConfirmDelete, setShowConfirmDelete] = useState(false); // New state for confirmation
    const fileInputRef = useRef(null); // Reference for file input

    const handleSubmit = (e) => {
        e.preventDefault();

        // Create an object to hold the updated data
        const updatedData = { username, profilePic };

        // Only add password if it is provided
        if (password) {
            updatedData.password = password;
        }
        if(profilePic==null){
            handleDeleteProfileImage()
        }

        // Call the onSubmit function passed from MyList with the new data
        onSubmit(updatedData);
        onClose(); // Close the modal after submission
    };
    const handleProfileChange = (e) => {
        const image = e.target.files[0];
        if (!image) return; // Early return if no image is selected

        const filename = new Date().getTime() + image.name;
        const storageRef = ref(storage, `items/${filename}`);

        const uploadTask = uploadBytesResumable(storageRef, image);

        // Monitor the upload progress
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(`Upload is ${progress}% done`);

                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                console.error('Upload failed:', error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log('File available at', downloadURL);
                    setProfilePic(downloadURL);
                });
            }
        );
    };

    // Function to delete profile image
    const handleDeleteProfileImage = () => {
        const fileRef = ref(storage, user.profilePic);
        deleteObject(fileRef)
            .then(() => {
                console.log('Profile image deleted successfully');
                setShowConfirmDelete(false); // Close confirmation on successful delete
            })
            .catch((error) => {
                console.error('Error deleting profile image:', error);
            });
    };


    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Edit Profile</h2>
                <form onSubmit={handleSubmit}>
                    <div className="profile-image-section">
                        <img
                            src={profilePic || "https://images.pexels.com/photos/6899260/pexels-photo-6899260.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"}
                            alt="Profile"
                            className="profile-image"
                            onClick={() => fileInputRef.current.click()} // Open file input on click
                        />
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleProfileChange}
                            style={{ display: 'none' }} // Hide file input
                        />

                        {profilePic && (
                            <>
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmDelete(true)}
                                    className="delete-button"
                                >
                                    Delete Profile Image
                                </button>
                                {showConfirmDelete && (
                                    <div className="confirm-delete">
                                        <p>Are you sure you want to delete this image?</p>
                                        <button onClick={() => setProfilePic(null)} className="confirm-button">
                                            Yes, Delete
                                        </button>
                                        <button
                                            onClick={() => setShowConfirmDelete(false)}
                                            className="cancel-button"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="email"
                            id="email"
                            value={user.email}
                            readOnly
                        />
                    </div>
                    <div className="form-group">
                        <input
                            placeholder="Change Password"
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit">Update Profile</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default Modal;
