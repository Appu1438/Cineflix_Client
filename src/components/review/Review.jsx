import { useState } from 'react';
import './review.scss';
import axiosInstance from '../../api/axiosInstance';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { toast } from 'react-toastify';
import StarComponent from '../starComponent/StarComponent';
import { Delete } from '@mui/icons-material';
import { format } from 'date-fns';

export const ReviewsComponent = ({ movie, reviews, user, setReviews }) => {
    const [visibleReviews, setVisibleReviews] = useState(3);
    const MySwal = withReactContent(Swal);

    const handleShowMore = () => {
        setVisibleReviews(prev => prev + 3);
    };

    const handleClose = () => {
        setVisibleReviews(3);
    };

    const handleDltReview = async (id) => {
        if (!id) {
            toast.error('Review Not Found');
            return;
        }

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

    // If there are no reviews
    if (reviews.length === 0) {
        return (
            <div className="reviewItem">
                <div className="reviewHeader">
                    <strong>No Reviews Yet...</strong>
                    <StarComponent rating={0} />
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
                            <StarComponent rating={review.rating} />

                            {review.userId === user._id && (
                                <Delete className="deleteBtn" onClick={() => handleDltReview(review._id)} />
                            )}
                        </div>
                    </div>
                    <p>{review.review}</p>
                    <h4 className="reviewTimestamp">
                    Reviewed on : {format(new Date(review.createdAt), 'MMMM d , yyyy h:mm a')}
                    </h4>
                </div>
            ))}

            {visibleReviews < reviews.length && (
                <button className="showMoreBtn" onClick={handleShowMore}>
                    Show More
                </button>
            )}

            {visibleReviews > 3 && (
                <button className="closeBtn" onClick={handleClose}>
                    Close
                </button>
            )}
        </div>
    );
};
