package com.example.server.model;

import com.example.server.enums.TaskStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Entity
@NoArgsConstructor
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY )
    private Long id;
    private String taskName;
    private boolean flexibleDate;
    private String description;
    private String location;

    @Enumerated(EnumType.STRING)
    private TaskStatus status;

    @Column(nullable = false)
    private LocalDateTime taskDate;

    @Column(nullable = false)
    private LocalDateTime dueDate;

    @Column(precision = 10, scale = 2)
    private BigDecimal budget;

    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Image> images;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User uploaduser;

    @ManyToOne
    @JoinColumn(name = "user_id_accepted")
    private User acceptedUser;

    public Task(String taskName,
                boolean flexibleDate,
                String description,
                String location,
                TaskStatus status,
                LocalDateTime taskDate,
                LocalDateTime dueDate,
                BigDecimal budget,
                Category category) {
        this.taskName = taskName;
        this.flexibleDate = flexibleDate;
        this.description = description;
        this.location = location;
        this.status = status;
        this.taskDate = taskDate;
        this.dueDate = dueDate;
        this.budget = budget;
        this.category = category;
    }

}
