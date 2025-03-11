package com.example.sociallogin.controller;

import com.example.sociallogin.dto.SyncStatusDTO;
import com.example.sociallogin.security.CurrentUser;
import com.example.sociallogin.security.CustomUserDetails;
import com.example.sociallogin.service.GoogleSyncService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/google")
@RequiredArgsConstructor
public class GoogleSyncController {

    private final GoogleSyncService googleSyncService;

    @GetMapping("/sync/status")
    public ResponseEntity<SyncStatusDTO> getSyncStatus(@CurrentUser CustomUserDetails userDetails) {
        log.info("Getting sync status for user: {}", userDetails.getEmail());
        SyncStatusDTO status = googleSyncService.getSyncStatus(userDetails.getId());
        return ResponseEntity.ok(status);
    }

    @PostMapping("/calendar/sync")
    public ResponseEntity<Map<String, Boolean>> syncCalendar(@CurrentUser CustomUserDetails userDetails) {
        log.info("Syncing calendar for user: {}", userDetails.getEmail());
        boolean success = googleSyncService.syncCalendar(userDetails.getId());
        return ResponseEntity.ok(Map.of("success", success));
    }

    @PostMapping("/sheets/sync")
    public ResponseEntity<Map<String, Boolean>> syncSheets(@CurrentUser CustomUserDetails userDetails) {
        log.info("Syncing sheets for user: {}", userDetails.getEmail());
        boolean success = googleSyncService.syncSheets(userDetails.getId());
        return ResponseEntity.ok(Map.of("success", success));
    }

    @PostMapping("/sync/all")
    public ResponseEntity<Map<String, Boolean>> syncAll(@CurrentUser CustomUserDetails userDetails) {
        log.info("Syncing all services for user: {}", userDetails.getEmail());
        boolean success = googleSyncService.syncAll(userDetails.getId());
        return ResponseEntity.ok(Map.of("success", success));
    }

    @PostMapping("/connect/{serviceType}")
    public ResponseEntity<Map<String, Boolean>> connectGoogleService(
            @PathVariable String serviceType,
            @RequestBody Map<String, String> connectionParams,
            @CurrentUser CustomUserDetails userDetails) {

        log.info("Connecting Google service: {} for user: {}", serviceType, userDetails.getEmail());

        String serviceId = connectionParams.get("serviceId");
        String accessToken = connectionParams.get("accessToken");

        boolean success = googleSyncService.connectGoogleService(
                userDetails.getId(), serviceType, serviceId, accessToken);

        return ResponseEntity.ok(Map.of("success", success));
    }
}