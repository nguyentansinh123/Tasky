package com.example.server.service.image;

import com.example.server.exceptions.ResourceNotFoundException;
import com.example.server.model.Image;
import com.example.server.model.Task;
import com.example.server.repository.ImageRepository;
import com.example.server.service.task.ITaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
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

    @Override
    public Image getImageById(long id) {
        return imageRepository.findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("Image not found with id " + id));
    }

    @Override
    public void deleteImageById(long id) {
        imageRepository.findById(id).ifPresentOrElse(imageRepository::delete, () -> {
            throw new ResourceNotFoundException("Image not found with id " + id);
        });
    }

    @Override
    public List<Image> saveImages(List<MultipartFile> files, Long taskId) {
        Task task = taskService.getTaskById(taskId);
        List<Image> savedImage = new ArrayList<>();

        for (MultipartFile file : files) {
            try{
                Image image = new Image();
                image.setFileName(file.getOriginalFilename());
                image.setFileType(file.getContentType());
                System.out.println(file.getContentType());
                image.setImage(new SerialBlob(file.getBytes()));
                image.setTask(task);

                String buildDownloadUrl = "/api/v1/images/image/download/";
                String downloadUrl = buildDownloadUrl + image.getId();
                image.setDownloadUrl(downloadUrl);
                Image saveImage = imageRepository.save(image);

                saveImage.setDownloadUrl(buildDownloadUrl+ saveImage.getId());
                imageRepository.save(saveImage);

                Image imageToBeSaved = new Image();
                imageToBeSaved.setId(saveImage.getId());
                imageToBeSaved.setFileName(saveImage.getFileName());
                imageToBeSaved.setDownloadUrl(saveImage.getDownloadUrl());
                imageToBeSaved.setFileType(saveImage.getFileType());
//                imageToBeSaved.setImage(saveImage.getImage());

                savedImage.add(imageToBeSaved);

            }catch (IOException | SQLException e){
                throw new ResourceNotFoundException(e.getMessage());
            }
        }
        return savedImage;
    }

    @Override
    public void updateImage(MultipartFile file, Long imageId) {

        Image image = getImageById(imageId);
        try {
            image.setFileName(file.getOriginalFilename());
            image.setFileName(file.getOriginalFilename());
            image.setImage(new SerialBlob(file.getBytes()));
            imageRepository.save(image);
        } catch (IOException | SQLException e) {
            throw new RuntimeException(e.getMessage());
        }

    }
}
