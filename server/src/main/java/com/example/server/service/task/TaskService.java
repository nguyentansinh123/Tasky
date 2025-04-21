package com.example.server.service.task;

import com.example.server.dto.TaskDto;
import com.example.server.exceptions.ResourceNotFoundException;
import com.example.server.model.Category;
import com.example.server.model.Task;
import com.example.server.model.User;
import com.example.server.repository.CategoryRepository;
import com.example.server.repository.TaskRepository;
import com.example.server.repository.UserRepository;
import com.example.server.request.AddTaskRequest;
import com.example.server.request.UpdateTaskRequest;
import com.example.server.service.image.IImageService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
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


    @Override
    public Task addTask(AddTaskRequest request, List<MultipartFile> images) {
        Category category = Optional.ofNullable(categoryRepository.findByName(request.getCategory().getName()))
                .orElseGet(() -> {
                    Category newCategory = new Category(request.getCategory().getName());
                    return categoryRepository.save(newCategory);
                });
        request.setCategory(category);
        Task task = taskRepository.save(createTask(request, category));
        if (images != null && !images.isEmpty()) {
            imageService.saveImages(images, task.getId());
        }
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
        return taskRepository.findById(taskId)
                .map(existingTask -> updateTaskDetails(request, existingTask))
                .map(taskRepository :: save)
                .orElseThrow(()-> new ResourceNotFoundException("Task not found with id " + taskId));
    }

    @Override
    public Task acceptTask(Long taskId, Long userId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

//        if (task.getUploaduser().getId().equals(userId)) {
//            throw new ResourceNotFoundException("You cannot accept your own task");
//        }

        task.setAcceptedUser(user);

        return taskRepository.save(task);
    }

    private Task updateTaskDetails(UpdateTaskRequest request, Task existingTask) {
        if (request.getTaskName() != null) existingTask.setTaskName(request.getTaskName());
        existingTask.setFlexibleDate(request.isFlexibleDate());
        if (request.getDescription() != null) existingTask.setDescription(request.getDescription());
        if (request.getLocation() != null) existingTask.setLocation(request.getLocation());
        if (request.getStatus() != null) existingTask.setStatus(request.getStatus());
        if (request.getTaskDate() != null) existingTask.setTaskDate(request.getTaskDate());
        if (request.getDueDate() != null) existingTask.setDueDate(request.getDueDate());
        if (request.getBudget() != null) existingTask.setBudget(request.getBudget());
        if (request.getAcceptedUser() != null) existingTask.setAcceptedUser(request.getAcceptedUser());
        return existingTask;
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
    public TaskDto convertTaskToDto(Task task) {
        return modelMapper.map(task, TaskDto.class);
    }
}
