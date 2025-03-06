package com.example.sociallogin.repository;

import com.example.sociallogin.domain.Appointment;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import java.util.concurrent.ExecutionException;

@Slf4j
@Repository
@RequiredArgsConstructor
public class AppointmentRepository {

    private final Firestore firestore;
    private static final String COLLECTION_NAME = "appointments";

    public Appointment save(Appointment appointment) {
        try {
            // 새 예약인 경우 ID 생성
            if (appointment.getId() == null || appointment.getId().isEmpty()) {
                appointment.setId(UUID.randomUUID().toString());
                appointment.setCreatedAt(new Date());
            }

            appointment.setUpdatedAt(new Date());

            // Map으로 변환 (LocalDate, LocalTime 처리를 위해)
            Map<String, Object> appointmentMap = convertToMap(appointment);

            // Firestore에 저장
            DocumentReference docRef = firestore.collection(COLLECTION_NAME).document(appointment.getId());
            ApiFuture<WriteResult> result = docRef.set(appointmentMap);

            log.info("Appointment saved at time: {}", result.get().getUpdateTime());
            return appointment;
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error saving appointment: {}", e.getMessage());
            throw new RuntimeException("Failed to save appointment", e);
        }
    }

    public Optional<Appointment> findById(String id) {
        try {
            DocumentReference docRef = firestore.collection(COLLECTION_NAME).document(id);
            ApiFuture<DocumentSnapshot> future = docRef.get();
            DocumentSnapshot document = future.get();

            if (document.exists()) {
                Map<String, Object> data = document.getData();
                return Optional.of(convertToAppointment(data, document.getId()));
            } else {
                log.info("Appointment not found with ID: {}", id);
                return Optional.empty();
            }
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error finding appointment: {}", e.getMessage());
            throw new RuntimeException("Failed to find appointment", e);
        }
    }

    // 상담자별 예약 조회
    public List<Appointment> findByCounselorId(String counselorId) {
        try {
            CollectionReference appointments = firestore.collection(COLLECTION_NAME);
            Query query = appointments.whereEqualTo("counselorId", counselorId);
            ApiFuture<QuerySnapshot> querySnapshot = query.get();

            List<Appointment> appointmentList = new ArrayList<>();
            for (DocumentSnapshot doc : querySnapshot.get().getDocuments()) {
                Appointment appointment = doc.toObject(Appointment.class);
                if (appointment != null) {
                    appointmentList.add(appointment);
                }
            }

            return appointmentList;
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error querying appointments by counselorId: {}", e.getMessage());
            throw new RuntimeException("Failed to query appointments", e);
        }
    }

    // 상담자별 특정 날짜 예약 조회
    public List<Appointment> findByCounselorIdAndDate(String counselorId, LocalDate date) {
        try {
            CollectionReference appointments = firestore.collection(COLLECTION_NAME);
            Query query = appointments.whereEqualTo("counselorId", counselorId)
                    .whereEqualTo("date", date.toString());
            ApiFuture<QuerySnapshot> querySnapshot = query.get();

            List<Appointment> appointmentList = new ArrayList<>();
            for (DocumentSnapshot doc : querySnapshot.get().getDocuments()) {
                Appointment appointment = doc.toObject(Appointment.class);
                if (appointment != null) {
                    appointmentList.add(appointment);
                }
            }

            return appointmentList;
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error querying appointments: {}", e.getMessage());
            throw new RuntimeException("Failed to query appointments", e);
        }
    }

    public List<Appointment> findByClientId(String clientId) {
        try {
            CollectionReference appointmentsRef = firestore.collection(COLLECTION_NAME);
            Query query = appointmentsRef.whereEqualTo("clientId", clientId);

            ApiFuture<QuerySnapshot> querySnapshot = query.get();

            List<Appointment> appointmentList = new ArrayList<>();
            for (DocumentSnapshot document : querySnapshot.get().getDocuments()) {
                Map<String, Object> data = document.getData();
                Appointment appointment = convertToAppointment(data, document.getId());
                appointmentList.add(appointment);
            }

            return appointmentList;
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error querying appointments: {}", e.getMessage());
            throw new RuntimeException("Failed to query appointments", e);
        }
    }

    public void updateStatus(String id, String status) {
        try {
            DocumentReference docRef = firestore.collection(COLLECTION_NAME).document(id);
            ApiFuture<WriteResult> result = docRef.update(
                    "status", status,
                    "updatedAt", new Date()
            );

            log.info("Appointment status updated at time: {}", result.get().getUpdateTime());
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error updating appointment status: {}", e.getMessage());
            throw new RuntimeException("Failed to update appointment status", e);
        }
    }

    public void delete(String id) {
        try {
            ApiFuture<WriteResult> result = firestore.collection(COLLECTION_NAME).document(id).delete();
            log.info("Appointment deleted at time: {}", result.get().getUpdateTime());
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error deleting appointment: {}", e.getMessage());
            throw new RuntimeException("Failed to delete appointment", e);
        }
    }

    // Appointment 객체를 Map으로 변환 (Firestore 저장용)
    private Map<String, Object> convertToMap(Appointment appointment) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", appointment.getId());
        map.put("clientId", appointment.getClientId());
        map.put("clientName", appointment.getClientName());
        map.put("counselorId", appointment.getCounselorId());
        map.put("counselorName", appointment.getCounselorName());
        map.put("date", appointment.getDate().toString());
        map.put("startTime", appointment.getStartTime().toString());
        map.put("endTime", appointment.getEndTime().toString());
        map.put("status", appointment.getStatus());
        map.put("notes", appointment.getNotes());
        map.put("serviceType", appointment.getServiceType());
        map.put("createdAt", appointment.getCreatedAt());
        map.put("updatedAt", appointment.getUpdatedAt());
        return map;
    }

    // Map을 Appointment 객체로 변환 (Firestore 조회 결과)
    private Appointment convertToAppointment(Map<String, Object> data, String id) {
        Appointment appointment = new Appointment();
        appointment.setId(id);
        appointment.setClientId((String) data.get("clientId"));
        appointment.setClientName((String) data.get("clientName"));
        appointment.setCounselorId((String) data.get("counselorId"));
        appointment.setCounselorName((String) data.get("counselorName"));
        appointment.setDate(LocalDate.parse((String) data.get("date")));
        appointment.setStartTime(LocalTime.parse((String) data.get("startTime")));
        appointment.setEndTime(LocalTime.parse((String) data.get("endTime")));
        appointment.setStatus((String) data.get("status"));
        appointment.setNotes((String) data.get("notes"));
        appointment.setServiceType((String) data.get("serviceType"));
        appointment.setCreatedAt((Date) data.get("createdAt"));
        appointment.setUpdatedAt((Date) data.get("updatedAt"));
        return appointment;
    }
}