package com.example.server.service.chat;
import com.example.server.model.ChatMessage;
import com.example.server.repository.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatMessageService {
    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomService chatRoomService;

    public ChatMessage save(ChatMessage message) {
        var chatId = chatRoomService
                .getChatRoomId(message.getSenderId(), message.getReceiverId(), true)
                .orElseThrow(() -> new RuntimeException("Chat room could not be created or found"));
        message.setChatId(chatId);
        return chatMessageRepository.save(message);
    }

    public List<ChatMessage> getChatMessages(Long senderId, Long receiverId) {
        var chatId = chatRoomService.getChatRoomId(senderId, receiverId, false);
        return chatId.map(chatMessageRepository::findByChatId).orElse(new ArrayList<>());
    }
}