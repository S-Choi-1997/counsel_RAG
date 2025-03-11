package com.example.sociallogin.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Date;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Statistics {
    private String id;
    private String counselorId;
    private String period; // DAILY, WEEKLY, MONTHLY, YEARLY
    private LocalDate startDate;
    private LocalDate endDate;
    private int totalClients;
    private int newClients;
    private int completedSessions;
    private BigDecimal revenue;
    private double retentionRate;
    private Map<String, Integer> sessionTypeBreakdown;
    private Map<String, Integer> timeSlotDistribution;
    private Date generatedAt;
}