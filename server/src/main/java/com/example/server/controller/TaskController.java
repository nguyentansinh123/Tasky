package com.example.server.controller;

import com.example.server.dto.TaskDto;
import com.example.server.exceptions.ResourceNotFoundException;
import com.example.server.model.Task;
import com.example.server.request.AddTaskRequest;
import com.example.server.request.UpdateTaskRequest;
import com.example.server.response.ApiResponse;
import com.example.server.service.task.ITaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.springframework.http.HttpStatus.*;

@RestController
@RequestMapping("${api.prefix}/tasks")
@RequiredArgsConstructor
public class TaskController {
    private final ITaskService taskService;

    @PreAuthorize("hasRole('CLIENT')")
    @PostMapping("/add")
    public ResponseEntity<ApiResponse> addTask(
            @RequestPart("task") AddTaskRequest request,
            @RequestPart("images") List<MultipartFile> images) {
        try {
            Task task = taskService.addTask(request, images);
            TaskDto taskDto = taskService.convertTaskToDto(task);
            return ResponseEntity.ok(new ApiResponse("Add Task Successful", true, taskDto));
        } catch (Exception e) {
            return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse(e.getMessage(), false, null));
        }
    }

    @PreAuthorize("hasRole('WORKER')")

    @PostMapping("/{taskId}/accept")
    public ResponseEntity<ApiResponse> UserAcceptTask(
            @PathVariable Long taskId) {
        try {
            Task acceptedTask = taskService.acceptTask(taskId);
            return ResponseEntity.ok(new ApiResponse("Task accepted successfully", true, acceptedTask));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), false, null));
        }catch (IllegalArgumentException e){
            return ResponseEntity.status(BAD_REQUEST).body(new ApiResponse(e.getMessage(), false, null));
        }catch (Exception e){
            return ResponseEntity.status(CONFLICT).body(new ApiResponse(e.getMessage(), false, null));
        }
    }

    @PreAuthorize("hasRole('CLIENT')")
    @PutMapping("/update/{id}")
    public ResponseEntity<ApiResponse> updateTheTask(@PathVariable Long id, @RequestBody UpdateTaskRequest request) {
        try {
            Task task = taskService.updateTask(request, id);
            return ResponseEntity.ok(new ApiResponse("Update Task Successful", true, task));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse(e.getMessage(), false, null));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(BAD_REQUEST).body(new ApiResponse(e.getMessage(), false, null));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getTask(@PathVariable Long id) {
        try {
            Task task = taskService.getTaskById(id);
            return ResponseEntity.ok(new ApiResponse("Get Task Successful", true, task));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse(e.getMessage(), false, null));
        }
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse> getAllTasks() {
        try {
            return ResponseEntity.ok(new ApiResponse("Get All Tasks Successful", true, taskService.getAllTasks()));
        } catch (Exception e) {
            return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse(e.getMessage(), false, null));
        }
    }

    @GetMapping("/by-due-date")
    public ResponseEntity<ApiResponse> getTasksByDueDate(@RequestParam LocalDateTime dueDate) {
        try {
            return ResponseEntity.ok(new ApiResponse("Get Tasks By Due Date Successful", true, taskService.getTasksByDueDate(dueDate)));
        } catch (Exception e) {
            return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse(e.getMessage(), false, null));
        }
    }

    @GetMapping("/by-task-date")
    public ResponseEntity<ApiResponse> getTasksByTaskDate(@RequestParam LocalDateTime dueDate) {
        try {
            return ResponseEntity.ok(new ApiResponse("Get Tasks By Task Date Successful", true, taskService.getTasksByTaskDate(dueDate)));
        } catch (Exception e) {
            return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse(e.getMessage(), false, null));
        }
    }
    @GetMapping("/by-budget")
    public ResponseEntity<ApiResponse> getTasksByBudget(@RequestParam BigDecimal budget) {
        try {
            return ResponseEntity.ok(new ApiResponse("Get Tasks By Budget Successful", true, taskService.getTasksByBudget(budget)));
        } catch (Exception e) {
            return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse(e.getMessage(), false, null));
        }
    }

    @GetMapping("/by-category")
    public ResponseEntity<ApiResponse> getTasksByCategory(@RequestParam String category) {
        try {
            return ResponseEntity.ok(new ApiResponse("Get Tasks By Category Successful", true, taskService.getTasksByCategory(category)));
        } catch (Exception e) {
            return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse(e.getMessage(), false, null));
        }
    }

    @GetMapping("/by-flexible-date")
    public ResponseEntity<ApiResponse> getTasksByFlexibleDate(@RequestParam boolean flexibleDate) {
        try {
            return ResponseEntity.ok(new ApiResponse("Get Tasks By Flexible Date Successful", true, taskService.getTasksByFlexibleDate(flexibleDate)));
        } catch (Exception e) {
            return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse(e.getMessage(), false, null));
        }
    }
    @GetMapping("/by-location")
    public ResponseEntity<ApiResponse> getTasksByLocation(@RequestParam String location) {
        try {
            return ResponseEntity.ok(new ApiResponse("Get Tasks By Location Successful", true, taskService.getTasksByLocation(location)));
        } catch (Exception e) {
            return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse(e.getMessage(), false, null));
        }
    }

    @PreAuthorize("hasRole('CLIENT')")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ApiResponse> deleteTask(@PathVariable Long id) {
        try {
            taskService.deleteTaskById(id);
            return ResponseEntity.ok(new ApiResponse("Delete Task Successful", true, null));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse(e.getMessage(), false, null));
        }
    }
}
