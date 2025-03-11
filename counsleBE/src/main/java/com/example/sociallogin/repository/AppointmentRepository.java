package com.example.sociallogin.repository;

import com.example.sociallogin.domain.Appointment;
import com.google.api.core.ApiFuture;
import com.google.cloud.Timestamp;
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
                Map<String, Object> data = doc.getData();
                if (data != null) {
                    Appointment appointment = convertToAppointment(data, doc.getId());
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
                Map<String, Object> data = doc.getData();
                if (data != null) {
                    Appointment appointment = convertToAppointment(data, doc.getId());
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

    // convertToAppointment 메서드 (기존 메서드 활용)
    private Appointment convertToAppointment(Map<String, Object> data, String id) {
        Appointment appointment = new Appointment();
        appointment.setId(id);
        appointment.setClientId((String) data.get("clientId"));
        appointment.setClientName((String) data.get("clientName"));
        appointment.setCounselorId((String) data.get("counselorId"));
        appointment.setCounselorName((String) data.get("counselorName"));

        // 날짜와 시간 변환 처리
        if (data.get("date") != null) {
            appointment.setDate(LocalDate.parse((String) data.get("date")));
        }
        if (data.get("startTime") != null) {
            appointment.setStartTime(LocalTime.parse((String) data.get("startTime")));
        }
        if (data.get("endTime") != null) {
            appointment.setEndTime(LocalTime.parse((String) data.get("endTime")));
        }

        appointment.setStatus((String) data.get("status"));
        appointment.setNotes((String) data.get("notes"));
        appointment.setServiceType((String) data.get("serviceType"));
// 🔥 Timestamp → Date 변환 코드 추가
        Object createdAtValue = data.get("createdAt");
        if (createdAtValue instanceof Timestamp) {
            appointment.setCreatedAt(((Timestamp) createdAtValue).toDate()); // ✅ Timestamp → Date 변환
        } else if (createdAtValue instanceof Date) {
            appointment.setCreatedAt((Date) createdAtValue);
        } else {
            appointment.setCreatedAt(null); // 기본값 설정
        }

        Object updatedAtValue = data.get("updatedAt");
        if (updatedAtValue instanceof Timestamp) {
            appointment.setUpdatedAt(((Timestamp) updatedAtValue).toDate()); // ✅ Timestamp → Date 변환
        } else if (updatedAtValue instanceof Date) {
            appointment.setUpdatedAt((Date) updatedAtValue);
        } else {
            appointment.setUpdatedAt(null); // 기본값 설정
        }
        return appointment;
    }

    // 추가된 메서드: 클라이언트 ID와 상태로 예약 조회
    public List<Appointment> findByClientIdAndStatus(String clientId, String status) {
        try {
            CollectionReference appointmentsRef = firestore.collection(COLLECTION_NAME);
            Query query = appointmentsRef
                    .whereEqualTo("clientId", clientId)
                    .whereEqualTo("status", status);

            ApiFuture<QuerySnapshot> querySnapshot = query.get();

            List<Appointment> appointments = new ArrayList<>();
            for (DocumentSnapshot document : querySnapshot.get().getDocuments()) {
                Map<String, Object> data = document.getData();
                if (data != null) {
                    Appointment appointment = convertToAppointment(data, document.getId());
                    appointments.add(appointment);
                }
            }

            return appointments;
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error querying appointments by clientId and status: {}", e.getMessage());
            throw new RuntimeException("Failed to query appointments", e);
        }
    }
}