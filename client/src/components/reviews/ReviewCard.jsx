import React, { useState } from 'react';
import { FaStar, FaStarHalf, FaUser, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import axios from 'axios';
import toast from 'react-hot-toast';
import './ReviewCard.css';

const DEFAULT_PROFILE_IMAGE = "https://img.freepik.com/premium-vector/cute-avatar-akita-head-simple-cartoon-vector-illustration-dog-breeds-nature-concept-icon-isolated_772770-320.jpg";

const ReviewCard = ({ review, onUpdateReview, canEdit = false }) => {
  const navigate = useNavigate();
  const { getToken } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editRating, setEditRating] = useState(review.rating);
  const [editComment, setEditComment] = useState(review.comment || "");
  const [hover, setHover] = useState(0);
  const [updating, setUpdating] = useState(false);
  
  const renderStarRating = (rating, isInteractive = false) => {
    const safeRating = typeof rating === 'number' && !isNaN(rating) ? rating : 0;
    const stars = [];
    
    for (let i = 1; i <= 5; i++) {
      if (isInteractive) {
        stars.push(
          <FaStar
            key={`star-${i}`}
            className={`review-star ${i <= (hover || editRating) ? 'filled' : 'empty'}`}
            onClick={() => setEditRating(i)}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(0)}
          />
        );
      } else {
        const fullStars = Math.floor(safeRating);
        const hasHalfStar = safeRating % 1 >= 0.5;
        
        if (i <= fullStars) {
          stars.push(<FaStar key={`star-${i}`} className="review-star filled" />);
        } else if (i === fullStars + 1 && hasHalfStar) {
          stars.push(<FaStarHalf key={`star-${i}`} className="review-star filled" />);
        } else {
          stars.push(<FaStar key={`star-${i}`} className="review-star empty" />);
        }
      }
    }
    
    return (
      <div className="star-rating-display">
        {stars}
        <span className="rating-number">{safeRating.toFixed(1)}</span>
      </div>
    );
  };
  
  const handleUpdateReview = async () => {
    if (editRating === 0) {
      toast.error('Please select a rating');
      return;
    }
    
    try {
      setUpdating(true);
      const token = getToken();
      
      if (!token) {
        toast.error('You must be logged in to update a review');
        return;
      }
      
      console.log(`Updating review ${review.id} with rating ${editRating} and comment: ${editComment}`);
      
      const response = await axios.put(
        `http://localhost:9193/api/v1/reviews/${review.id}?starRating=${editRating}&comments=${encodeURIComponent(editComment.trim())}`,
        {}, 
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      console.log('Update response:', response.data);
      
      if (response.data && response.data.success) {
        toast.success('Review updated successfully');
        setIsEditing(false);
        
        if (onUpdateReview) {
          onUpdateReview();
        }
      } else {
        toast.error(response.data?.message || 'Failed to update review');
      }
    } catch (error) {
      console.error('Error updating review:', error);
      
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        
        if (error.response.data && error.response.data.message) {
          toast.error(`Error: ${error.response.data.message}`);
        } else {
          toast.error(`Error ${error.response.status}: Failed to update review`);
        }
      } else {
        toast.error('Error updating review. Please try again.');
      }
    } finally {
      setUpdating(false);
    }
  };
  
  return (
    <div className="review-card">
      <div className="review-header">
        <div className="reviewer-info">
          <div 
            className="reviewer-avatar clickable" 
            onClick={() => review.reviewerId && navigate(`/task-user/${review.reviewerId}`)}
          >
            {review.reviewerImageUrl ? (
              <img 
                src={review.reviewerImageUrl} 
                alt={review.reviewerName}
                onError={(e) => {
                  e.target.src = DEFAULT_PROFILE_IMAGE;
                  e.target.onerror = null;
                }}
              />
            ) : (
              <div className="avatar-initials">
                {review.reviewerName?.charAt(0).toUpperCase() || <FaUser />}
              </div>
            )}
          </div>
          
          <div className="reviewer-details">
            <div 
              className="reviewer-name clickable" 
              onClick={() => review.reviewerId && navigate(`/task-user/${review.reviewerId}`)}
            >
              {review.reviewerName || 'Anonymous User'}
            </div>
          </div>
        </div>
        
        <div className="review-actions">
          {!isEditing ? (
            <>
              <div className="review-rating">
                {renderStarRating(review.rating)}
              </div>
              
              {canEdit && (
                <button 
                  className="edit-review-btn"
                  onClick={() => setIsEditing(true)}
                  title="Edit review"
                >
                  <FaEdit />
                </button>
              )}
            </>
          ) : (
            <div className="star-rating-edit">
              {renderStarRating(editRating, true)}
            </div>
          )}
        </div>
      </div>
      
      <div className="review-content">
        {!isEditing ? (
          <p>{review.comment || "No comment provided."}</p>
        ) : (
          <div className="edit-review-content">
            <textarea
              value={editComment}
              onChange={(e) => setEditComment(e.target.value)}
              placeholder="Add your comments..."
              rows={3}
              maxLength={500}
            />
            <div className="edit-actions">
              <div className="char-counter">
                {editComment.length}/500 characters
              </div>
              <div className="edit-buttons">
                <button 
                  className="cancel-edit-btn" 
                  onClick={() => {
                    setIsEditing(false);
                    setEditRating(review.rating);
                    setEditComment(review.comment || "");
                  }}
                  disabled={updating}
                >
                  <FaTimes /> Cancel
                </button>
                <button 
                  className="save-edit-btn" 
                  onClick={handleUpdateReview}
                  disabled={updating}
                >
                  {updating ? "Saving..." : <><FaCheck /> Save</>}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {review.taskTitle && !isEditing && (
        <div className="review-task-info">
          <span>For task: </span>
          <span 
            className="task-link clickable" 
            onClick={() => review.taskId && navigate(`/task/${review.taskId}`)}
          >
            {review.taskTitle}
          </span>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;