package com.example.sociallogin.service;

import com.example.sociallogin.domain.Note;
import com.example.sociallogin.domain.SyncStatus;
import com.example.sociallogin.repository.NoteRepository;
import com.example.sociallogin.repository.SyncStatusRepository;
import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.sheets.v4.Sheets;
import com.google.api.services.sheets.v4.model.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class GoogleSheetsService {

    private final SyncStatusRepository syncStatusRepository;
    private final NoteRepository noteRepository;

    @Value("${google.application.name}")
    private String APPLICATION_NAME;

    private static final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();
    private static final String SHEET_RANGE = "A1:Z1000"; // 충분히 큰 범위

    public boolean syncNotesToSheets(String userId) {
        log.info("Starting notes sync to sheets for user: {}", userId);

        try {
            Optional<SyncStatus> syncStatusOpt = syncStatusRepository.findByUserId(userId);
            if (syncStatusOpt.isEmpty() || !syncStatusOpt.get().getSheetsConnected()) {
                log.warn("Sheets not connected for user: {}", userId);
                return false;
            }

            SyncStatus syncStatus = syncStatusOpt.get();
            String spreadsheetId = syncStatus.getSpreadsheetId();

            // Google API 클라이언트 설정
            Sheets service = getSheetsService(syncStatus);

            // 최근 1개월 내의 노트 가져오기 (예시)
            LocalDate startDate = LocalDate.now().minusMonths(1);
            // 실제로는 counselorId로 필터링된 노트를 가져와야 함 - 예시 코드
            List<Note> notes = getNotes(userId);

            // 스프레드시트로 노트 동기화
            syncNotesToSpreadsheet(service, spreadsheetId, notes);

            // 동기화 시간 업데이트
            syncStatusRepository.updateSheetsSyncTime(userId);

            return true;
        } catch (Exception e) {
            log.error("Error syncing notes to sheets: {}", e.getMessage(), e);
            return false;
        }
    }

    private Sheets getSheetsService(SyncStatus syncStatus) throws GeneralSecurityException, IOException {
        // 실제 구현은 OAuth2 인증을 통해 사용자 인증 정보 획득 필요
        // 여기서는 예시로 서비스 계정 방식으로 구현

        final NetHttpTransport HTTP_TRANSPORT = GoogleNetHttpTransport.newTrustedTransport();

        // 토큰 정보에서 액세스 토큰 획득 (실제 구현 필요)
        String accessToken = syncStatus.getTokenInfo().get("accessToken");

        GoogleCredential credential = new GoogleCredential().setAccessToken(accessToken);

        return new Sheets.Builder(HTTP_TRANSPORT, JSON_FACTORY, credential)
                .setApplicationName(APPLICATION_NAME)
                .build();
    }

    private List<Note> getNotes(String userId) {
        // 실제 구현: 상담사 ID로 최근 노트 조회
        // 예시 코드 - 실제로는 Repository에서 counselorId로 필터링 필요
        return Collections.emptyList();
    }

    private void syncNotesToSpreadsheet(Sheets service, String spreadsheetId, List<Note> notes)
            throws IOException {
        log.info("Syncing {} notes to spreadsheet", notes.size());

        // 스프레드시트에 데이터 작성을 위한 값 배열 생성
        List<List<Object>> values = new ArrayList<>();

        // 헤더 추가
        values.add(Arrays.asList("날짜", "고객 ID", "고객 이름", "상담 내용", "요약", "태그"));

        // 노트 데이터 추가
        for (Note note : notes) {
            String tags = note.getTags() != null ? String.join(", ", note.getTags()) : "";
            values.add(Arrays.asList(
                    note.getDate().toString(),
                    note.getClientId(),
                    "고객 이름", // 실제로는 고객 이름 조회 필요
                    note.getContent(),
                    note.getSummary(),
                    tags
            ));
        }

        // 스프레드시트 데이터 초기화 및 작성
        ValueRange body = new ValueRange().setValues(values);

        service.spreadsheets().values()
                .clear(spreadsheetId, SHEET_RANGE, new ClearValuesRequest())
                .execute();

        service.spreadsheets().values()
                .update(spreadsheetId, "A1", body)
                .setValueInputOption("RAW")
                .execute();

        log.info("Notes synced to spreadsheet successfully");
    }
}