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

    // 프론트엔드에서 사용하는 날짜 형식 처리 개선
    private Date lastCalendarSync;
    private Date lastSheetsSync;

    // 추가 정보 필드 (백엔드 내부 처리용)
    private String calendarId;
    private String spreadsheetId;

    // 동기화 상태 표시용
    private Boolean isSyncing;

    // ISO 문자열 반환 편의 메서드 추가
    public String getLastCalendarSyncISO() {
        return lastCalendarSync != null ?
                new java.text.SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
                        .format(lastCalendarSync) : null;
    }

    public String getLastSheetsSyncISO() {
        return lastSheetsSync != null ?
                new java.text.SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
                        .format(lastSheetsSync) : null;
    }

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