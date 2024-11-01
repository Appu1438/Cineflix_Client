import React, { useRef, useState } from 'react';
import './modal.scss';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import storage from '../../firebase';

const Modal = ({ isOpen, onClose, user, onSubmit }) => {
    const [username, setUsername] = useState(user.username);
    const [profilePic, setProfilePic] = useState(user.profilePic);
    const [profilePicPreview, setProfilePicPreview] = useState(user.profilePic);
    const [password, setPassword] = useState('');
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const fileInputRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        let profilePicUrl = profilePic;

        if (selectedFile) {
            console.log('Uploading New Pic')
            const filename = new Date().getTime() + selectedFile.name;
            const storageRef = ref(storage, `items/${filename}`);
            const uploadTask = await uploadBytesResumable(storageRef, selectedFile);
            profilePicUrl = await getDownloadURL(uploadTask.ref);

            if (user.profilePic) {
                handleDeleteProfileImage(); // Delete old image if exists
            }
        }

        if (profilePic == null && user.profilePic && !selectedFile) {
            handleDeleteProfileImage()
        }

        const updatedData = { username, profilePic: profilePicUrl };

        if (password) {
            updatedData.password = password;
        }

        onSubmit(updatedData);
        onClose();
    };

    const handleProfileChange = (e) => {
        const image = e.target.files[0];
        if (!image) return;
        setSelectedFile(image);
        setProfilePicPreview(URL.createObjectURL(image)); // Set preview only
    };

    const handleRemoveProfile = () => {
        setProfilePicPreview(null)
        setProfilePic(null)

    }
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
                            src={profilePicPreview || "https://images.pexels.com/photos/6899260/pexels-photo-6899260.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"}
                            alt="Profile"
                            className="profile-image"
                            onClick={() => fileInputRef.current.click()}
                        />
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleProfileChange}
                            style={{ display: 'none' }}
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
                                        <button onClick={handleRemoveProfile} className="confirm-button">
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
