package com.gotchabug.moneymate.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI moneyMateOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("MoneyMate API")
                        .description("로보어드바이저 기반 자산관리 플랫폼 API")
                        .version("v1"));
    }

    @Bean
    public GroupedOpenApi moneyMateApiGroup() {
        return GroupedOpenApi.builder()
                .group("MoneyMate")
                .pathsToMatch("/api/**")
                .build();
    }
}
