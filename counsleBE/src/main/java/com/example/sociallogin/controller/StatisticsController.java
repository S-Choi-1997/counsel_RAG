package com.example.sociallogin.controller;

import com.example.sociallogin.dto.StatisticsDTO;
import com.example.sociallogin.security.CurrentUser;
import com.example.sociallogin.security.CustomUserDetails;
import com.example.sociallogin.service.StatisticsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/statistics")
@RequiredArgsConstructor
public class StatisticsController {

    private final StatisticsService statisticsService;

    @GetMapping("/monthly")
    public ResponseEntity<StatisticsDTO> getMonthlyStatistics(@CurrentUser CustomUserDetails userDetails) {
        log.info("Getting monthly statistics for user: {}", userDetails.getEmail());

        StatisticsDTO statistics = statisticsService.getMonthlyStatistics(userDetails.getId());

        return ResponseEntity.ok(statistics);
    }
}