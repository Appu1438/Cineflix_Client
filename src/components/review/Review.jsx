import { useEffect, useState } from 'react';
import './review.scss';
import axiosInstance from '../../api/axiosInstance';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { toast } from 'react-toastify';
import StarComponent from '../starComponent/StarComponent';
import { Delete } from '@mui/icons-material';
import { format } from 'date-fns';
import StarRatingComponent from 'react-star-rating-component';

export const ReviewsComponent = ({ id, user, reviews, setReviews }) => {

    const [newReview, setNewReview] = useState('');
    const [rating, setRating] = useState(0);
    const [visibleReviews, setVisibleReviews] = useState(3);
    const MySwal = withReactContent(Swal);

    const handleShowMore = () => {
        setVisibleReviews(prev => prev + 3);
    };

    const handleClose = () => {
        setVisibleReviews(3);
    };
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
            const response = await axiosInstance.post(`movies/review/${id}`, {
                userId: user._id,
                userName: user.username,
                review: newReview,
                rating
            });
    
            // Check response status for success messages
            if (response.status === 201) {
                toast.success('Review added!');
            } else if (response.status === 200) {
                toast.success('Review updated!');
            }
    
            // Update the review list and reset fields
            setReviews((prev) => {
                if (response.status === 201) {
                    // If a new review was added, add it to the front
                    return [response.data.review, ...prev];
                } else {
                    // If an existing review was updated, replace it in the list
                    return prev.map((review) => 
                        review._id === response.data.review._id ? response.data.review : review
                    );
                }
            });
    
            setNewReview('');
            setRating(0);
        } catch (error) {
            toast.error('Failed to add/update review!');
        }
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
                    const response = await axiosInstance.delete(`movies/review/${id}`, {
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



    return (
        <div>
            <>
                {/* Conditionally render "No Reviews Yet..." when reviews array is empty */}
                {reviews.length === 0 ? (
                    <div className="reviewItem">
                        <div className="reviewHeader">
                            <strong>No Reviews Yet...</strong>
                            <StarComponent rating={0} />
                        </div>
                        <p>Be the first one to review</p>
                    </div>
                ) : (
                    <>
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
                                    Reviewed on: {format(new Date(review.createdAt), 'MMMM d, yyyy h:mm a')}
                                </h4>
                            </div>
                        ))}

                        {/* Show "Show More" button if there are more reviews to show */}
                        {visibleReviews < reviews.length && (
                            <button className="showMoreBtn" onClick={handleShowMore}>
                                Show More
                            </button>
                        )}

                        {/* Show "Close" button if more than 3 reviews are visible */}
                        {visibleReviews > 3 && (
                            <button className="closeBtn" onClick={handleClose}>
                                Close
                            </button>
                        )}
                    </>
                )}

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
                        placeholder="Submit your review here to Add or Update Your Review"
                    />
                    <button onClick={handleAddReview}>Submit Review</button>
                </div>
            </>
        </div>
    );

};
