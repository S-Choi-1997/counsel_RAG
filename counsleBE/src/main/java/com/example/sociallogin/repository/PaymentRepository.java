package com.example.sociallogin.repository;

import com.example.sociallogin.domain.Payment;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.util.*;
import java.util.concurrent.ExecutionException;

@Slf4j
@Repository
@RequiredArgsConstructor
public class PaymentRepository {

    private final Firestore firestore;
    private static final String COLLECTION_NAME = "payments";

    public Payment save(Payment payment) {
        try {
            if (payment.getId() == null || payment.getId().isEmpty()) {
                payment.setId(UUID.randomUUID().toString());
                payment.setCreatedAt(new Date());
            }

            payment.setUpdatedAt(new Date());

            DocumentReference docRef = firestore.collection(COLLECTION_NAME).document(payment.getId());
            ApiFuture<WriteResult> result = docRef.set(payment);

            log.info("Payment saved at time: {}", result.get().getUpdateTime());
            return payment;
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error saving payment: {}", e.getMessage());
            throw new RuntimeException("Failed to save payment", e);
        }
    }

    public Optional<Payment> findById(String id) {
        try {
            DocumentReference docRef = firestore.collection(COLLECTION_NAME).document(id);
            ApiFuture<DocumentSnapshot> future = docRef.get();
            DocumentSnapshot document = future.get();

            if (document.exists()) {
                Payment payment = document.toObject(Payment.class);
                return Optional.ofNullable(payment);
            } else {
                log.info("Payment not found with ID: {}", id);
                return Optional.empty();
            }
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error finding payment: {}", e.getMessage());
            throw new RuntimeException("Failed to find payment", e);
        }
    }

    public List<Payment> findByClientId(String clientId) {
        try {
            Query query = firestore.collection(COLLECTION_NAME)
                    .whereEqualTo("clientId", clientId)
                    .orderBy("paymentDate", Query.Direction.DESCENDING);

            ApiFuture<QuerySnapshot> querySnapshot = query.get();

            List<Payment> payments = new ArrayList<>();
            for (DocumentSnapshot document : querySnapshot.get().getDocuments()) {
                Payment payment = document.toObject(Payment.class);
                if (payment != null) {
                    payments.add(payment);
                }
            }

            return payments;
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error querying payments: {}", e.getMessage());
            throw new RuntimeException("Failed to query payments", e);
        }
    }

    public List<Payment> findByCounselorId(String counselorId) {
        try {
            Query query = firestore.collection(COLLECTION_NAME)
                    .whereEqualTo("counselorId", counselorId)
                    .orderBy("paymentDate", Query.Direction.DESCENDING);

            ApiFuture<QuerySnapshot> querySnapshot = query.get();

            List<Payment> payments = new ArrayList<>();
            for (DocumentSnapshot document : querySnapshot.get().getDocuments()) {
                Payment payment = document.toObject(Payment.class);
                if (payment != null) {
                    payments.add(payment);
                }
            }

            return payments;
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error querying payments: {}", e.getMessage());
            throw new RuntimeException("Failed to query payments", e);
        }
    }

    public List<Payment> findByAppointmentId(String appointmentId) {
        try {
            Query query = firestore.collection(COLLECTION_NAME)
                    .whereEqualTo("appointmentId", appointmentId);

            ApiFuture<QuerySnapshot> querySnapshot = query.get();

            List<Payment> payments = new ArrayList<>();
            for (DocumentSnapshot document : querySnapshot.get().getDocuments()) {
                Payment payment = document.toObject(Payment.class);
                if (payment != null) {
                    payments.add(payment);
                }
            }

            return payments;
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error querying payments: {}", e.getMessage());
            throw new RuntimeException("Failed to query payments", e);
        }
    }

    // 추가: 예약 ID 목록으로 결제 정보 조회
    public List<Payment> findByAppointmentIds(List<String> appointmentIds) {
        if (appointmentIds == null || appointmentIds.isEmpty()) {
            return Collections.emptyList();
        }

        try {
            // Firestore는 in 쿼리에 최대 10개 항목만 허용하므로 배치 처리 필요
            List<Payment> allPayments = new ArrayList<>();
            List<List<String>> batches = batchList(appointmentIds, 10);

            for (List<String> batch : batches) {
                Query query = firestore.collection(COLLECTION_NAME)
                        .whereIn("appointmentId", batch);

                ApiFuture<QuerySnapshot> querySnapshot = query.get();

                for (DocumentSnapshot document : querySnapshot.get().getDocuments()) {
                    Payment payment = document.toObject(Payment.class);
                    if (payment != null) {
                        allPayments.add(payment);
                    }
                }
            }

            return allPayments;
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error querying payments by appointment IDs: {}", e.getMessage());
            throw new RuntimeException("Failed to query payments", e);
        }
    }

    // 리스트를 배치로 나누는 유틸리티 메소드
    private <T> List<List<T>> batchList(List<T> list, int batchSize) {
        List<List<T>> batches = new ArrayList<>();
        for (int i = 0; i < list.size(); i += batchSize) {
            batches.add(list.subList(i, Math.min(i + batchSize, list.size())));
        }
        return batches;
    }
}