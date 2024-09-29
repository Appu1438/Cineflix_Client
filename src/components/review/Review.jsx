import { useState } from 'react';
import './review.scss'
import axiosInstance from '../../api/axiosInstance';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { toast } from 'react-toastify';
import StarRatingComponent from 'react-star-rating-component';
import {
    Delete
} from '@mui/icons-material';
export const ReviewsComponent = ({ movie, reviews, user, setReviews }) => {
    // State to track how many reviews to display at first (default is 5)
    const [visibleReviews, setVisibleReviews] = useState(1);
    const MySwal = withReactContent(Swal);

    // Show more reviews by increasing the number of visible reviews
    const handleShowMore = () => {
        setVisibleReviews(prev => prev + 5);
    };

    // Reset the reviews to only show the first 5
    const handleClose = () => {
        setVisibleReviews(1);
    };

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

    if (reviews.length === 0) {
        return (
            <div className="reviewItem">
                <div className="reviewHeader">
                    <strong>No Reviews Yet...</strong>
                    <StarRatingComponent
                        starCount={5}
                        value={0}
                        editing={false}
                        starColor="#FFD700"
                        emptyStarColor="#CCCCCC"
                        className=""
                    />
                </div>
                <p>Be the first one to review</p>
            </div>
        );
    }

    return (
        <div>
            {reviews.slice(0, visibleReviews).map((review, index) => (
                <div key={index} className="reviewItem">
                    <div className="reviewHeader">
                        <strong>{review.userName}</strong>
                        <div className="reviewStar">
                            <StarRatingComponent
                                name={`rating-${index}`}
                                starCount={5}
                                value={review.rating}
                                editing={false}
                                starColor="#FFD700"
                                emptyStarColor="#CCCCCC"
                                className="starRatingInput"
                            />
                            {/* Show delete button if the user is the reviewer */}
                            {review.userId === user._id && (
                                <Delete className="deleteBtn" onClick={() => handleDltReview(review._id)} />
                            )}
                        </div>
                    </div>
                    <p>{review.review}</p>
                </div>
            ))}

            {/* Show More button if there are more reviews */}
            {visibleReviews < reviews.length && (
                <button className="showMoreBtn" onClick={handleShowMore}>
                    Show More
                </button>
            )}

            {/* Show Close button if more than 5 reviews are visible */}
            {visibleReviews > 5 && (
                <button className="closeBtn" onClick={handleClose}>
                    Close
                </button>
            )}
        </div>
    );
};
