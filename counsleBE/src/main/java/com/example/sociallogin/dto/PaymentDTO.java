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
    private Date paymentDate;
    private String description;

    public static PaymentDTO fromEntity(Payment payment) {
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
                .description(payment.getDescription())
                .build();
    }

    public Payment toEntity() {
        return Payment.builder()
                .id(this.id)
                .clientId(this.clientId)
                .counselorId(this.counselorId)
                .appointmentId(this.appointmentId)
                .amount(new BigDecimal(this.amount))
                .currency(this.currency)
                .paymentMethod(this.paymentMethod)
                .status(this.status)
                .paymentDate(this.paymentDate)
                .description(this.description)
                .createdAt(new Date())
                .updatedAt(new Date())
                .build();
    }
}