package com.example.sociallogin.repository;

import com.example.sociallogin.domain.Statistics;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.*;
import java.util.concurrent.ExecutionException;

@Slf4j
@Repository
@RequiredArgsConstructor
public class StatisticsRepository {

    private final Firestore firestore;
    private static final String COLLECTION_NAME = "statistics";

    public Statistics save(Statistics statistics) {
        try {
            if (statistics.getId() == null || statistics.getId().isEmpty()) {
                statistics.setId(UUID.randomUUID().toString());
            }

            statistics.setGeneratedAt(new Date());

            Map<String, Object> statsMap = convertToMap(statistics);

            DocumentReference docRef = firestore.collection(COLLECTION_NAME).document(statistics.getId());
            ApiFuture<WriteResult> result = docRef.set(statsMap);

            log.info("Statistics saved at time: {}", result.get().getUpdateTime());
            return statistics;
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error saving statistics: {}", e.getMessage());
            throw new RuntimeException("Failed to save statistics", e);
        }
    }

    public Optional<Statistics> findById(String id) {
        try {
            DocumentReference docRef = firestore.collection(COLLECTION_NAME).document(id);
            ApiFuture<DocumentSnapshot> future = docRef.get();
            DocumentSnapshot document = future.get();

            if (document.exists()) {
                Map<String, Object> data = document.getData();
                return Optional.of(convertToStatistics(data, document.getId()));
            } else {
                log.info("Statistics not found with ID: {}", id);
                return Optional.empty();
            }
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error finding statistics: {}", e.getMessage());
            throw new RuntimeException("Failed to find statistics", e);
        }
    }

    public Optional<Statistics> findByCounselorIdAndPeriod(String counselorId, String period) {
        try {
            Query query = firestore.collection(COLLECTION_NAME)
                    .whereEqualTo("counselorId", counselorId)
                    .whereEqualTo("period", period)
                    .orderBy("generatedAt", Query.Direction.DESCENDING)
                    .limit(1);

            ApiFuture<QuerySnapshot> querySnapshot = query.get();
            List<QueryDocumentSnapshot> documents = querySnapshot.get().getDocuments();

            if (!documents.isEmpty()) {
                DocumentSnapshot document = documents.get(0);
                Map<String, Object> data = document.getData();
                return Optional.of(convertToStatistics(data, document.getId()));
            } else {
                log.info("Statistics not found for counselorId: {} and period: {}", counselorId, period);
                return Optional.empty();
            }
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error finding statistics: {}", e.getMessage());
            throw new RuntimeException("Failed to find statistics", e);
        }
    }

    private Map<String, Object> convertToMap(Statistics statistics) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", statistics.getId());
        map.put("counselorId", statistics.getCounselorId());
        map.put("period", statistics.getPeriod());
        map.put("startDate", statistics.getStartDate().toString());
        map.put("endDate", statistics.getEndDate().toString());
        map.put("totalClients", statistics.getTotalClients());
        map.put("newClients", statistics.getNewClients());
        map.put("completedSessions", statistics.getCompletedSessions());
        map.put("revenue", statistics.getRevenue());
        map.put("retentionRate", statistics.getRetentionRate());
        map.put("sessionTypeBreakdown", statistics.getSessionTypeBreakdown());
        map.put("timeSlotDistribution", statistics.getTimeSlotDistribution());
        map.put("generatedAt", statistics.getGeneratedAt());
        return map;
    }

    private Statistics convertToStatistics(Map<String, Object> data, String id) {
        Statistics statistics = new Statistics();
        statistics.setId(id);
        statistics.setCounselorId((String) data.get("counselorId"));
        statistics.setPeriod((String) data.get("period"));
        statistics.setStartDate(LocalDate.parse((String) data.get("startDate")));
        statistics.setEndDate(LocalDate.parse((String) data.get("endDate")));
        statistics.setTotalClients(((Long) data.get("totalClients")).intValue());
        statistics.setNewClients(((Long) data.get("newClients")).intValue());
        statistics.setCompletedSessions(((Long) data.get("completedSessions")).intValue());
        statistics.setRevenue((java.math.BigDecimal) data.get("revenue"));
        statistics.setRetentionRate((Double) data.get("retentionRate"));

        @SuppressWarnings("unchecked")
        Map<String, Integer> sessionTypeBreakdown = (Map<String, Integer>) data.get("sessionTypeBreakdown");
        statistics.setSessionTypeBreakdown(sessionTypeBreakdown);

        @SuppressWarnings("unchecked")
        Map<String, Integer> timeSlotDistribution = (Map<String, Integer>) data.get("timeSlotDistribution");
        statistics.setTimeSlotDistribution(timeSlotDistribution);

        statistics.setGeneratedAt((Date) data.get("generatedAt"));
        return statistics;
    }
}