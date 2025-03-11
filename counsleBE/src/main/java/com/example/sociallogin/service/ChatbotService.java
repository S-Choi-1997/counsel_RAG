package com.example.sociallogin.service;

import com.example.sociallogin.domain.ChatMessage;
import com.example.sociallogin.domain.Note;
import com.example.sociallogin.repository.ChatRepository;
import com.example.sociallogin.repository.NoteRepository;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatbotService {

    private final ChatRepository chatRepository;
    private final NoteRepository noteRepository;
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

    // 추가: 메모 요약 생성 기능
    public String generateSummary(String content, String clientId) {
        log.info("Generating summary for client: {}", clientId);

        List<Message> messages = new ArrayList<>();

        // 요약 생성을 위한 프롬프트
        String prompt = "아래 상담 메모를 요약해서 핵심 포인트 3-5개로 정리해주세요. 문장은 간결하게 작성하고 각 포인트는 '-' 로 시작하게 해주세요:\n\n" + content;

        messages.add(new SystemMessage("You are a counseling assistant who summarizes therapy notes in Korean. Be concise and objective."));
        messages.add(new UserMessage(prompt));

        try {
            // Spring AI API 호출
            ChatClient chatClient = chatClientBuilder.build();
            String summary = chatClient.prompt()
                    .messages(messages)
                    .call()
                    .chatResponse()
                    .getResult()
                    .getOutput()
                    .getText();

            return summary;
        } catch (Exception e) {
            log.error("Error generating summary: {}", e.getMessage());
            return "요약 생성에 실패했습니다.";
        }
    }

    // 추가: 상담 기록 요약 함수
    public String summarizeNote(String noteContent, String clientName) {
        log.info("Summarizing note for client: {}", clientName);

        List<Message> messages = new ArrayList<>();

        String prompt = String.format(
                "다음은 %s님의 상담 기록입니다. 이 내용을 요약하고 주요 감정, 문제점, 진전 상황을 정리해주세요:\n\n%s",
                clientName, noteContent
        );

        messages.add(new SystemMessage("You are a counseling assistant who summarizes therapy notes in Korean."));
        messages.add(new UserMessage(prompt));

        try {
            // Spring AI API 호출
            ChatClient chatClient = chatClientBuilder.build();
            String summary = chatClient.prompt()
                    .messages(messages)
                    .call()
                    .chatResponse()
                    .getResult()
                    .getOutput()
                    .getText();

            return summary;
        } catch (Exception e) {
            log.error("Error summarizing note: {}", e.getMessage());
            return "상담 기록 요약에 실패했습니다.";
        }
    }

    // 추가: 이전 세션 요약 조회
    public String getPreviousSessionSummary(String clientId) {
        log.info("Getting previous session summary for client: {}", clientId);

        // 이전 노트 조회
        List<Note> notes = noteRepository.findByClientId(clientId);

        if (notes.isEmpty()) {
            return "이전 상담 기록이 없습니다.";
        }

        // 가장 최근 노트를 제외한 이전 노트들 요약
        List<Note> previousNotes = notes.size() > 1 ? notes.subList(1, notes.size()) : new ArrayList<>();

        if (previousNotes.isEmpty()) {
            return "이전 상담 기록이 한 개만 있습니다.";
        }

        StringBuilder summaryBuilder = new StringBuilder();
        summaryBuilder.append("이전 상담 요약:\n\n");

        for (int i = 0; i < Math.min(3, previousNotes.size()); i++) {
            Note note = previousNotes.get(i);
            summaryBuilder.append("- ").append(note.getDate()).append(": ");

            // 요약이 있으면 사용, 없으면 내용 일부 사용
            if (note.getSummary() != null && !note.getSummary().isEmpty()) {
                summaryBuilder.append(note.getSummary());
            } else {
                String content = note.getContent();
                summaryBuilder.append(content.length() > 100
                        ? content.substring(0, 100) + "..."
                        : content);
            }

            summaryBuilder.append("\n\n");
        }

        return summaryBuilder.toString();
    }
}