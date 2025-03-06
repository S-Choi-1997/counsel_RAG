package com.example.sociallogin.service;

import com.example.sociallogin.domain.Appointment;
import com.example.sociallogin.dto.AppointmentDTO;
import com.example.sociallogin.repository.AppointmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;

    public List<AppointmentDTO> getAppointmentsByCounselorAndDate(String counselorId, LocalDate date) {
        log.info("Getting appointments for counselor: {} on date: {}", counselorId, date);
        List<Appointment> appointments = appointmentRepository.findByCounselorIdAndDate(counselorId, date);

        return appointments.stream()
                .map(AppointmentDTO::fromEntity)
                .collect(Collectors.toList());
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

        return appointments.stream()
                .map(AppointmentDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public void deleteAppointment(String appointmentId) {
        log.info("Deleting appointment: {}", appointmentId);
        appointmentRepository.delete(appointmentId);
    }
}