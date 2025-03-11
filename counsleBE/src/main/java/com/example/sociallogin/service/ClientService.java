package com.example.sociallogin.service;

import com.example.sociallogin.domain.Appointment;
import com.example.sociallogin.domain.Client;
import com.example.sociallogin.dto.ClientDTO;
import com.example.sociallogin.repository.AppointmentRepository;
import com.example.sociallogin.repository.ClientRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ClientService {

    private final ClientRepository clientRepository;
    private final AppointmentRepository appointmentRepository;

    public ClientDTO getClientInfo(String clientId) {
        log.info("Retrieving client info for clientId: {}", clientId);

        Optional<Client> clientOpt = clientRepository.findById(clientId);

        if (clientOpt.isEmpty()) {
            log.warn("Client not found with ID: {}", clientId);
            return new ClientDTO(); // 빈 DTO 반환
        }

        Client client = clientOpt.get();
        return ClientDTO.fromEntity(client);
    }

    public ClientDTO updateClientInfo(ClientDTO clientDTO) {
        log.info("Updating client info for clientId: {}", clientDTO.getId());

        // 기존 클라이언트 조회
        Optional<Client> existingClientOpt = clientRepository.findById(clientDTO.getId());

        Client clientToSave;

        if (existingClientOpt.isPresent()) {
            // 기존 클라이언트 업데이트
            Client existingClient = existingClientOpt.get();

            // 필드 업데이트
            existingClient.setAge(clientDTO.getAge());
            existingClient.setOccupation(clientDTO.getOccupation());
            existingClient.setGoal(clientDTO.getGoal());
            existingClient.setNote(clientDTO.getNote());
            existingClient.setUpdatedAt(new Date());

            clientToSave = existingClient;
        } else {
            // 새로운 클라이언트 생성
            clientToSave = Client.builder()
                    .id(clientDTO.getId())
                    .name(clientDTO.getName())
                    .age(clientDTO.getAge())
                    .occupation(clientDTO.getOccupation())
                    .goal(clientDTO.getGoal())
                    .note(clientDTO.getNote())
                    .createdAt(new Date())
                    .updatedAt(new Date())
                    .build();
        }

        // 저장 후 결과 반환
        Client savedClient = clientRepository.save(clientToSave);
        return ClientDTO.fromEntity(savedClient);
    }

    // 추가된 부분: 상담 회차 계산
    public int getSessionCount(String clientId) {
        log.info("Calculating session count for clientId: {}", clientId);

        // 해당 클라이언트의 이전 상담 기록 조회 (완료된 상담)
        List<Appointment> completedAppointments = appointmentRepository.findByClientIdAndStatus(clientId, "COMPLETED");

        // 회차 계산 (완료된 상담 수 + 1)
        // +1을 하는 이유는 현재 진행 중인 상담 세션을 포함시키기 위함
        int sessionCount = completedAppointments.size() + 1;

        log.info("Session count for clientId {}: {}", clientId, sessionCount);
        return sessionCount;
    }
}