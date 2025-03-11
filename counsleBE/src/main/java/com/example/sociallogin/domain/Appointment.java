package com.example.sociallogin.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Appointment {
    private String id;
    private String clientId;
    private String clientName;
    private String counselorId; // 상담사 ID
    private String counselorName; // 상담사 이름
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private String status; // "PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"
    private String notes;
    private String serviceType;
    private Date createdAt;
    private Date updatedAt;
    private String googleCalendarEventId;
}