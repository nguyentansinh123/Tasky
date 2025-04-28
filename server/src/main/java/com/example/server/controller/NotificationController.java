package com.example.server.controller;

import com.example.server.exceptions.ResourceNotFoundException;
import com.example.server.model.Notification;
import com.example.server.model.User;
import com.example.server.repository.UserRepository;
import com.example.server.response.ApiResponse;
import com.example.server.security.user.ShopUserDetails;
import com.example.server.service.notification.INotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@RestController
@RequestMapping("${api.prefix}/notifications")
@RequiredArgsConstructor
public class NotificationController {
    private final INotificationService notificationService;
    private final UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse> getMyNotifications(@AuthenticationPrincipal ShopUserDetails userDetails) {
        try {
            if (userDetails == null) {
                // Try to get authentication from SecurityContextHolder
                Authentication auth = SecurityContextHolder.getContext().getAuthentication();

                if (auth != null && auth.isAuthenticated() && !auth.getPrincipal().equals("anonymousUser")) {
                    // Try to find user by email
                    String email = auth.getName();
                    User user = userRepository.findByEmail(email);

                    if (user != null) {
                        List<Notification> notifications = notificationService.getUserNotifications(user.getId());
                        return ResponseEntity.ok(new ApiResponse("Notifications retrieved successfully", true, notifications));
                    }
                }

                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ApiResponse("User not authenticated", false, null));
            }

            List<Notification> notifications = notificationService.getUserNotifications(userDetails.getId());
            return ResponseEntity.ok(new ApiResponse("Notifications retrieved successfully", true, notifications));
        } catch (Exception e) {
            e.printStackTrace(); // Add this to see the actual error in logs
            return ResponseEntity.status(INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(e.getMessage(), false, null));
        }
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse> markAsRead(@AuthenticationPrincipal ShopUserDetails userDetails, @PathVariable Long id) {
        try {
            // Similar authentication check as above
            if (userDetails == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ApiResponse("User not authenticated", false, null));
            }

            Notification notification = notificationService.markAsRead(id);
            return ResponseEntity.ok(new ApiResponse("Notification marked as read", true, notification));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND)
                    .body(new ApiResponse(e.getMessage(), false, null));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(e.getMessage(), false, null));
        }
    }

}