package com.example.sociallogin.repository;

import com.example.sociallogin.domain.ChatMessage;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Repository
@RequiredArgsConstructor
public class ChatRepository {

    private final Firestore firestore;
    private static final String COLLECTION_NAME = "chatMessages";

    public ChatMessage save(ChatMessage chatMessage) {
        if (chatMessage.getId() == null) {
            // 새 메시지 생성
            DocumentReference docRef = firestore.collection(COLLECTION_NAME).document();
            chatMessage.setId(docRef.getId());
        }

        // 저장 또는 업데이트
        ApiFuture<WriteResult> result = firestore.collection(COLLECTION_NAME)
                .document(chatMessage.getId()).set(chatMessage);
        try {
            result.get();
            return chatMessage;
        } catch (InterruptedException | ExecutionException e) {
            throw new RuntimeException("Failed to save chat message", e);
        }
    }

    public List<ChatMessage> findRecentChatsByUserId(String userId, int limit) {
        Query query = firestore.collection(COLLECTION_NAME)
                .whereEqualTo("userId", userId)
                .orderBy("timestamp", Query.Direction.DESCENDING)
                .limit(limit);

        ApiFuture<QuerySnapshot> querySnapshot = query.get();

        try {
            List<ChatMessage> chatMessages = new ArrayList<>();
            for (DocumentSnapshot document : querySnapshot.get().getDocuments()) {
                ChatMessage chatMessage = document.toObject(ChatMessage.class);
                chatMessages.add(chatMessage);
            }

            // 시간순 정렬 (오래된 메시지가 먼저 오도록)
            chatMessages.sort((msg1, msg2) -> msg1.getTimestamp().compareTo(msg2.getTimestamp()));

            return chatMessages;
        } catch (InterruptedException | ExecutionException e) {
            throw new RuntimeException("Failed to find chat messages", e);
        }
    }
}