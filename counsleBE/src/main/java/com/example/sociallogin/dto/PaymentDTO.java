package com.example.sociallogin.dto;

import com.example.sociallogin.domain.Payment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDTO {
    private String id;
    private String clientId;
    private String counselorId;
    private String appointmentId;
    private String amount;
    private String currency;
    private String paymentMethod;
    private String status;

    // ISO 문자열 형식 추가
    private String paymentDateIso;
    private Date paymentDate;

    private String description;

    // 프론트엔드와 호환을 위한 필드 추가
    private Boolean isPaid;

    public static PaymentDTO fromEntity(Payment payment) {
        // ISO 형식 날짜 문자열 생성
        String paymentDateIso = payment.getPaymentDate() != null ?
                new java.text.SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
                        .format(payment.getPaymentDate()) : null;

        // 결제 상태를 isPaid 불리언 값으로 변환
        boolean isPaid = "COMPLETED".equals(payment.getStatus());

        return PaymentDTO.builder()
                .id(payment.getId())
                .clientId(payment.getClientId())
                .counselorId(payment.getCounselorId())
                .appointmentId(payment.getAppointmentId())
                .amount(payment.getAmount().toString())
                .currency(payment.getCurrency())
                .paymentMethod(payment.getPaymentMethod())
                .status(payment.getStatus())
                .paymentDate(payment.getPaymentDate())
                .paymentDateIso(paymentDateIso)
                .description(payment.getDescription())
                .isPaid(isPaid)
                .build();
    }

    public Payment toEntity() {
        return Payment.builder()
                .id(this.id)
                .clientId(this.clientId)
                .counselorId(this.counselorId)
                .appointmentId(this.appointmentId)
                .amount(new BigDecimal(this.amount))
                .currency(this.currency != null ? this.currency : "KRW")
                .paymentMethod(this.paymentMethod)
                .status(this.isPaid != null && this.isPaid ? "COMPLETED" : "PENDING")
                .paymentDate(this.paymentDate)
                .description(this.description)
                .createdAt(new Date())
                .updatedAt(new Date())
                .build();
    }

    // 상태 업데이트용 팩토리 메서드
    public static PaymentDTO createForStatusUpdate(String clientId, String appointmentId, boolean isPaid) {
        return PaymentDTO.builder()
                .clientId(clientId)
                .appointmentId(appointmentId)
                .isPaid(isPaid)
                .build();
    }
}