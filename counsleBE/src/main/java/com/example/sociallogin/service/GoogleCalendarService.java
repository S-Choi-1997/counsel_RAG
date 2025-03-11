package com.example.sociallogin.service;

import com.example.sociallogin.domain.Appointment;
import com.example.sociallogin.domain.SyncStatus;
import com.example.sociallogin.repository.AppointmentRepository;
import com.example.sociallogin.repository.SyncStatusRepository;
import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.util.DateTime;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.EventDateTime;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class GoogleCalendarService {

    private final SyncStatusRepository syncStatusRepository;
    private final AppointmentRepository appointmentRepository;

    @Value("${google.application.name}")
    private String APPLICATION_NAME;

    private static final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();

    public boolean syncCalendar(String userId) {
        log.info("Starting calendar sync for user: {}", userId);

        try {
            Optional<SyncStatus> syncStatusOpt = syncStatusRepository.findByUserId(userId);
            if (syncStatusOpt.isEmpty() || !syncStatusOpt.get().getCalendarConnected()) {
                log.warn("Calendar not connected for user: {}", userId);
                return false;
            }

            SyncStatus syncStatus = syncStatusOpt.get();
            String calendarId = syncStatus.getCalendarId();

            // Google API 클라이언트 설정
            Calendar service = getCalendarService(syncStatus);

            // 최근 동기화 이후 변경된 예약 가져오기
            List<Appointment> appointments = getAppointmentsToSync(syncStatus);

            // 각 예약을 Google 캘린더에 동기화
            for (Appointment appointment : appointments) {
                syncAppointmentToCalendar(service, calendarId, appointment);
            }

            // 동기화 시간 업데이트
            syncStatusRepository.updateCalendarSyncTime(userId);

            return true;
        } catch (Exception e) {
            log.error("Error syncing calendar: {}", e.getMessage(), e);
            return false;
        }
    }

    private Calendar getCalendarService(SyncStatus syncStatus) throws GeneralSecurityException, IOException {
        // 실제 구현은 OAuth2 인증을 통해 사용자 인증 정보 획득 필요
        // 여기서는 예시로 서비스 계정 방식으로 구현

        final NetHttpTransport HTTP_TRANSPORT = GoogleNetHttpTransport.newTrustedTransport();

        // 토큰 정보에서 액세스 토큰 획득 (실제 구현 필요)
        String accessToken = syncStatus.getTokenInfo().get("accessToken");

        GoogleCredential credential = new GoogleCredential().setAccessToken(accessToken);

        return new Calendar.Builder(HTTP_TRANSPORT, JSON_FACTORY, credential)
                .setApplicationName(APPLICATION_NAME)
                .build();
    }

    private List<Appointment> getAppointmentsToSync(SyncStatus syncStatus) {
        // 최근 동기화 이후 변경된 예약 조회
        Date lastSync = syncStatus.getLastCalendarSync();
        if (lastSync == null) {
            // 초기 동기화: 현재부터 미래의 모든 예약
            return appointmentRepository.findByCounselorId(syncStatus.getUserId());
        }

        // 변경된 예약만 동기화 (실제 구현 필요)
        // 여기서는 예시로 모든 예약 반환
        return appointmentRepository.findByCounselorId(syncStatus.getUserId());
    }

    private void syncAppointmentToCalendar(Calendar service, String calendarId, Appointment appointment)
            throws IOException {
        log.info("Syncing appointment to calendar: {}", appointment.getId());

        Event event = new Event()
                .setSummary(appointment.getClientName() + " - " + appointment.getServiceType())
                .setDescription("상담 예약: " + appointment.getNotes());

        LocalDateTime startDateTime = LocalDateTime.of(appointment.getDate(), appointment.getStartTime());
        LocalDateTime endDateTime = LocalDateTime.of(appointment.getDate(), appointment.getEndTime());

        DateTime start = new DateTime(Date.from(startDateTime.atZone(ZoneId.systemDefault()).toInstant()));
        DateTime end = new DateTime(Date.from(endDateTime.atZone(ZoneId.systemDefault()).toInstant()));

        event.setStart(new EventDateTime().setDateTime(start).setTimeZone("Asia/Seoul"));
        event.setEnd(new EventDateTime().setDateTime(end).setTimeZone("Asia/Seoul"));

        // 기존 이벤트 ID가 있으면 업데이트, 없으면 새로 생성
        String googleCalendarEventId = appointment.getGoogleCalendarEventId();
        if (googleCalendarEventId != null && !googleCalendarEventId.isEmpty()) {
            event = service.events().update(calendarId, googleCalendarEventId, event).execute();
        } else {
            event = service.events().insert(calendarId, event).execute();

            // 생성된 이벤트 ID 저장
            appointment.setGoogleCalendarEventId(event.getId());
            appointmentRepository.save(appointment);
        }

        log.info("Event created/updated: {}", event.getHtmlLink());
    }
}