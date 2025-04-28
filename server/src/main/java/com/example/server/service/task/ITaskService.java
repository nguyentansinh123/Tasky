package com.example.server.service.task;

import com.example.server.dto.TaskDto;
import com.example.server.enums.TaskStatus;
import com.example.server.model.Task;
import com.example.server.request.AddTaskRequest;
import com.example.server.request.UpdateTaskRequest;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface ITaskService {
    Task addTask(AddTaskRequest request, List<MultipartFile> images);
    Task getTaskById(Long id);
    void deleteTaskById(Long id);
    Task updateTask(UpdateTaskRequest task, Long taskId);

    Task acceptTask(Long taskId);

    List<Task> getAllTasks();
    List<Task> getTasksByDueDate(LocalDateTime dueDate);
    List<Task> getTasksByTaskDate(LocalDateTime taskDate);
    List<Task> getTasksByBudget(BigDecimal budget);
    List<Task> getTasksByCategory(String category);
    List<Task> getTasksByFlexibleDate(boolean flexibleDate);
    List<Task> getTasksByLocation(String location);
    List<Task> getTasksByCurrentUser();

    TaskDto convertTaskToDto(Task task);

}
