package edu.cit.fitflow.config;

import org.springframework.context.annotation.Configuration;

import jakarta.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import java.io.File;
import java.util.Arrays;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class FileStorageConfig {
    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    @Value("${file.max-size:5242880}") // 5MB default
    private long maxFileSize;
    
    @Value("${file.allowed-types:image/jpeg,image/png,image/gif}")
    private String[] allowedTypes;

    @Bean
    public File createUploadDirectory() {
        File dir = new File(uploadDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }
        System.out.println("Upload directory initialized at: " + dir.getAbsolutePath());
        return dir;
    }
    
    public String getUploadDir() {
      return uploadDir;
    }

    public boolean isValidFileType(String contentType) {
      return Arrays.asList(allowedTypes).contains(contentType);
    }

    public long getMaxFileSize() {
      return maxFileSize;
  }
}