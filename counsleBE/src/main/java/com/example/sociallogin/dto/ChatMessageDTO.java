package com.example.sociallogin.dto;

import com.example.sociallogin.domain.ChatMessage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageDTO {
    private String id;
    private String content;
    private String sender; // "AI" 또는 "USER"

    // ISO 문자열 형식의 timestamp 필드 추가
    private String timestamp;
    private LocalDateTime timestampDate;

    // 변환 메서드 추가
    public static ChatMessageDTO fromChatMessage(ChatMessage message) {
        String timestampStr = null;
        if (message.getTimestamp() != null) {
            timestampStr = message.getTimestamp().format(DateTimeFormatter.ISO_DATE_TIME);
        }

        return ChatMessageDTO.builder()
                .id(message.getId())
                .content(message.getContent())
                .sender(message.getSender())
                .timestamp(timestampStr)
                .timestampDate(message.getTimestamp())
                .build();
    }

    // LocalDateTime으로 변환하는 편의 메서드
    public LocalDateTime getTimestampAsLocalDateTime() {
        if (timestampDate != null) {
            return timestampDate;
        } else if (timestamp != null && !timestamp.isEmpty()) {
            return LocalDateTime.parse(timestamp, DateTimeFormatter.ISO_DATE_TIME);
        }
        return null;
    }
}