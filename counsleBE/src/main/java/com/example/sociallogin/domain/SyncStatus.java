package com.example.sociallogin.domain;

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
public class SyncStatus {
    private String id;
    private String userId;
    private Boolean calendarConnected;
    private Boolean sheetsConnected;
    private Date lastCalendarSync;
    private Date lastSheetsSync;
    private String calendarId;
    private String spreadsheetId;
    private Map<String, String> tokenInfo;
    private Date updatedAt;
}