package com.example.server.dto;

import lombok.Data;

@Data
public class ReviewDto {
    private Long id;
    private Long reviewerId;
    private String reviewerName;
    private Long reviewedUserId;
    private String reviewedUserName;
    private int starRating;
    private String comments;
}