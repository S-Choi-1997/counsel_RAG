package com.example.sociallogin.controller;

import com.example.sociallogin.domain.ChatMessage;
import com.example.sociallogin.dto.ChatMessageDTO;
import com.example.sociallogin.security.CurrentUser;
import com.example.sociallogin.security.CustomUserDetails;
import com.example.sociallogin.service.ChatbotService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatbotController {

    private final ChatbotService chatbotService;

    @PostMapping("/send")
    public ResponseEntity<ChatMessageDTO> sendMessage(
            @RequestBody ChatMessageDTO requestMessage,
            @CurrentUser CustomUserDetails userDetails) {

        ChatMessage response = chatbotService.processUserMessage(
                userDetails.getId(),
                requestMessage.getContent()
        );

        ChatMessageDTO responseDTO = ChatMessageDTO.builder()
                .id(response.getId())
                .content(response.getContent())
                .sender(response.getSender())
                .timestamp(response.getTimestamp())
                .build();

        return ResponseEntity.ok(responseDTO);
    }
}