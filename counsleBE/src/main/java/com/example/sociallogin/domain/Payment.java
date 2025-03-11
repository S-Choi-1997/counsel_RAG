package com.example.sociallogin.domain;

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
public class Payment {
    private String id;
    private String clientId;
    private String counselorId;
    private String appointmentId;
    private BigDecimal amount;
    private String currency;
    private String paymentMethod;
    private String status;
    private Date paymentDate;
    private String description;
    private String receiptUrl;
    private Date createdAt;
    private Date updatedAt;
}