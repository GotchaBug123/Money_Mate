package com.gotchabug.moneymate.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class CommunityFileConfig implements WebMvcConfigurer {

    @Value("${moneymate.community.upload-dir:uploads/community}")
    private String uploadDir;

    @Value("${moneymate.community.upload-url-prefix:/uploads/community}")
    private String uploadUrlPrefix;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path uploadPath = Paths.get(uploadDir)
                .toAbsolutePath()
                .normalize();

        registry.addResourceHandler(normalizeUrlPrefix() + "/**")
                .addResourceLocations(uploadPath.toUri().toString());
    }

    private String normalizeUrlPrefix() {
        String prefix = uploadUrlPrefix == null
                ? "/uploads/community"
                : uploadUrlPrefix.trim();

        if (!prefix.startsWith("/")) {
            prefix = "/" + prefix;
        }

        if (prefix.endsWith("/")) {
            return prefix.substring(0, prefix.length() - 1);
        }

        return prefix;
    }
}
