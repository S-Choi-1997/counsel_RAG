package com.example.sociallogin.service;

import com.example.sociallogin.domain.Appointment;
import com.example.sociallogin.domain.Payment;
import com.example.sociallogin.dto.PaymentDTO;
import com.example.sociallogin.repository.AppointmentRepository;
import com.example.sociallogin.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final AppointmentRepository appointmentRepository;

    public PaymentDTO createPayment(PaymentDTO paymentDTO, String counselorId) {
        log.info("Creating payment for client: {}", paymentDTO.getClientId());

        Payment payment = paymentDTO.toEntity();
        payment.setCounselorId(counselorId);

        // 기본값 설정
        if (payment.getCurrency() == null) {
            payment.setCurrency("KRW");
        }

        if (payment.getStatus() == null) {
            payment.setStatus("COMPLETED");
        }

        if (payment.getPaymentDate() == null) {
            payment.setPaymentDate(new Date());
        }

        Payment savedPayment = paymentRepository.save(payment);

        // 관련 예약이 있으면 결제 상태 업데이트
        if (payment.getAppointmentId() != null && !payment.getAppointmentId().isEmpty()) {
            updateAppointmentPaymentStatus(payment.getAppointmentId(), true);
        }

        return PaymentDTO.fromEntity(savedPayment);
    }

    public List<PaymentDTO> getPaymentHistory(String clientId) {
        log.info("Getting payment history for client: {}", clientId);

        List<Payment> payments = paymentRepository.findByClientId(clientId);
        return payments.stream()
                .map(PaymentDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public boolean updatePaymentStatus(String clientId, String appointmentId, boolean isPaid) {
        log.info("Updating payment status for client: {}, appointment: {}, isPaid: {}",
                clientId, appointmentId, isPaid);

        // 예약에 대한 결제 정보 업데이트
        if (appointmentId != null && !appointmentId.isEmpty()) {
            updateAppointmentPaymentStatus(appointmentId, isPaid);
        }

        // 이미 결제 기록이 있는지 확인
        List<Payment> existingPayments = paymentRepository.findByAppointmentId(appointmentId);

        if (isPaid && existingPayments.isEmpty()) {
            // 결제 기록이 없고 결제 완료로 설정하는 경우, 새 결제 기록 생성
            Optional<Appointment> appointmentOpt = appointmentRepository.findById(appointmentId);
            if (appointmentOpt.isPresent()) {
                Appointment appointment = appointmentOpt.get();

                Payment payment = Payment.builder()
                        .clientId(clientId)
                        .counselorId(appointment.getCounselorId())
                        .appointmentId(appointmentId)
                        .amount(new BigDecimal("0")) // 실제 금액은 설정 필요
                        .currency("KRW")
                        .status("COMPLETED")
                        .paymentMethod("MANUAL")
                        .paymentDate(new Date())
                        .description("Manual payment completion")
                        .createdAt(new Date())
                        .updatedAt(new Date())
                        .build();

                paymentRepository.save(payment);
            }
        } else if (!isPaid && !existingPayments.isEmpty()) {
            // 결제 취소 처리 (실제 환불 로직은 구현 필요)
            for (Payment payment : existingPayments) {
                payment.setStatus("CANCELLED");
                payment.setUpdatedAt(new Date());
                paymentRepository.save(payment);
            }
        }

        return true;
    }

    private void updateAppointmentPaymentStatus(String appointmentId, boolean isPaid) {
        Optional<Appointment> appointmentOpt = appointmentRepository.findById(appointmentId);
        if (appointmentOpt.isPresent()) {
            // 예약 모델에 isPaid 필드 추가 필요
            // Appointment appointment = appointmentOpt.get();
            // appointment.setIsPaid(isPaid);
            // appointmentRepository.save(appointment);
        }
    }
}