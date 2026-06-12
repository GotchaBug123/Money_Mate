package com.gotchabug.moneymate.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * 공통 빈 설정
 *
 * ObjectMapper에 JavaTimeModule 등록:
 *   LocalDateTime, LocalDate 등 Java 8 날짜 타입을 JSON으로 직렬화하기 위해 필요.
 *   등록하지 않으면 "Type definition error: LocalDateTime" 500 에러 발생.
 */
@Configuration
public class AppConfig implements WebMvcConfigurer {

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    @Bean
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();

        // Java 8 날짜/시간 타입 (LocalDateTime, LocalDate 등) 지원
        mapper.registerModule(new JavaTimeModule());

        // LocalDateTime을 타임스탬프(숫자) 대신 문자열("2026-05-28T20:11:22")로 직렬화
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

        return mapper;
    }

    /**
     * resources/js/ → URL /js/ 로 매핑
     * investment-info.js 등 JS 파일을 서빙하기 위해 추가
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/js/**")
                .addResourceLocations("classpath:/js/");
    }
}