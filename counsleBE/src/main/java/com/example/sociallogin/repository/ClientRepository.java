package com.example.sociallogin.repository;

import com.example.sociallogin.domain.Client;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ExecutionException;

@Slf4j
@Repository
@RequiredArgsConstructor
public class ClientRepository {

    private final Firestore firestore;
    private static final String COLLECTION_NAME = "clients";

    public Client save(Client client) {
        try {
            // 새 클라이언트인 경우 ID 생성
            if (client.getId() == null || client.getId().isEmpty()) {
                client.setId(UUID.randomUUID().toString());
            }

            DocumentReference docRef = firestore.collection(COLLECTION_NAME).document(client.getId());
            ApiFuture<WriteResult> result = docRef.set(client);

            log.info("Client saved at time: {}", result.get().getUpdateTime());
            return client;
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error saving client: {}", e.getMessage());
            throw new RuntimeException("Failed to save client", e);
        }
    }

    public Optional<Client> findById(String id) {
        try {
            DocumentReference docRef = firestore.collection(COLLECTION_NAME).document(id);
            ApiFuture<DocumentSnapshot> future = docRef.get();
            DocumentSnapshot document = future.get();

            if (document.exists()) {
                Client client = document.toObject(Client.class);
                return Optional.ofNullable(client);
            } else {
                log.info("Client not found with ID: {}", id);
                return Optional.empty();
            }
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error finding client: {}", e.getMessage());
            throw new RuntimeException("Failed to find client", e);
        }
    }

    public Optional<Client> findByName(String name) {
        try {
            Query query = firestore.collection(COLLECTION_NAME)
                    .whereEqualTo("name", name)
                    .limit(1);

            ApiFuture<QuerySnapshot> querySnapshot = query.get();
            List<QueryDocumentSnapshot> documents = querySnapshot.get().getDocuments();

            if (!documents.isEmpty()) {
                Client client = documents.get(0).toObject(Client.class);
                return Optional.ofNullable(client);
            } else {
                log.info("Client not found with name: {}", name);
                return Optional.empty();
            }
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error finding client by name: {}", e.getMessage());
            throw new RuntimeException("Failed to find client by name", e);
        }
    }

    public void delete(String id) {
        try {
            DocumentReference docRef = firestore.collection(COLLECTION_NAME).document(id);
            ApiFuture<WriteResult> writeResult = docRef.delete();

            log.info("Client deleted at time: {}", writeResult.get().getUpdateTime());
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error deleting client: {}", e.getMessage());
            throw new RuntimeException("Failed to delete client", e);
        }
    }
}