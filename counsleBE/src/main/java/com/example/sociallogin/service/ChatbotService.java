package com.example.sociallogin.service;

import com.example.sociallogin.domain.ChatMessage;
import com.example.sociallogin.repository.ChatRepository;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatbotService {

    private final ChatRepository chatRepository;
    private final ChatClient.Builder chatClientBuilder;

    @Value("${openai.max-tokens:1000}")
    private Integer maxTokens;

    public ChatMessage processUserMessage(String userId, String content) {
        // 사용자 메시지 저장
        ChatMessage userMessage = ChatMessage.builder()
                .userId(userId)
                .content(content)
                .sender("USER")
                .timestamp(LocalDateTime.now())
                .build();
        chatRepository.save(userMessage);

        // 이전 대화 기록 로드 (최대 10개)
        List<ChatMessage> chatHistory = chatRepository.findRecentChatsByUserId(userId, 10);

        // Spring AI 요청 준비
        List<Message> messages = new ArrayList<>();
        messages.add(new SystemMessage("You are a helpful assistant."));

        // 이전 대화 기록 추가
        for (ChatMessage msg : chatHistory) {
            if (msg.getSender().equals("USER")) {
                messages.add(new UserMessage(msg.getContent()));
            } else {
                messages.add(new AssistantMessage(msg.getContent()));
            }
        }

        // 현재 메시지 추가
        messages.add(new UserMessage(content));

        // Spring AI API 호출
        ChatClient chatClient = chatClientBuilder.build();
        String botResponse = chatClient.prompt()
                .messages(messages)
                .call()
                .chatResponse()
                .getResult()
                .getOutput()
                .getText();

        // 봇 응답 저장
        ChatMessage botMessage = ChatMessage.builder()
                .userId(userId)
                .content(botResponse)
                .sender("BOT")
                .timestamp(LocalDateTime.now())
                .build();
        chatRepository.save(botMessage);

        return botMessage;
    }
}