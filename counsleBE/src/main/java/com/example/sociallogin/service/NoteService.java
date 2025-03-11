package com.example.sociallogin.service;

import com.example.sociallogin.domain.Note;
import com.example.sociallogin.dto.NoteDTO;
import com.example.sociallogin.repository.NoteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class NoteService {

    private final NoteRepository noteRepository;
    private final ChatbotService chatbotService; // AI 요약 기능을 위해 사용

    public NoteDTO saveNote(NoteDTO noteDTO, String counselorId) {
        log.info("Saving note for client: {}, date: {}", noteDTO.getClientId(), noteDTO.getDate());

        Note note = noteDTO.toEntity();
        note.setCounselorId(counselorId);

        // AI 요약이 없는 경우 생성
        if (note.getSummary() == null || note.getSummary().isEmpty()) {
            try {
                String summary = generateNoteSummary(note.getContent(), noteDTO.getClientId());
                note.setSummary(summary);
            } catch (Exception e) {
                log.warn("Failed to generate note summary: {}", e.getMessage());
                // 실패해도 저장은 계속 진행
            }
        }

        Note savedNote = noteRepository.save(note);
        return NoteDTO.fromEntity(savedNote);
    }

    public List<String> getNotesByClientId(String clientId) {
        log.info("Getting note dates for client: {}", clientId);
        return noteRepository.findDatesByClientId(clientId);
    }

    public NoteDTO getNoteByClientIdAndDate(String clientId, String dateStr) {
        LocalDate date = LocalDate.parse(dateStr);
        log.info("Getting note for client: {}, date: {}", clientId, date);

        return noteRepository.findByClientIdAndDate(clientId, date)
                .map(NoteDTO::fromEntity)
                .orElse(null);
    }

    public boolean syncNotesToSpreadsheet() {
        log.info("Starting sync of notes to spreadsheet");
        // 실제 구현은 Google Sheets API와 연동 필요
        // TODO: Google Sheets 연동 구현
        return true;
    }

    private String generateNoteSummary(String content, String clientId) {
        // AI로 메모 내용 요약 생성
        // 여기서는 ChatbotService를 활용하는 방식으로 구현 예시
        return chatbotService.generateSummary(content, clientId);
    }
}