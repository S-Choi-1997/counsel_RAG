package com.example.sociallogin.controller;

import com.example.sociallogin.dto.UserDTO;
import com.example.sociallogin.security.CurrentUser;
import com.example.sociallogin.security.CustomUserDetails;
import groovy.util.logging.Slf4j;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@lombok.extern.slf4j.Slf4j
@Slf4j
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser(@CurrentUser CustomUserDetails userDetails) {
        log.debug(userDetails.getUsername());
        UserDTO userDTO = UserDTO.builder()
                .id(userDetails.getId())
                .name(userDetails.getName())
                .email(userDetails.getEmail())
                .imageUrl(userDetails.getImageUrl())
                .build();

        log.debug(userDTO.toString());

        return ResponseEntity.ok(userDTO);
    }
}