package com.example.sociallogin.dto;

import com.example.sociallogin.domain.Note;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NoteDTO {
    private String id;
    private String clientId;
    private String counselorId;
    private String date; // ISO 형식 문자열 (YYYY-MM-DD)
    private String content;
    private String summary;

    // 선택적 필드 (프론트엔드에서 당장 사용하지 않지만 유지)
    private List<String> tags;
    private List<String> actionItems;

    // 프론트엔드 간소화를 위한 팩토리 메서드 추가
    public static NoteDTO createSimple(String clientId, String date, String content) {
        return NoteDTO.builder()
                .clientId(clientId)
                .date(date)
                .content(content)
                .tags(new ArrayList<>())
                .actionItems(new ArrayList<>())
                .build();
    }

    // Entity에서 DTO로 변환
    public static NoteDTO fromEntity(Note note) {
        return NoteDTO.builder()
                .id(note.getId())
                .clientId(note.getClientId())
                .counselorId(note.getCounselorId())
                .date(note.getDate().toString())
                .content(note.getContent())
                .summary(note.getSummary())
                .tags(note.getTags())
                .actionItems(note.getActionItems())
                .build();
    }

    // DTO에서 Entity로 변환
    public Note toEntity() {
        return Note.builder()
                .id(this.id)
                .clientId(this.clientId)
                .counselorId(this.counselorId)
                .date(LocalDate.parse(this.date))
                .content(this.content)
                .summary(this.summary)
                .tags(this.tags)
                .actionItems(this.actionItems)
                .createdAt(new Date())
                .updatedAt(new Date())
                .build();
    }
}