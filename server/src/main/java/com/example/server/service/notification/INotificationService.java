package com.example.server.service.notification;

import com.example.server.enums.NotificationType;
import com.example.server.model.Notification;
import com.example.server.model.Task;
import com.example.server.model.User;

import java.util.List;

public interface INotificationService {
    void notifyNewTask(Task task);
    void notifyTaskAccepted(Task task, User acceptedUser);
    List<Notification> getUserNotifications(Long userId);
    Notification markAsRead(Long notificationId);
}