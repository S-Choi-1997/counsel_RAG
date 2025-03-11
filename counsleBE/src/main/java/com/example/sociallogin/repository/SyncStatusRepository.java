package com.example.sociallogin.repository;

import com.example.sociallogin.domain.SyncStatus;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.util.*;
import java.util.concurrent.ExecutionException;

@Slf4j
@Repository
@RequiredArgsConstructor
public class SyncStatusRepository {

    private final Firestore firestore;
    private static final String COLLECTION_NAME = "syncStatus";

    public SyncStatus save(SyncStatus syncStatus) {
        try {
            if (syncStatus.getId() == null || syncStatus.getId().isEmpty()) {
                syncStatus.setId(syncStatus.getUserId()); // 사용자 ID를 문서 ID로 사용
            }

            syncStatus.setUpdatedAt(new Date());

            DocumentReference docRef = firestore.collection(COLLECTION_NAME).document(syncStatus.getId());
            ApiFuture<WriteResult> result = docRef.set(syncStatus);

            log.info("SyncStatus saved at time: {}", result.get().getUpdateTime());
            return syncStatus;
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error saving sync status: {}", e.getMessage());
            throw new RuntimeException("Failed to save sync status", e);
        }
    }

    public Optional<SyncStatus> findByUserId(String userId) {
        try {
            DocumentReference docRef = firestore.collection(COLLECTION_NAME).document(userId);
            ApiFuture<DocumentSnapshot> future = docRef.get();
            DocumentSnapshot document = future.get();

            if (document.exists()) {
                SyncStatus syncStatus = document.toObject(SyncStatus.class);
                return Optional.ofNullable(syncStatus);
            } else {
                log.info("SyncStatus not found for user: {}", userId);
                return Optional.empty();
            }
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error finding sync status: {}", e.getMessage());
            throw new RuntimeException("Failed to find sync status", e);
        }
    }

    public void updateCalendarSyncTime(String userId) {
        try {
            DocumentReference docRef = firestore.collection(COLLECTION_NAME).document(userId);
            ApiFuture<WriteResult> result = docRef.update(
                    "lastCalendarSync", new Date(),
                    "updatedAt", new Date()
            );

            log.info("Calendar sync time updated at: {}", result.get().getUpdateTime());
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error updating calendar sync time: {}", e.getMessage());
            throw new RuntimeException("Failed to update calendar sync time", e);
        }
    }

    public void updateSheetsSyncTime(String userId) {
        try {
            DocumentReference docRef = firestore.collection(COLLECTION_NAME).document(userId);
            ApiFuture<WriteResult> result = docRef.update(
                    "lastSheetsSync", new Date(),
                    "updatedAt", new Date()
            );

            log.info("Sheets sync time updated at: {}", result.get().getUpdateTime());
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error updating sheets sync time: {}", e.getMessage());
            throw new RuntimeException("Failed to update sheets sync time", e);
        }
    }
}