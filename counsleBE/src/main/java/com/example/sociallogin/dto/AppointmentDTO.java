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
    private String date; // ISO 형식의 날짜 문자열 (YYYY-MM-DD)
    private String startTime; // HH:MM 형식
    private String endTime; // HH:MM 형식
    private String status;
    private String notes;
    private String serviceType;
    private String sessionDuration; // 추가: 세션 시간 (예: "20분", "30분")
    private Boolean isCompleted; // 추가: 상담 완료 여부
    private Boolean isNoteCompleted; // 추가: 메모 완료 여부
    private Boolean isPaid; // 추가: 결제 완료 여부
    private String amount; // 추가: 결제 금액

    // Entity에서 DTO로 변환
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
                .serviceType(appointment.getServiceType())
                .build();

        // 상태 값에 따라 불리언 필드 설정
        dto.setIsCompleted("COMPLETED".equals(appointment.getStatus()));
        dto.setIsNoteCompleted(false); // 기본값, 메모 상태는 별도로 확인 필요
        dto.setIsPaid(false); // 기본값, 결제 상태는 별도로 확인 필요

        // 세션 시간 추출 (시작시간과 종료시간의 차이)
        LocalTime start = appointment.getStartTime();
        LocalTime end = appointment.getEndTime();
        int durationMinutes = (end.getHour() * 60 + end.getMinute()) -
                (start.getHour() * 60 + start.getMinute());

        dto.setSessionDuration(durationMinutes + "분");
        dto.setAmount("0"); // 기본값, 결제 정보는 별도로 조회 필요

        return dto;
    }

    // DTO에서 Entity로 변환
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
                .serviceType(this.serviceType)
                .createdAt(new Date())
                .updatedAt(new Date())
                .build();
    }
}