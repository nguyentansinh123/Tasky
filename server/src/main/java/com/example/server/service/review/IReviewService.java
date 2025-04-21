package com.example.server.service.review;

import com.example.server.dto.ReviewDto;
import com.example.server.model.Review;

import java.util.List;

public interface IReviewService {
    Review createReview(Long reviewerId, Long reviewedUserId, int starRating, String comments);
    List<Review> getReviewsByUserId(Long userId);
    void deleteReview(Long reviewId);
    Review updateReview(Long reviewId, int starRating, String comments);

    ReviewDto convertReviewToDto(Review review);
}