package com.example.server.service.review;

import com.example.server.dto.ReviewDto;
import com.example.server.model.Review;
import com.example.server.model.User;
import com.example.server.repository.ReviewRepository;
import com.example.server.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.context.SecurityContextHolder;
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
    public Review createReview(Long reviewedUserId, int starRating, String comments) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        User reviewer = userRepository.findByEmail(email);
        if (reviewer == null) {
            throw new IllegalArgumentException("Authenticated user not found with email: " + email);
        }

        Optional<User> reviewedUser = userRepository.findById(reviewedUserId);
        if (reviewedUser.isEmpty()) {
            throw new IllegalArgumentException("Reviewed User not found");
        }

        Review review = new Review();
        review.setReviewer(reviewer);
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
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        User authenticatedUser = userRepository.findByEmail(email);
        if (authenticatedUser == null) {
            throw new IllegalArgumentException("Authenticated user not found with email: " + email);
        }

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("Review not found"));

        if (!review.getReviewer().getId().equals(authenticatedUser.getId())) {
            throw new IllegalArgumentException("You are not authorized to delete this review");
        }

        reviewRepository.deleteById(reviewId);
    }

    @Override
    public Review updateReview(Long reviewId, int starRating, String comments) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        User authenticatedUser = userRepository.findByEmail(email);
        if (authenticatedUser == null) {
            throw new IllegalArgumentException("Authenticated user not found with email: " + email);
        }

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("Review not found"));

        if (!review.getReviewer().getId().equals(authenticatedUser.getId())) {
            throw new IllegalArgumentException("You are not authorized to update this review");
        }

        review.setStarRating(starRating);
        review.setComments(comments);

        return reviewRepository.save(review);
    }

    @Override
    public ReviewDto convertReviewToDto(Review review) {
        return modelMapper.map(review, ReviewDto.class);
    }
}
