package com.example.sociallogin;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"org.springframework.ai", "com.example.sociallogin"})
public class SocialLoginApplication {
    public static void main(String[] args) {
        SpringApplication.run(SocialLoginApplication.class, args);
    }
}