package com.example.sociallogin.controller;

import com.example.sociallogin.domain.ChatMessage;
import com.example.sociallogin.dto.ChatMessageDTO;
import com.example.sociallogin.security.CurrentUser;
import com.example.sociallogin.security.CustomUserDetails;
import com.example.sociallogin.service.ChatbotService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatbotController {

    private final ChatbotService chatbotService;

    @PostMapping("/send")
    public ResponseEntity<ChatMessageDTO> sendMessage(
            @RequestBody ChatMessageDTO requestMessage,
            @CurrentUser CustomUserDetails userDetails) {

        log.info("Processing message from user: {}", userDetails.getEmail());
        ChatMessage response = chatbotService.processUserMessage(
                userDetails.getId(),
                requestMessage.getContent()
        );

        // LocalDateTime을 String으로 변환
        String timestampStr = null;
        if (response.getTimestamp() != null) {
            timestampStr = response.getTimestamp().format(DateTimeFormatter.ISO_DATE_TIME);
        }

        ChatMessageDTO responseDTO = ChatMessageDTO.builder()
                .id(response.getId())
                .content(response.getContent())
                .sender(response.getSender())
                .timestamp(timestampStr)  // String 타입의 timestamp 필드에 변환된 문자열 할당
                .build();

        return ResponseEntity.ok(responseDTO);
    }

    // 추가: 메모 요약 API
    @PostMapping("/summarize")
    public ResponseEntity<Map<String, String>> summarizeNote(
            @RequestBody Map<String, String> request,
            @CurrentUser CustomUserDetails userDetails) {

        log.info("Summarizing note for user: {}", userDetails.getEmail());
        String content = request.get("content");
        String clientName = request.get("clientName");

        String summary = chatbotService.summarizeNote(content, clientName);

        return ResponseEntity.ok(Map.of("content", summary));
    }

    // 추가: 이전 세션 요약 API
    @GetMapping("/sessions/{clientId}/summary")
    public ResponseEntity<Map<String, String>> getPreviousSessionSummary(
            @PathVariable String clientId,
            @CurrentUser CustomUserDetails userDetails) {

        log.info("Getting previous session summary for client: {}, requested by: {}",
                clientId, userDetails.getEmail());

        String summary = chatbotService.getPreviousSessionSummary(clientId);

        return ResponseEntity.ok(Map.of("content", summary));
    }
}