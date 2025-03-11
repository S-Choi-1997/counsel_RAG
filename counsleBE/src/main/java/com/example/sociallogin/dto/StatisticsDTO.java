package com.example.sociallogin.dto;

import com.example.sociallogin.domain.Statistics;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Date;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatisticsDTO {
    private String id;
    private String counselorId;
    private String period;
    private String startDate;
    private String endDate;
    private int totalClients;
    private int newClients;
    private int completedSessions;
    private String revenue;
    private String retention;
    private Map<String, Integer> sessionTypeBreakdown;
    private Map<String, Integer> timeSlotDistribution;
    private Date generatedAt;

    public static StatisticsDTO fromEntity(Statistics statistics) {
        return StatisticsDTO.builder()
                .id(statistics.getId())
                .counselorId(statistics.getCounselorId())
                .period(statistics.getPeriod())
                .startDate(statistics.getStartDate().toString())
                .endDate(statistics.getEndDate().toString())
                .totalClients(statistics.getTotalClients())
                .newClients(statistics.getNewClients())
                .completedSessions(statistics.getCompletedSessions())
                .revenue(statistics.getRevenue() + "원")
                .retention(statistics.getRetentionRate() + "%")
                .sessionTypeBreakdown(statistics.getSessionTypeBreakdown())
                .timeSlotDistribution(statistics.getTimeSlotDistribution())
                .generatedAt(statistics.getGeneratedAt())
                .build();
    }
}