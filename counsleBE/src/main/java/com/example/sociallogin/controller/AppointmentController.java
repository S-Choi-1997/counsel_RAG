package com.example.sociallogin.controller;

import com.example.sociallogin.dto.AppointmentDTO;
import com.example.sociallogin.security.CurrentUser;
import com.example.sociallogin.security.CustomUserDetails;
import com.example.sociallogin.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    @GetMapping
    public ResponseEntity<List<AppointmentDTO>> getAppointmentsByDate(
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @CurrentUser CustomUserDetails userDetails) {

        log.info("GET /api/appointments - User: {}, Date: {}", userDetails.getEmail(), date);
        // 현재 로그인한 상담자의 ID로 예약 필터링
        String counselorId = userDetails.getId();
        List<AppointmentDTO> appointments = appointmentService.getAppointmentsByCounselorAndDate(counselorId, date);
        return ResponseEntity.ok(appointments);
    }

    // 추가: 월별 예약 조회 API
    @GetMapping("/monthly")
    public ResponseEntity<List<AppointmentDTO>> getMonthlyAppointments(
            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @CurrentUser CustomUserDetails userDetails) {

        log.info("GET /api/appointments/monthly - User: {}, Period: {} to {}",
                userDetails.getEmail(), startDate, endDate);

        String counselorId = userDetails.getId();
        List<AppointmentDTO> appointments = appointmentService.getMonthlyAppointmentsByCounselor(
                counselorId, startDate, endDate);

        return ResponseEntity.ok(appointments);
    }

    @PostMapping
    public ResponseEntity<AppointmentDTO> createAppointment(
            @RequestBody AppointmentDTO appointmentDTO,
            @CurrentUser CustomUserDetails userDetails) {

        log.info("예약 생성 요청 - 상담사: {}, 데이터: {}", userDetails.getEmail(), appointmentDTO);

        // 상담사 정보 설정
        appointmentDTO.setCounselorId(userDetails.getId());
        appointmentDTO.setCounselorName(userDetails.getName());

        AppointmentDTO createdAppointment = appointmentService.createAppointment(appointmentDTO);
        return ResponseEntity.ok(createdAppointment);
    }

    @PutMapping("/{appointmentId}/status")
    public ResponseEntity<AppointmentDTO> updateAppointmentStatus(
            @PathVariable String appointmentId,
            @RequestBody Map<String, String> statusUpdate,
            @CurrentUser CustomUserDetails userDetails) {

        String status = statusUpdate.get("status");
        log.info("예약 상태 업데이트 요청 - 상담사: {}, 예약ID: {}, 상태: {}",
                userDetails.getEmail(), appointmentId, status);

        AppointmentDTO updatedAppointment = appointmentService.updateAppointmentStatus(appointmentId, status);
        return ResponseEntity.ok(updatedAppointment);
    }

    @DeleteMapping("/{appointmentId}")
    public ResponseEntity<Void> deleteAppointment(
            @PathVariable String appointmentId,
            @CurrentUser CustomUserDetails userDetails) {

        log.info("예약 삭제 요청 - 상담사: {}, 예약ID: {}", userDetails.getEmail(), appointmentId);
        appointmentService.deleteAppointment(appointmentId);
        return ResponseEntity.noContent().build();
    }
}