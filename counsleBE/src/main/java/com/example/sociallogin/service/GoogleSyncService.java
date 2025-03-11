package com.example.sociallogin.service;

import com.example.sociallogin.domain.SyncStatus;
import com.example.sociallogin.dto.SyncStatusDTO;
import com.example.sociallogin.repository.SyncStatusRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

@Slf4j
@Service
@RequiredArgsConstructor
public class GoogleSyncService {

    private final SyncStatusRepository syncStatusRepository;
    private final GoogleCalendarService calendarService;
    private final GoogleSheetsService sheetsService;

    // 동기화 진행 상태 추적을 위한 맵
    private final Map<String, Boolean> syncInProgress = new HashMap<>();

    public SyncStatusDTO getSyncStatus(String userId) {
        log.info("Getting sync status for user: {}", userId);

        Optional<SyncStatus> syncStatusOpt = syncStatusRepository.findByUserId(userId);

        if (syncStatusOpt.isEmpty()) {
            // 초기 상태 생성
            SyncStatus newStatus = SyncStatus.builder()
                    .id(userId)
                    .userId(userId)
                    .calendarConnected(false)
                    .sheetsConnected(false)
                    .updatedAt(new Date())
                    .tokenInfo(new HashMap<>())
                    .build();

            syncStatusRepository.save(newStatus);
            return SyncStatusDTO.fromEntity(newStatus);
        }

        SyncStatusDTO dto = SyncStatusDTO.fromEntity(syncStatusOpt.get());
        dto.setIsSyncing(syncInProgress.getOrDefault(userId, false));

        return dto;
    }

    public boolean syncCalendar(String userId) {
        log.info("Request to sync calendar for user: {}", userId);

        if (syncInProgress.getOrDefault(userId, false)) {
            log.warn("Sync already in progress for user: {}", userId);
            return false;
        }

        syncInProgress.put(userId, true);

        // 비동기 실행
        CompletableFuture.runAsync(() -> {
            try {
                calendarService.syncCalendar(userId);
            } finally {
                syncInProgress.put(userId, false);
            }
        });

        return true;
    }

    public boolean syncSheets(String userId) {
        log.info("Request to sync sheets for user: {}", userId);

        if (syncInProgress.getOrDefault(userId, false)) {
            log.warn("Sync already in progress for user: {}", userId);
            return false;
        }

        syncInProgress.put(userId, true);

        // 비동기 실행
        CompletableFuture.runAsync(() -> {
            try {
                sheetsService.syncNotesToSheets(userId);
            } finally {
                syncInProgress.put(userId, false);
            }
        });

        return true;
    }

    public boolean syncAll(String userId) {
        log.info("Request to sync all services for user: {}", userId);

        if (syncInProgress.getOrDefault(userId, false)) {
            log.warn("Sync already in progress for user: {}", userId);
            return false;
        }

        syncInProgress.put(userId, true);

        // 비동기 실행
        CompletableFuture.runAsync(() -> {
            try {
                calendarService.syncCalendar(userId);
                sheetsService.syncNotesToSheets(userId);
            } finally {
                syncInProgress.put(userId, false);
            }
        });

        return true;
    }

    public boolean connectGoogleService(String userId, String serviceType, String serviceId, String accessToken) {
        log.info("Connecting Google service: {} for user: {}", serviceType, userId);

        Optional<SyncStatus> syncStatusOpt = syncStatusRepository.findByUserId(userId);
        SyncStatus syncStatus;

        if (syncStatusOpt.isEmpty()) {
            // 새 상태 생성
            syncStatus = SyncStatus.builder()
                    .id(userId)
                    .userId(userId)
                    .calendarConnected(false)
                    .sheetsConnected(false)
                    .updatedAt(new Date())
                    .tokenInfo(new HashMap<>())
                    .build();
        } else {
            syncStatus = syncStatusOpt.get();
        }

        // 토큰 정보 업데이트
        Map<String, String> tokenInfo = syncStatus.getTokenInfo();
        if (tokenInfo == null) {
            tokenInfo = new HashMap<>();
        }
        tokenInfo.put("accessToken", accessToken);
        syncStatus.setTokenInfo(tokenInfo);

        // 서비스 타입에 따라 연결 상태 업데이트
        if ("calendar".equals(serviceType)) {
            syncStatus.setCalendarConnected(true);
            syncStatus.setCalendarId(serviceId);
        } else if ("sheets".equals(serviceType)) {
            syncStatus.setSheetsConnected(true);
            syncStatus.setSpreadsheetId(serviceId);
        }

        syncStatusRepository.save(syncStatus);
        return true;
    }
}