package com.example.sociallogin.repository;

import com.example.sociallogin.domain.User;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.concurrent.ExecutionException;

@Repository
@RequiredArgsConstructor
public class UserRepository {

    private final Firestore firestore;
    private static final String COLLECTION_NAME = "users";

    public User save(User user) {
        if (user.getId() == null) {
            // 새 사용자 생성
            DocumentReference docRef = firestore.collection(COLLECTION_NAME).document();
            user.setId(docRef.getId());
        }

        // 저장 또는 업데이트
        ApiFuture<WriteResult> result = firestore.collection(COLLECTION_NAME).document(user.getId()).set(user);
        try {
            result.get();
            return user;
        } catch (InterruptedException | ExecutionException e) {
            throw new RuntimeException("Failed to save user", e);
        }
    }

    public Optional<User> findByEmail(String email) {
        Query query = firestore.collection(COLLECTION_NAME).whereEqualTo("email", email).limit(1);
        ApiFuture<QuerySnapshot> querySnapshot = query.get();

        try {
            for (DocumentSnapshot document : querySnapshot.get().getDocuments()) {
                User user = document.toObject(User.class);
                return Optional.ofNullable(user);
            }
            return Optional.empty();
        } catch (InterruptedException | ExecutionException e) {
            throw new RuntimeException("Failed to find user by email", e);
        }
    }

    public Optional<User> findById(String id) {
        DocumentReference docRef = firestore.collection(COLLECTION_NAME).document(id);
        ApiFuture<DocumentSnapshot> documentSnapshot = docRef.get();

        try {
            DocumentSnapshot document = documentSnapshot.get();
            if (document.exists()) {
                User user = document.toObject(User.class);
                return Optional.ofNullable(user);
            } else {
                return Optional.empty();
            }
        } catch (InterruptedException | ExecutionException e) {
            throw new RuntimeException("Failed to find user by id", e);
        }
    }
}