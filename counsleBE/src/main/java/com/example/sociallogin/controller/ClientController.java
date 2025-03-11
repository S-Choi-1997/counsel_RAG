package com.example.sociallogin.controller;

import com.example.sociallogin.dto.ClientDTO;
import com.example.sociallogin.security.CurrentUser;
import com.example.sociallogin.security.CustomUserDetails;
import com.example.sociallogin.service.ClientService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/clients")
@RequiredArgsConstructor
public class ClientController {

    private final ClientService clientService;

    @GetMapping("/{clientId}")
    public ResponseEntity<ClientDTO> getClientInfo(
            @PathVariable String clientId,
            @CurrentUser CustomUserDetails userDetails) {

        log.info("클라이언트 정보 조회 요청 - 상담사: {}, 클라이언트ID: {}", userDetails.getEmail(), clientId);
        ClientDTO clientDTO = clientService.getClientInfo(clientId);
        return ResponseEntity.ok(clientDTO);
    }

    @PutMapping("/{clientId}")
    public ResponseEntity<ClientDTO> updateClientInfo(
            @PathVariable String clientId,
            @RequestBody ClientDTO clientDTO,
            @CurrentUser CustomUserDetails userDetails) {

        log.info("클라이언트 정보 업데이트 요청 - 상담사: {}, 클라이언트ID: {}", userDetails.getEmail(), clientId);

        // 파라미터의 clientId를 DTO에 설정
        clientDTO.setId(clientId);

        ClientDTO updatedClient = clientService.updateClientInfo(clientDTO);
        return ResponseEntity.ok(updatedClient);
    }
}