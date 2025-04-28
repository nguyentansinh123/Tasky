import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { useAuthStore } from '../../store/useAuthStore';
import axios from 'axios';
import toast from 'react-hot-toast';
import './LeaveReviewForm.css';

const LeaveReviewForm = ({ userId, taskId, onReviewSubmitted }) => {
  const { getToken, authUser } = useAuthStore();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    try {
      setSubmitting(true);
      const token = getToken();
      
      if (!token) {
        toast.error('You must be logged in to leave a review');
        return;
      }
      
      const response = await axios.post(
        `http://localhost:9193/api/v1/reviews/add?reviewedUserId=${userId}&starRating=${rating}&comments=${encodeURIComponent(comment)}`,
        {},  
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.data && response.data.success) {
        toast.success('Review submitted successfully');
        
        const newReview = {
          id: response.data.data?.id || Date.now(), 
          reviewerId: authUser.id,
          reviewerName: `${authUser.firstName} ${authUser.lastName}`,
          reviewerImageUrl: authUser.profileImageUrl,
          rating: rating,
          comment: comment.trim(),
          createdAt: new Date().toISOString(),
          taskId: taskId,
          taskTitle: response.data.data?.taskTitle
        };
        
        setRating(0);
        setComment('');
        
        if (onReviewSubmitted) {
          onReviewSubmitted(newReview);
        }
      } else {
        toast.error(response.data?.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error(error.response?.data?.message || 'Error submitting review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="leave-review-form">
      <h3 className="form-title">Leave a Review</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="rating-selector">
          <p>Rate your experience:</p>
          <div className="stars-container">
            {[...Array(5)].map((_, index) => {
              const ratingValue = index + 1;
              
              return (
                <label key={index}>
                  <input
                    type="radio"
                    name="rating"
                    value={ratingValue}
                    onClick={() => setRating(ratingValue)}
                    className="star-radio"
                  />
                  <FaStar
                    className="star"
                    color={ratingValue <= (hover || rating) ? "#FFB400" : "#e4e5e9"}
                    size={24}
                    onMouseEnter={() => setHover(ratingValue)}
                    onMouseLeave={() => setHover(0)}
                  />
                </label>
              );
            })}
          </div>
          <span className="rating-value">{rating > 0 ? `${rating}/5` : "Select a rating"}</span>
        </div>
        
        <div className="comment-input">
          <label htmlFor="review-comment">Add your comments (optional):</label>
          <textarea
            id="review-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience working with this person..."
            rows={4}
            maxLength={500}
          />
          <div className="char-counter">
            {comment.length}/500 characters
          </div>
        </div>
        
        <button
          type="submit"
          className="submit-review-btn"
          disabled={submitting || rating === 0}
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
};

export default LeaveReviewForm;