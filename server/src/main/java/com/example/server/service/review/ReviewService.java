package com.example.server.service.review;

import com.example.server.dto.ReviewDto;
import com.example.server.model.Review;
import com.example.server.model.User;
import com.example.server.repository.ReviewRepository;
import com.example.server.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReviewService implements IReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    @Override
    public Review createReview(Long reviewerId, Long reviewedUserId, int starRating, String comments) {
        Optional<User> reviewer = userRepository.findById(reviewerId);
        Optional<User> reviewedUser = userRepository.findById(reviewedUserId);

        if (reviewer.isEmpty() || reviewedUser.isEmpty()) {
            throw new IllegalArgumentException("Reviewer or Reviewed User not found");
        }

        Review review = new Review();
        review.setReviewer(reviewer.get());
        review.setReviewedUser(reviewedUser.get());
        review.setStarRating(starRating);
        review.setComments(comments);

        return reviewRepository.save(review);
    }

    @Override
    public List<Review> getReviewsByUserId(Long userId) {
        return reviewRepository.findReviewsWithReviewerByReviewedUserId(userId);
    }

    @Override
    public void deleteReview(Long reviewId) {
        if (!reviewRepository.existsById(reviewId)) {
            throw new IllegalArgumentException("Review not found");
        }
        reviewRepository.deleteById(reviewId);
    }

    @Override
    public Review updateReview(Long reviewId, int starRating, String comments) {
        Optional<Review> existingReview = reviewRepository.findById(reviewId);

        if (existingReview.isEmpty()) {
            throw new IllegalArgumentException("Review not found");
        }

        Review review = existingReview.get();
        review.setStarRating(starRating);
        review.setComments(comments);

        return reviewRepository.save(review);
    }

    @Override
    public ReviewDto convertReviewToDto(Review review) {
        return modelMapper.map(review, ReviewDto.class);
    }
}
