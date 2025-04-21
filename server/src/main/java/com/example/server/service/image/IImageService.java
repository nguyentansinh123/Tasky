package com.example.server.service.image;

import com.example.server.model.Image;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface IImageService {
    Image getImageById(long id);
    void deleteImageById(long id);
    List<Image> saveImages(List<MultipartFile> files, Long taskId);
    void updateImage(MultipartFile file, Long imageId);
}
