package com.example.server.controller;

import com.example.server.exceptions.ResourceNotFoundException;
import com.example.server.model.Notification;
import com.example.server.response.ApiResponse;
import com.example.server.security.user.ShopUserDetails;
import com.example.server.service.notification.INotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@RestController
@RequestMapping("${api.prefix}/notifications")
@RequiredArgsConstructor
public class NotificationController {
    private final INotificationService notificationService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse> getMyNotifications(@AuthenticationPrincipal ShopUserDetails userDetails) {
        try {
            List<Notification> notifications = notificationService.getUserNotifications(userDetails.getId());
            return ResponseEntity.ok(new ApiResponse("Notifications retrieved successfully", true, notifications));
        } catch (Exception e) {
            return ResponseEntity.status(INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(e.getMessage(), false, null));
        }
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse> markAsRead(@PathVariable Long id) {
        try {
            Notification notification = notificationService.markAsRead(id);
            return ResponseEntity.ok(new ApiResponse("Notification marked as read", true, notification));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND)
                    .body(new ApiResponse(e.getMessage(), false, null));
        } catch (Exception e) {
            return ResponseEntity.status(INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(e.getMessage(), false, null));
        }
    }
}