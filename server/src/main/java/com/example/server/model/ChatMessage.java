package com.example.server.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class ChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String chatId;
    private Long senderId;
    private Long receiverId;
    private String content;

    @Temporal(TemporalType.TIMESTAMP)
    private Date timestamp;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_user_id", insertable = false, updatable = false)
    @JsonIgnore
    private User sender;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiver_user_id", insertable = false, updatable = false)
    @JsonIgnore
    private User receiver;

    @PrePersist
    public void prePersist() {
        if (timestamp == null) {
            timestamp = new Date();
        }
    }
}