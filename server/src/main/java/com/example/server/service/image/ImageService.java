package com.example.server.service.image;

import com.example.server.exceptions.ResourceNotFoundException;
import com.example.server.model.Image;
import com.example.server.model.Task;
import com.example.server.model.User;
import com.example.server.repository.ImageRepository;
import com.example.server.repository.UserRepository;
import com.example.server.service.task.ITaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.sql.rowset.serial.SerialBlob;
import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
@Service
public class ImageService implements IImageService{

    @Autowired
    private ImageRepository imageRepository;
    @Autowired
    @Lazy
    private ITaskService taskService;

    @Autowired
    private UserRepository userRepository;

    @Override
    public Image getImageById(long id) {
        return imageRepository.findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("Image not found with id " + id));
    }

    @Override
    public void deleteImageById(long id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        User authenticatedUser = userRepository.findByEmail(email);
        if (authenticatedUser == null) {
            throw new ResourceNotFoundException("Authenticated user not found with email: " + email);
        }

        Image image = getImageById(id);
        if (!image.getTask().getUploaduser().getId().equals(authenticatedUser.getId())) {
            throw new IllegalArgumentException("You are not authorized to delete this image");
        }

        imageRepository.delete(image);
    }

    @Override
    public List<Image> saveImages(List<MultipartFile> files, Long taskId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        User authenticatedUser = userRepository.findByEmail(email);
        if (authenticatedUser == null) {
            throw new ResourceNotFoundException("Authenticated user not found with email: " + email);
        }

        Task task = taskService.getTaskById(taskId);
        if (!task.getUploaduser().getId().equals(authenticatedUser.getId())) {
            throw new IllegalArgumentException("You are not authorized to upload images to this task");
        }

        List<Image> savedImage = new ArrayList<>();
        for (MultipartFile file : files) {
            try {
                Image image = new Image();
                image.setFileName(file.getOriginalFilename());
                image.setFileType(file.getContentType());
                image.setImage(new SerialBlob(file.getBytes()));
                image.setTask(task);

                String buildDownloadUrl = "/api/v1/images/image/download/";
                Image savedImageEntity = imageRepository.save(image);

                savedImageEntity.setDownloadUrl(buildDownloadUrl + savedImageEntity.getId());
                imageRepository.save(savedImageEntity);

                Image imageToBeSaved = new Image();
                imageToBeSaved.setId(savedImageEntity.getId());
                imageToBeSaved.setFileName(savedImageEntity.getFileName());
                imageToBeSaved.setDownloadUrl(savedImageEntity.getDownloadUrl());
                imageToBeSaved.setFileType(savedImageEntity.getFileType());

                savedImage.add(imageToBeSaved);
            } catch (IOException | SQLException e) {
                throw new ResourceNotFoundException(e.getMessage());
            }
        }
        return savedImage;
    }

    @Override
    public void updateImage(MultipartFile file, Long imageId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        User authenticatedUser = userRepository.findByEmail(email);
        if (authenticatedUser == null) {
            throw new ResourceNotFoundException("Authenticated user not found with email: " + email);
        }

        Image image = getImageById(imageId);
        if (!image.getTask().getUploaduser().getId().equals(authenticatedUser.getId())) {
            throw new IllegalArgumentException("You are not authorized to update this image");
        }

        try {
            image.setFileName(file.getOriginalFilename());
            image.setFileType(file.getContentType());
            image.setImage(new SerialBlob(file.getBytes()));
            imageRepository.save(image);
        } catch (IOException | SQLException e) {
            throw new RuntimeException(e.getMessage());
        }
    }
}
