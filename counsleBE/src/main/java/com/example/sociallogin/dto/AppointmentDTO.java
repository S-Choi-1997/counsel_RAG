package com.example.sociallogin.dto;

import com.example.sociallogin.domain.Appointment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentDTO {
    private String id;
    private String clientId;
    private String clientName;
    private String counselorId;
    private String counselorName;
    private String date; // ISO 형식 (YYYY-MM-DD)
    private String startTime; // HH:MM 형식
    private String endTime; // HH:MM 형식

    // status에서 isCompleted로 변환되는 필드
    private String status; // "PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"
    private Boolean isCompleted; // status가 "COMPLETED"인 경우 true

    private String notes;

    // serviceType → sessionType으로 변경 (프론트엔드 네이밍 반영)
    private String sessionType; // "카톡상담", "전화상담" 등
    private String sessionDuration; // "20분", "30분" 등

    private Boolean isNoteCompleted; // 메모 완료 여부
    private Boolean isPaid; // 결제 완료 여부
    private String amount; // 결제 금액

    // 프론트엔드에서 필요한 history 필드 추가
    private String history; // 이전 상담 정보 요약

    // Entity에서 DTO로 변환 메서드 업데이트
    public static AppointmentDTO fromEntity(Appointment appointment) {
        AppointmentDTO dto = AppointmentDTO.builder()
                .id(appointment.getId())
                .clientId(appointment.getClientId())
                .clientName(appointment.getClientName())
                .counselorId(appointment.getCounselorId())
                .counselorName(appointment.getCounselorName())
                .date(appointment.getDate().toString())
                .startTime(appointment.getStartTime().toString())
                .endTime(appointment.getEndTime().toString())
                .status(appointment.getStatus())
                .notes(appointment.getNotes())
                .sessionType(appointment.getServiceType()) // serviceType → sessionType 매핑
                .build();

        // 상태 값에 따라 불리언 필드 설정
        dto.setIsCompleted("COMPLETED".equals(appointment.getStatus()));

        // 세션 시간 계산
        LocalTime start = appointment.getStartTime();
        LocalTime end = appointment.getEndTime();
        int durationMinutes = (end.getHour() * 60 + end.getMinute()) -
                (start.getHour() * 60 + start.getMinute());
        dto.setSessionDuration(durationMinutes + "분");

        // 기본값 설정
        dto.setIsNoteCompleted(false);
        dto.setIsPaid(false);
        dto.setAmount("0");
        dto.setHistory("");

        return dto;
    }

    // DTO에서 Entity로 변환 메서드 업데이트
    public Appointment toEntity() {
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");

        return Appointment.builder()
                .id(this.id)
                .clientId(this.clientId)
                .clientName(this.clientName)
                .counselorId(this.counselorId)
                .counselorName(this.counselorName)
                .date(LocalDate.parse(this.date))
                .startTime(LocalTime.parse(this.startTime, timeFormatter))
                .endTime(LocalTime.parse(this.endTime, timeFormatter))
                .status(this.status)
                .notes(this.notes)
                .serviceType(this.sessionType) // sessionType → serviceType 매핑
                .createdAt(new Date())
                .updatedAt(new Date())
                .build();
    }
}