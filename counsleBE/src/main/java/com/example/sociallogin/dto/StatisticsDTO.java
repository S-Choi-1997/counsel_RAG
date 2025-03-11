package com.example.sociallogin.dto;

import com.example.sociallogin.domain.Statistics;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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

    // 시간대별 분포에서 가장 인기 있는 시간대 추출
    private String topTimeSlot;

    private Map<String, Integer> sessionTypeBreakdown;
    private Map<String, Integer> timeSlotDistribution;
    private Date generatedAt;

    public static StatisticsDTO fromEntity(Statistics statistics) {
        // 최다 시간대 계산
        String topSlot = calculateTopTimeSlot(statistics.getTimeSlotDistribution());

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
                .topTimeSlot(topSlot)
                .generatedAt(statistics.getGeneratedAt())
                .build();
    }

    // 가장 인기 있는 시간대 계산 메서드
    private static String calculateTopTimeSlot(Map<String, Integer> timeSlotDistribution) {
        if (timeSlotDistribution == null || timeSlotDistribution.isEmpty()) {
            return "데이터 없음";
        }

        return timeSlotDistribution.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("데이터 없음");
    }
}