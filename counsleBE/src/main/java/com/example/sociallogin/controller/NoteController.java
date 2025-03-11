package com.example.sociallogin.controller;

import com.example.sociallogin.dto.NoteDTO;
import com.example.sociallogin.security.CurrentUser;
import com.example.sociallogin.security.CustomUserDetails;
import com.example.sociallogin.service.NoteService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/notes")
@RequiredArgsConstructor
public class NoteController {

    private final NoteService noteService;

    @PostMapping
    public ResponseEntity<NoteDTO> saveNote(@RequestBody NoteDTO noteDTO,
                                            @CurrentUser CustomUserDetails userDetails) {
        log.info("Received request to save note for client: {}", noteDTO.getClientId());
        NoteDTO savedNote = noteService.saveNote(noteDTO, userDetails.getId());
        return ResponseEntity.ok(savedNote);
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<String>> getNotesByClientId(@PathVariable String clientId,
                                                           @CurrentUser CustomUserDetails userDetails) {
        log.info("Getting notes for client: {}", clientId);
        List<String> noteDates = noteService.getNotesByClientId(clientId);
        return ResponseEntity.ok(noteDates);
    }

    @GetMapping("/client/{clientId}/date/{date}")
    public ResponseEntity<NoteDTO> getNoteByClientIdAndDate(@PathVariable String clientId,
                                                            @PathVariable String date,
                                                            @CurrentUser CustomUserDetails userDetails) {
        log.info("Getting note for client: {} on date: {}", clientId, date);
        NoteDTO note = noteService.getNoteByClientIdAndDate(clientId, date);
        if (note != null) {
            return ResponseEntity.ok(note);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/sync")
    public ResponseEntity<Map<String, Boolean>> syncNotesToSpreadsheet(@CurrentUser CustomUserDetails userDetails) {
        log.info("Syncing notes to spreadsheet for user: {}", userDetails.getEmail());
        boolean success = noteService.syncNotesToSpreadsheet();
        return ResponseEntity.ok(Map.of("success", success));
    }
}