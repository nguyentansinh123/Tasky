import React, { useState, useEffect } from 'react';
import ReviewCard from './ReviewCard';
import LeaveReviewForm from './LeaveReviewForm';
import { useAuthStore } from '../../store/useAuthStore';
import axios from 'axios';
import toast from 'react-hot-toast';
import ErrorBoundary from '../common/ErrorBoundary';
import './ReviewsSection.css';

const ReviewsSection = ({ reviews = [], title = "Reviews", userId, taskId, canReview = true }) => {
  const { authUser, getToken } = useAuthStore();
  const [visibleReviews, setVisibleReviews] = useState(3);
  const [localReviews, setLocalReviews] = useState(reviews);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [refreshKey, setRefreshKey] = useState(0);
  
  useEffect(() => {
    if (userId) {
      fetchUserReviews();
    } else {
      setLocalReviews(reviews);
    }
  }, [userId, reviews]);
  
  const fetchUserReviews = async () => {
    setLoading(true);
    try {
      const token = getToken();
      if (!token) {
        console.error("No auth token available");
        setLocalReviews(reviews);
        return;
      }
      
      const response = await axios.get(
        `http://localhost:9193/api/v1/reviews/user/${userId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.data && response.data.success) {
        console.log('Raw reviews from API:', response.data.data);
        
        response.data.data?.forEach((review, index) => {
          console.log(`Review ${index + 1} comment:`, review.comment || review.comments);
          console.log(`Review ${index + 1} rating:`, review.rating || review.starRating);
        });
        
        const safeReviews = (response.data.data || []).map(review => ({
          ...review,
          comment: review.comment || review.comments || "",
          rating: typeof review.rating === 'number' ? review.rating : 
                  typeof review.starRating === 'number' ? review.starRating : 0
        }));
        
        console.log('Processed reviews:', safeReviews);
        
        setLocalReviews(safeReviews);
        setRefreshKey(prev => prev + 1);
      } else {
        console.error("Failed to fetch reviews:", response.data);
        setLocalReviews(reviews);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to load reviews");
      setLocalReviews(reviews);
    } finally {
      setLoading(false);
    }
  };
  
  const loadMoreReviews = () => {
    setVisibleReviews(prev => prev + 5);
  };
  
  const handleReviewSubmitted = (newReview) => {
    setLocalReviews(prev => [newReview, ...prev]);
    setShowReviewForm(false);
    toast.success('Review submitted successfully');
    fetchUserReviews();
  };
  
  const hasSubmittedReview = authUser && localReviews.some(review => 
    review.reviewerId === authUser.id
  );
  
  const canLeaveReview = canReview && authUser && authUser.id !== userId && !hasSubmittedReview;
  
  return (
    <div className="reviews-section">
      <div className="reviews-header">
        <h3 className="reviews-title">
          {title} ({localReviews.length})
          {loading && <span className="loading-indicator"> Loading...</span>}
        </h3>
        
        {canLeaveReview && (
          <button 
            className="leave-review-btn"
            onClick={() => setShowReviewForm(!showReviewForm)}
          >
            {showReviewForm ? 'Cancel' : 'Leave a Review'}
          </button>
        )}
      </div>
      
      {showReviewForm && (
        <LeaveReviewForm 
          userId={userId}
          taskId={taskId}
          onReviewSubmitted={handleReviewSubmitted}
        />
      )}
      
      {hasSubmittedReview && !showReviewForm && (
        <div className="review-submitted-message">
          You've already submitted a review for this user.
        </div>
      )}
      
      {localReviews.length > 0 ? (
        <>
          <div className="reviews-list">
            {localReviews.slice(0, visibleReviews).map((review, index) => (
              <ErrorBoundary 
                key={`${review.id || index}-${refreshKey}`}
                fallback={
                  <div className="review-error">
                    <p>Failed to display this review. It may contain invalid data.</p>
                  </div>
                }
              >
                <ReviewCard 
                  review={review}
                  onUpdateReview={fetchUserReviews}
                  canEdit={authUser && review.reviewerId === authUser.id}
                />
              </ErrorBoundary>
            ))}
          </div>
          
          {visibleReviews < localReviews.length && (
            <button className="load-more-reviews" onClick={loadMoreReviews}>
              Load More Reviews
            </button>
          )}
        </>
      ) : (
        <div className="no-reviews">
          <p>{loading ? "Loading reviews..." : "No reviews yet"}</p>
        </div>
      )}
    </div>
  );
};

export default ReviewsSection;