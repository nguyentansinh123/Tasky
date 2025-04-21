package com.example.server.repository;

import com.example.server.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    @Query("SELECT r FROM Review r JOIN FETCH r.reviewer WHERE r.reviewedUser.id = :userId")
    List<Review> findReviewsWithReviewerByReviewedUserId(@Param("userId") Long userId);
}
