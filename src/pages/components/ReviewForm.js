import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';
import { addReview, getAllReviews } from '../indexedDB'; 
import './ReviewForm.css';
const ReviewForm = () => {
    const [name, setName] = useState('');
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const reviewsFromDB = await getAllReviews();
                setReviews(reviewsFromDB);
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        };

        fetchReviews();
    }, []);

    const handleSubmitReview = async (e) => {
        e.preventDefault();

        const newReview = {
            name,
            rating,
            comment,
        };

        try {
            await addReview(newReview);
            setReviews([...reviews, newReview]); 
            setName('');
            setRating(5);
            setComment('');
        } catch (error) {
            console.error('Error adding review:', error);
        }
    };

    const handleStarClick = (starRating) => {
        setRating(starRating);
    };

    return (
        <div className="review-form-container">
            <div className="review-form-box">
                <h2 className="review-form-title">Leave a Review</h2>
                <form className="review-form" onSubmit={handleSubmitReview}>
                    <div className="star-rating-container">
                        {[1, 2, 3, 4, 5].map((num) => (
                            <FontAwesomeIcon
                                key={num}
                                icon={num <= rating ? solidStar : regularStar}
                                className="star-icon"
                                onClick={() => handleStarClick(num)}
                            />
                        ))}
                    </div>
                    <input
                        type="text"
                        placeholder="Your Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="review-form-input"
                    />
                    <textarea
                        placeholder="Your Comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                        className="review-form-textarea"
                    ></textarea>
                    <button type="submit" className="review-form-button">
                        Submit
                    </button>
                </form>
            </div>
            <div className="review-list">
                <h2>Reviews</h2>
                {reviews.slice().reverse().map((review, index) => (
                    <div key={index} className="review-item">
                        <div className="review-item-content">
                            <strong>{review.name}:</strong>
                            <br />
                            {review.comment}
                        </div>
                        <div className="review-item-rating">
                            {[1, 2, 3, 4, 5].map((num) => (
                                <FontAwesomeIcon
                                    key={num}
                                    icon={num <= review.rating ? solidStar : regularStar}
                                    className="star-icon"
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReviewForm;
