package com.example.server.service.chat;


import com.example.server.model.ChatRoom;
import com.example.server.repository.ChatRoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ChatRoomService {

    private final ChatRoomRepository chatRoomRepository;

    public Optional<String> getChatRoomId(
            Long senderId,
            Long receiverId,
            boolean createRoomIfNotExist
    ) {
        return chatRoomRepository
                .findBySenderIdAndReceiverId(senderId, receiverId)
                .map(ChatRoom::getChatId)
                .or(() -> {
                    if (createRoomIfNotExist) {
                        var newChatRoomId = createChatId(senderId, receiverId);
                        return Optional.of(newChatRoomId);
                    }
                    return Optional.empty();
                });
    }

    private String createChatId(Long senderId, Long receiverId) {
        var chatId = String.format("%s_%s", senderId, receiverId);

        ChatRoom senderReceiver = ChatRoom
                .builder()
                .chatId(chatId)
                .senderId(senderId)
                .receiverId(receiverId)
                .build();

        ChatRoom receiverSender = ChatRoom
                .builder()
                .chatId(chatId)
                .senderId(receiverId)
                .receiverId(senderId)
                .build();

        chatRoomRepository.save(senderReceiver);
        chatRoomRepository.save(receiverSender);

        return chatId;
    }
}