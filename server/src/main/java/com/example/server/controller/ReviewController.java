package com.example.server.controller;

import com.example.server.dto.ReviewDto;
import com.example.server.model.Review;
import com.example.server.response.ApiResponse;
import com.example.server.service.review.IReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final IReviewService reviewService;

    @PostMapping("/add")
    public ResponseEntity<ApiResponse> createReview(
            @RequestParam Long reviewedUserId,
            @RequestParam int starRating,
            @RequestParam String comments) {
        Review review = reviewService.createReview(reviewedUserId, starRating, comments);
        ReviewDto reviewDto = reviewService.convertReviewToDto(review);
        return ResponseEntity.ok(new ApiResponse("Review created successfully", true, reviewDto));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse> getReviewsByUserId(@PathVariable Long userId) {
        List<Review> reviews = reviewService.getReviewsByUserId(userId);
        List<ReviewDto> reviewDtos = reviews.stream()
                .map(reviewService::convertReviewToDto)
                .toList();
        return ResponseEntity.ok(new ApiResponse("Reviews retrieved successfully", true, reviewDtos));
    }

    @PutMapping("/{reviewId}")
    public ResponseEntity<ApiResponse> updateReview(
            @PathVariable Long reviewId,
            @RequestParam int starRating,
            @RequestParam String comments) {
        Review updatedReview = reviewService.updateReview(reviewId, starRating, comments);
        ReviewDto reviewDto = reviewService.convertReviewToDto(updatedReview);
        return ResponseEntity.ok(new ApiResponse("Review updated successfully", true, reviewDto));
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<ApiResponse> deleteReview(@PathVariable Long reviewId) {
        reviewService.deleteReview(reviewId);
        return ResponseEntity.ok(new ApiResponse("Review deleted successfully", true, null));
    }
}
