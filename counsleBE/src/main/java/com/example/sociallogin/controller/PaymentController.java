package com.example.sociallogin.controller;

import com.example.sociallogin.dto.PaymentDTO;
import com.example.sociallogin.security.CurrentUser;
import com.example.sociallogin.security.CustomUserDetails;
import com.example.sociallogin.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/clients")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PutMapping("/{clientId}/payment")
    public ResponseEntity<PaymentDTO> updatePaymentInfo(
            @PathVariable String clientId,
            @RequestBody PaymentDTO paymentDTO,
            @CurrentUser CustomUserDetails userDetails) {

        log.info("Updating payment info for client: {}", clientId);

        paymentDTO.setClientId(clientId);
        PaymentDTO result = paymentService.createPayment(paymentDTO, userDetails.getId());

        return ResponseEntity.ok(result);
    }

    @PutMapping("/{clientId}/payment/status")
    public ResponseEntity<Map<String, Boolean>> updatePaymentStatus(
            @PathVariable String clientId,
            @RequestBody Map<String, Object> statusUpdate,
            @CurrentUser CustomUserDetails userDetails) {

        boolean isPaid = (boolean) statusUpdate.get("isPaid");
        String appointmentId = (String) statusUpdate.get("appointmentId");

        log.info("Updating payment status for client: {}, isPaid: {}", clientId, isPaid);

        boolean success = paymentService.updatePaymentStatus(clientId, appointmentId, isPaid);

        return ResponseEntity.ok(Map.of("success", success));
    }

    @GetMapping("/{clientId}/payments")
    public ResponseEntity<List<PaymentDTO>> getPaymentHistory(
            @PathVariable String clientId,
            @CurrentUser CustomUserDetails userDetails) {

        log.info("Getting payment history for client: {}", clientId);

        List<PaymentDTO> payments = paymentService.getPaymentHistory(clientId);

        return ResponseEntity.ok(payments);
    }
}