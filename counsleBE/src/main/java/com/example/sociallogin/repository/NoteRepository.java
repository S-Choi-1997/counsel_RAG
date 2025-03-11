package com.example.sociallogin.repository;

import com.example.sociallogin.domain.Note;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.*;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Slf4j
@Repository
@RequiredArgsConstructor
public class NoteRepository {

    private final Firestore firestore;
    private static final String COLLECTION_NAME = "notes";

    public Note save(Note note) {
        try {
            if (note.getId() == null || note.getId().isEmpty()) {
                note.setId(UUID.randomUUID().toString());
                note.setCreatedAt(new Date());
            }

            note.setUpdatedAt(new Date());

            Map<String, Object> noteMap = convertToMap(note);

            DocumentReference docRef = firestore.collection(COLLECTION_NAME).document(note.getId());
            ApiFuture<WriteResult> result = docRef.set(noteMap);

            log.info("Note saved at time: {}", result.get().getUpdateTime());
            return note;
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error saving note: {}", e.getMessage());
            throw new RuntimeException("Failed to save note", e);
        }
    }

    public Optional<Note> findById(String id) {
        try {
            DocumentReference docRef = firestore.collection(COLLECTION_NAME).document(id);
            ApiFuture<DocumentSnapshot> future = docRef.get();
            DocumentSnapshot document = future.get();

            if (document.exists()) {
                Map<String, Object> data = document.getData();
                return Optional.of(convertToNote(data, document.getId()));
            } else {
                log.info("Note not found with ID: {}", id);
                return Optional.empty();
            }
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error finding note: {}", e.getMessage());
            throw new RuntimeException("Failed to find note", e);
        }
    }

    public List<Note> findByClientId(String clientId) {
        try {
            Query query = firestore.collection(COLLECTION_NAME)
                    .whereEqualTo("clientId", clientId)
                    .orderBy("date", Query.Direction.DESCENDING);

            ApiFuture<QuerySnapshot> querySnapshot = query.get();

            List<Note> notes = new ArrayList<>();
            for (DocumentSnapshot document : querySnapshot.get().getDocuments()) {
                Map<String, Object> data = document.getData();
                Note note = convertToNote(data, document.getId());
                notes.add(note);
            }

            return notes;
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error querying notes: {}", e.getMessage());
            throw new RuntimeException("Failed to query notes", e);
        }
    }

    public Optional<Note> findByClientIdAndDate(String clientId, LocalDate date) {
        try {
            Query query = firestore.collection(COLLECTION_NAME)
                    .whereEqualTo("clientId", clientId)
                    .whereEqualTo("date", date.toString());

            ApiFuture<QuerySnapshot> querySnapshot = query.get();
            List<QueryDocumentSnapshot> documents = querySnapshot.get().getDocuments();

            if (!documents.isEmpty()) {
                DocumentSnapshot document = documents.get(0);
                Map<String, Object> data = document.getData();
                Note note = convertToNote(data, document.getId());
                return Optional.of(note);
            } else {
                log.info("Note not found for clientId: {} and date: {}", clientId, date);
                return Optional.empty();
            }
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error finding note by clientId and date: {}", e.getMessage());
            throw new RuntimeException("Failed to find note by clientId and date", e);
        }
    }

    public List<String> findDatesByClientId(String clientId) {
        try {
            Query query = firestore.collection(COLLECTION_NAME)
                    .whereEqualTo("clientId", clientId)
                    .select("date");

            ApiFuture<QuerySnapshot> querySnapshot = query.get();

            return querySnapshot.get().getDocuments().stream()
                    .map(doc -> (String) doc.get("date"))
                    .sorted(Comparator.reverseOrder())
                    .collect(Collectors.toList());
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error querying note dates: {}", e.getMessage());
            throw new RuntimeException("Failed to query note dates", e);
        }
    }

    private Map<String, Object> convertToMap(Note note) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", note.getId());
        map.put("clientId", note.getClientId());
        map.put("counselorId", note.getCounselorId());
        map.put("date", note.getDate().toString());
        map.put("content", note.getContent());
        map.put("summary", note.getSummary());
        map.put("tags", note.getTags());
        map.put("actionItems", note.getActionItems());
        map.put("createdAt", note.getCreatedAt());
        map.put("updatedAt", note.getUpdatedAt());
        map.put("googleSheetId", note.getGoogleSheetId());
        return map;
    }

    private Note convertToNote(Map<String, Object> data, String id) {
        Note note = new Note();
        note.setId(id);
        note.setClientId((String) data.get("clientId"));
        note.setCounselorId((String) data.get("counselorId"));
        note.setDate(LocalDate.parse((String) data.get("date")));
        note.setContent((String) data.get("content"));
        note.setSummary((String) data.get("summary"));

        @SuppressWarnings("unchecked")
        List<String> tags = (List<String>) data.get("tags");
        note.setTags(tags);

        @SuppressWarnings("unchecked")
        List<String> actionItems = (List<String>) data.get("actionItems");
        note.setActionItems(actionItems);

        note.setCreatedAt((Date) data.get("createdAt"));
        note.setUpdatedAt((Date) data.get("updatedAt"));
        note.setGoogleSheetId((String) data.get("googleSheetId"));
        return note;
    }
}