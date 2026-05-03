package com.faiz.smartexpensetrackerapi.entity;

import com.faiz.smartexpensetrackerapi.enums.Category;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "budgets",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "category", "month", "year"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Budget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Category category;

    @Column(nullable = false)
    private Integer month; // 1-12

    @Column(nullable = false)
    private Integer year; // e.g., 2026

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal limitAmount;
}