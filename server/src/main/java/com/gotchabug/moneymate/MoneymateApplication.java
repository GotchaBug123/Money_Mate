package com.gotchabug.moneymate;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class MoneymateApplication {

    public static void main(String[] args) {
        SpringApplication.run(MoneymateApplication.class, args);
    }

}
