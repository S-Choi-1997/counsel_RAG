package com.example.sociallogin.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Note {
    private String id;
    private String clientId;
    private String counselorId;
    private LocalDate date;
    private String content;
    private String summary;
    private List<String> tags;
    private List<String> actionItems;
    private Date createdAt;
    private Date updatedAt;
    private String googleSheetId;
}