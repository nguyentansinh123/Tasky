package com.example.server.service.notification;

import com.example.server.enums.NotificationType;
import com.example.server.exceptions.ResourceNotFoundException;
import com.example.server.model.Notification;
import com.example.server.model.Task;
import com.example.server.model.User;
import com.example.server.repository.NotificationRepository;
import com.example.server.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService implements INotificationService {
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Override
    public void notifyNewTask(Task task) {
        List<User> users = userRepository.findAll().stream()
                .filter(user -> !user.getId().equals(task.getUploaduser().getId()))
                .toList();

        for (User user : users) {
            Notification notification = new Notification();
            notification.setMessage("New task '" + task.getTaskName() + "' has been posted");
            notification.setType(NotificationType.TASK_CREATED);
            notification.setRead(false);
            notification.setUser(user);
            notification.setTask(task);

            notificationRepository.save(notification);

            messagingTemplate.convertAndSendToUser(
                    user.getEmail(),
                    "/queue/notifications",
                    notification
            );
        }
    }

    @Override
    public void notifyTaskAccepted(Task task, User acceptedUser) {
        User uploader = task.getUploaduser();

        Notification notification = new Notification();
        notification.setMessage("Your task '" + task.getTaskName() + "' has been accepted by " +
                acceptedUser.getFirstName() + " " + acceptedUser.getLastName());
        notification.setType(NotificationType.TASK_ACCEPTED);
        notification.setRead(false);
        notification.setUser(uploader);
        notification.setTask(task);

        notificationRepository.save(notification);

        messagingTemplate.convertAndSendToUser(
                uploader.getEmail(),
                "/queue/notifications",
                notification
        );
    }

    @Override
    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Override
    public Notification markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + notificationId));

        notification.setRead(true);
        return notificationRepository.save(notification);
    }
}