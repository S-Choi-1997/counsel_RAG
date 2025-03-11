package com.example.sociallogin.dto;

import com.example.sociallogin.domain.SyncStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SyncStatusDTO {
    private String id;
    private String userId;
    private Boolean calendarConnected;
    private Boolean sheetsConnected;
    private Date lastCalendarSync;
    private Date lastSheetsSync;
    private String calendarId;
    private String spreadsheetId;
    private Boolean isSyncing;

    public static SyncStatusDTO fromEntity(SyncStatus syncStatus) {
        return SyncStatusDTO.builder()
                .id(syncStatus.getId())
                .userId(syncStatus.getUserId())
                .calendarConnected(syncStatus.getCalendarConnected())
                .sheetsConnected(syncStatus.getSheetsConnected())
                .lastCalendarSync(syncStatus.getLastCalendarSync())
                .lastSheetsSync(syncStatus.getLastSheetsSync())
                .calendarId(syncStatus.getCalendarId())
                .spreadsheetId(syncStatus.getSpreadsheetId())
                .isSyncing(false) // 기본값
                .build();
    }
}