package com.example.sociallogin.service;

import com.example.sociallogin.domain.Appointment;
import com.example.sociallogin.domain.Payment;
import com.example.sociallogin.domain.Statistics;
import com.example.sociallogin.dto.StatisticsDTO;
import com.example.sociallogin.repository.AppointmentRepository;
import com.example.sociallogin.repository.PaymentRepository;
import com.example.sociallogin.repository.StatisticsRepository;
import com.example.sociallogin.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class StatisticsService {

    private final StatisticsRepository statisticsRepository;
    private final AppointmentRepository appointmentRepository;
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;

    public StatisticsDTO getMonthlyStatistics(String counselorId) {
        log.info("Getting monthly statistics for counselor: {}", counselorId);

        Optional<Statistics> statsOpt = statisticsRepository.findByCounselorIdAndPeriod(counselorId, "MONTHLY");

        if (statsOpt.isPresent() && isStatisticsUpToDate(statsOpt.get())) {
            return StatisticsDTO.fromEntity(statsOpt.get());
        }

        // 통계 데이터가 없거나 오래된 경우 새로 생성
        Statistics statistics = generateMonthlyStatistics(counselorId);
        return StatisticsDTO.fromEntity(statistics);
    }

    private boolean isStatisticsUpToDate(Statistics statistics) {
        // 통계 데이터가 오늘 생성된 것인지 확인
        Calendar cal = Calendar.getInstance();
        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);
        cal.set(Calendar.MILLISECOND, 0);

        Date today = cal.getTime();

        return statistics.getGeneratedAt().after(today);
    }

    private Statistics generateMonthlyStatistics(String counselorId) {
        log.info("Generating monthly statistics for counselor: {}", counselorId);

        // 현재 월의 시작일과 종료일 계산
        YearMonth currentMonth = YearMonth.now();
        LocalDate startDate = currentMonth.atDay(1);
        LocalDate endDate = currentMonth.atEndOfMonth();

        // 월간 예약 조회
        List<Appointment> appointments = new ArrayList<>(); // 실제로는 월별 예약 조회 필요

        // 총 고객 수 계산
        Set<String> clientIds = appointments.stream()
                .map(Appointment::getClientId)
                .collect(Collectors.toSet());
        int totalClients = clientIds.size();

        // 완료된 세션 수 계산
        long completedSessions = appointments.stream()
                .filter(a -> "COMPLETED".equals(a.getStatus()))
                .count();

        // 매출 계산
        List<Payment> payments = new ArrayList<>(); // 실제로는 월별 결제 내역 조회 필요
        BigDecimal revenue = payments.stream()
                .map(Payment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 세션 유형별 통계
        Map<String, Integer> sessionTypeBreakdown = new HashMap<>();
        for (Appointment appointment : appointments) {
            String serviceType = appointment.getServiceType();
            sessionTypeBreakdown.put(serviceType, sessionTypeBreakdown.getOrDefault(serviceType, 0) + 1);
        }

        // 시간대별 분포
        Map<String, Integer> timeSlotDistribution = new HashMap<>();
        for (Appointment appointment : appointments) {
            LocalTime startTime = appointment.getStartTime();
            String timeSlot = String.format("%02d:00-%02d:00", startTime.getHour(), startTime.getHour() + 1);
            timeSlotDistribution.put(timeSlot, timeSlotDistribution.getOrDefault(timeSlot, 0) + 1);
        }

        // 통계 객체 생성 및 저장
        Statistics statistics = Statistics.builder()
                .counselorId(counselorId)
                .period("MONTHLY")
                .startDate(startDate)
                .endDate(endDate)
                .totalClients(totalClients)
                .newClients(calculateNewClients(counselorId, startDate))
                .completedSessions((int) completedSessions)
                .revenue(revenue)
                .retentionRate(calculateRetentionRate(counselorId))
                .sessionTypeBreakdown(sessionTypeBreakdown)
                .timeSlotDistribution(timeSlotDistribution)
                .generatedAt(new Date())
                .build();

        return statisticsRepository.save(statistics);
    }

    private int calculateNewClients(String counselorId, LocalDate startDate) {
        // 이번 달에 새로 추가된 고객 수 계산 (실제 구현 필요)
        return 8; // 예시 값
    }

    private double calculateRetentionRate(String counselorId) {
        // 고객 유지율 계산 (실제 구현 필요)
        return 78.0; // 예시 값
    }

    @Scheduled(cron = "0 0 1 * * ?") // 매일 새벽 1시에 실행
    public void generateDailyStatistics() {
        log.info("Generating daily statistics for all counselors");

        // 모든 상담사에 대해 통계 생성 (실제 구현 필요)
    }

    @Scheduled(cron = "0 0 1 1 * ?") // 매월 1일 새벽 1시에 실행
    public void generateMonthlyStatistics() {
        log.info("Generating monthly statistics for all counselors");

        // 모든 상담사에 대해 통계 생성 (실제 구현 필요)
    }
}