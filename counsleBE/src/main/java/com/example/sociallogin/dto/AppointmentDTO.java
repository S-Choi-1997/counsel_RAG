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

    // Entity에서 DTO로 변환
    public static AppointmentDTO fromEntity(Appointment appointment) {
        return AppointmentDTO.builder()
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