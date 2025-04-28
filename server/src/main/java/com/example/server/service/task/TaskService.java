package com.example.server.service.task;

import com.example.server.dto.TaskDto;
import com.example.server.exceptions.ResourceNotFoundException;
import com.example.server.model.Category;
import com.example.server.model.Task;
import com.example.server.model.User;
import com.example.server.repository.CategoryRepository;
import com.example.server.repository.NotificationRepository;
import com.example.server.repository.TaskRepository;
import com.example.server.repository.UserRepository;
import com.example.server.request.AddTaskRequest;
import com.example.server.request.UpdateTaskRequest;
import com.example.server.service.image.IImageService;
import com.example.server.service.notification.INotificationService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service

public class TaskService implements ITaskService {

    @Autowired
    private TaskRepository taskRepository;
    @Autowired
    private CategoryRepository categoryRepository;
    @Lazy
    @Autowired
    private IImageService imageService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private INotificationService notificationService;



    public Task addTask(AddTaskRequest request, List<MultipartFile> images) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        System.out.println("The Email is"+ email);
        User uploadUser = userRepository.findByEmail(email);
        if (uploadUser == null) {
            throw new ResourceNotFoundException("User not found with email: " + email);
        }

        Category category = Optional.ofNullable(categoryRepository.findByName(request.getCategory().getName()))
                .orElseGet(() -> {
                    Category newCategory = new Category(request.getCategory().getName());
                    return categoryRepository.save(newCategory);
                });
        request.setCategory(category);

        Task task = createTask(request, category);
        task.setUploaduser(uploadUser);
        task = taskRepository.save(task);

        if (images != null && !images.isEmpty()) {
            imageService.saveImages(images, task.getId());
        }

        // Send notification to all users about the new task
        notificationService.notifyNewTask(task);

        return task;
    }

    private Task createTask (AddTaskRequest addTaskRequest, Category category) {
        return new Task(
                addTaskRequest.getTaskName(),
                addTaskRequest.isFlexibleDate(),
                addTaskRequest.getDescription(),
                addTaskRequest.getLocation(),
                addTaskRequest.getStatus(),
                addTaskRequest.getTaskDate(),
                addTaskRequest.getDueDate(),
                addTaskRequest.getBudget(),
                category
        );
    }

    @Override
    public Task getTaskById(Long id) {
        return taskRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Task not found"));
    }

    @Override
    public void deleteTaskById(Long id) {
        taskRepository.findById(id).ifPresentOrElse(taskRepository::delete,
                ()->{
                    throw new ResourceNotFoundException("Task not found with id " + id);
                });
    }

    @Override
    public Task updateTask(UpdateTaskRequest request, Long taskId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        // Fetch the authenticated user
        User authenticatedUser = userRepository.findByEmail(email);
        if (authenticatedUser == null) {
            throw new ResourceNotFoundException("Authenticated user not found with email: " + email);
        }

        // Fetch the task and validate ownership
        Task existingTask = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id " + taskId));

        if (!existingTask.getUploaduser().getId().equals(authenticatedUser.getId())) {
            throw new IllegalArgumentException("You are not authorized to update this task");
        }

        // Update task details and save
        updateTaskDetails(request, existingTask);
        return taskRepository.save(existingTask);
    }

    private void updateTaskDetails(UpdateTaskRequest request, Task existingTask) {
        if (request.getTaskName() != null) {
            existingTask.setTaskName(request.getTaskName());
        }
        existingTask.setFlexibleDate(request.isFlexibleDate());
        if (request.getDescription() != null) {
            existingTask.setDescription(request.getDescription());
        }
        if (request.getLocation() != null) {
            existingTask.setLocation(request.getLocation());
        }
        if (request.getStatus() != null) {
            existingTask.setStatus(request.getStatus());
        }
        if (request.getTaskDate() != null) {
            existingTask.setTaskDate(request.getTaskDate());
        }
        if (request.getDueDate() != null) {
            existingTask.setDueDate(request.getDueDate());
        }
        if (request.getBudget() != null) {
            existingTask.setBudget(request.getBudget());
        }
        if (request.getAcceptedUserId() != null) {
            User acceptedUser = userRepository.findById(request.getAcceptedUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("Accepted user not found with id: " + request.getAcceptedUserId()));
            existingTask.setAcceptedUser(acceptedUser);
        }
    }

    @Override
    public Task acceptTask(Long taskId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new ResourceNotFoundException("User not found with email: " + email);
        }

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        if (task.getAcceptedUser() != null) {
            throw new IllegalStateException("This task has already been accepted by another user");
        }

        if (task.getUploaduser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("You cannot accept your own task");
        }
        task.setAcceptedUser(user);

        Task savedTask = taskRepository.save(task);

        notificationService.notifyTaskAccepted(savedTask, user);

        return savedTask;
    }


    @Override
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    @Override
    public List<Task> getTasksByDueDate(LocalDateTime dueDate) {
        return taskRepository.findByDueDate(dueDate);
    }

    @Override
    public List<Task> getTasksByTaskDate(LocalDateTime taskDate) {
        return taskRepository.findByTaskDate(taskDate);
    }

    @Override
    public List<Task> getTasksByBudget(BigDecimal budget) {
        return taskRepository.findByBudget(budget);
    }

    @Override
    public List<Task> getTasksByCategory(String category) {
        return taskRepository.findByCategoryName(category);
    }

    @Override
    public List<Task> getTasksByFlexibleDate(boolean flexibleDate) {
        return taskRepository.findByFlexibleDate(flexibleDate);
    }

    @Override
    public List<Task> getTasksByLocation(String location) {
        return taskRepository.findByLocation(location);
    }

    @Override
    public List<Task> getTasksByCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new ResourceNotFoundException("User not found with email: " + email);
        }

        return taskRepository.findByUploaduserId(user.getId());
    }


    @Override
    public TaskDto convertTaskToDto(Task task) {
        return modelMapper.map(task, TaskDto.class);
    }
}
