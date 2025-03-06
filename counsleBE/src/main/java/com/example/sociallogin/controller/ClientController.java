package com.example.sociallogin.controller;

import com.example.sociallogin.dto.AppointmentDTO;
import com.example.sociallogin.security.CurrentUser;
import com.example.sociallogin.security.CustomUserDetails;
import com.example.sociallogin.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/clients")
@RequiredArgsConstructor
public class ClientController {

    private final AppointmentService appointmentService;

    @GetMapping("/{clientId}/appointments")
    public ResponseEntity<List<AppointmentDTO>> getClientAppointments(
            @PathVariable String clientId,
            @CurrentUser CustomUserDetails userDetails) {

        log.info("클라이언트 예약 조회 요청 - 상담사: {}, 클라이언트ID: {}", userDetails.getEmail(), clientId);

        // 권한 체크 - 상담사는 자신의 클라이언트 예약만 볼 수 있음
        List<AppointmentDTO> appointments = appointmentService.getClientAppointments(clientId);

        // 클라이언트의 예약 중 현재 상담사와 관련된 예약만 필터링
        List<AppointmentDTO> filteredAppointments = appointments.stream()
                .filter(apt -> apt.getCounselorId().equals(userDetails.getId()))
                .toList();

        return ResponseEntity.ok(filteredAppointments);
    }
}