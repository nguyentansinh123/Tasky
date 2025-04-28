package com.example.server.controller;

import com.example.server.dto.ChatMessageDTO;
import com.example.server.model.ChatMessage;
import com.example.server.model.User;
import com.example.server.repository.UserRepository;
import com.example.server.response.ApiResponse;
import com.example.server.service.chat.ChatMessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/chat")
@RequiredArgsConstructor
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatMessageService chatMessageService;
    private final UserRepository userRepository;

    @MessageMapping("/chat")
    public void processMessage(@Payload ChatMessageDTO chatMessageDTO) {
        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setSenderId(chatMessageDTO.getSenderId());
        chatMessage.setReceiverId(chatMessageDTO.getReceiverId());
        chatMessage.setContent(chatMessageDTO.getContent());

        ChatMessage savedMessage = chatMessageService.save(chatMessage);

        messagingTemplate.convertAndSendToUser(
                String.valueOf(chatMessage.getReceiverId()),
                "/queue/messages",
                savedMessage
        );
    }

    @GetMapping("/messages/{receiverId}")
    public ResponseEntity<ApiResponse> getChatMessages(@PathVariable Long receiverId) {
        try {
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            User currentUser = userRepository.findByEmail(email);
            if (currentUser == null) {
                return ResponseEntity.badRequest().body(new ApiResponse("User not found", false, null));
            }

            Long senderId = currentUser.getId();
            List<ChatMessage> messages = chatMessageService.getChatMessages(senderId, receiverId);

            return ResponseEntity.ok(new ApiResponse("Messages retrieved successfully", true, messages));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(e.getMessage(), false, null));
        }
    }

    @GetMapping("/users/available")
    public ResponseEntity<ApiResponse> getAvailableUsers() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(email);

        List<User> allUsers = userRepository.findAll();
        // Remove current user from the list
        allUsers.removeIf(user -> user.getId().equals(currentUser.getId()));

        return ResponseEntity.ok(new ApiResponse("Users retrieved successfully", true, allUsers));
    }
}