package com.example.sociallogin.service;

import com.example.sociallogin.domain.Appointment;
import com.example.sociallogin.domain.Payment;
import com.example.sociallogin.dto.AppointmentDTO;
import com.example.sociallogin.repository.AppointmentRepository;
import com.example.sociallogin.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PaymentRepository paymentRepository; // 결제 정보 조회를 위해 추가

    public List<AppointmentDTO> getAppointmentsByCounselorAndDate(String counselorId, LocalDate date) {
        log.info("Getting appointments for counselor: {} on date: {}", counselorId, date);
        List<Appointment> appointments = appointmentRepository.findByCounselorIdAndDate(counselorId, date);

        return enhanceAppointmentsWithPaymentInfo(appointments);
    }

    // 추가: 월별 예약 조회 메소드
    public List<AppointmentDTO> getMonthlyAppointmentsByCounselor(String counselorId, LocalDate startDate, LocalDate endDate) {
        log.info("Getting monthly appointments for counselor: {} from {} to {}", counselorId, startDate, endDate);

        // 1. 예약 정보 조회
        List<Appointment> appointments = new ArrayList<>();

        // 날짜별로 예약 조회 (repository에 날짜 범위 조회 메서드가 없다고 가정)
        LocalDate currentDate = startDate;
        while (!currentDate.isAfter(endDate)) {
            appointments.addAll(appointmentRepository.findByCounselorIdAndDate(counselorId, currentDate));
            currentDate = currentDate.plusDays(1);
        }

        return enhanceAppointmentsWithPaymentInfo(appointments);
    }

    // 예약 정보에 결제 정보 추가
    private List<AppointmentDTO> enhanceAppointmentsWithPaymentInfo(List<Appointment> appointments) {
        // 2. 결제 정보 조회
        List<String> appointmentIds = appointments.stream()
                .map(Appointment::getId)
                .collect(Collectors.toList());

        // 모든 예약 ID에 대한 결제 정보 조회
        Map<String, Payment> paymentMap = paymentRepository.findByAppointmentIds(appointmentIds).stream()
                .collect(Collectors.toMap(Payment::getAppointmentId, payment -> payment, (p1, p2) -> p1));

        // 3. DTO 변환 및 정보 결합
        return appointments.stream()
                .map(appointment -> {
                    AppointmentDTO dto = AppointmentDTO.fromEntity(appointment);

                    // 결제 정보 추가
                    Payment payment = paymentMap.get(appointment.getId());
                    if (payment != null) {
                        dto.setIsPaid("COMPLETED".equals(payment.getStatus()));
                        dto.setAmount(payment.getAmount().toString());
                    }

                    // 메모 완료 상태는 별도 로직 필요 (예시)
                    dto.setIsNoteCompleted(checkNoteCompleted(appointment.getClientId(), appointment.getDate()));

                    return dto;
                })
                .collect(Collectors.toList());
    }

    // 메모 완료 여부 확인 (실제 구현 필요)
    private boolean checkNoteCompleted(String clientId, LocalDate date) {
        // 실제로는 NoteRepository를 통해 확인
        return false; // 기본값
    }

    public AppointmentDTO createAppointment(AppointmentDTO appointmentDTO) {
        log.info("Creating new appointment: {}", appointmentDTO);
        Appointment appointment = appointmentDTO.toEntity();

        // 초기 상태가 설정되지 않은 경우 'PENDING'으로 설정
        if (appointment.getStatus() == null || appointment.getStatus().isEmpty()) {
            appointment.setStatus("PENDING");
        }

        Appointment savedAppointment = appointmentRepository.save(appointment);
        return AppointmentDTO.fromEntity(savedAppointment);
    }

    public AppointmentDTO updateAppointmentStatus(String appointmentId, String status) {
        log.info("Updating appointment status: id={}, status={}", appointmentId, status);

        appointmentRepository.updateStatus(appointmentId, status);

        return appointmentRepository.findById(appointmentId)
                .map(AppointmentDTO::fromEntity)
                .orElseThrow(() -> new RuntimeException("Appointment not found with id: " + appointmentId));
    }

    public List<AppointmentDTO> getClientAppointments(String clientId) {
        log.info("Getting appointments for client: {}", clientId);
        List<Appointment> appointments = appointmentRepository.findByClientId(clientId);

        return enhanceAppointmentsWithPaymentInfo(appointments);
    }

    public void deleteAppointment(String appointmentId) {
        log.info("Deleting appointment: {}", appointmentId);
        appointmentRepository.delete(appointmentId);
    }
}