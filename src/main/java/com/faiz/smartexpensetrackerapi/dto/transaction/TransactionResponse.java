package com.faiz.smartexpensetrackerapi.dto.transaction;

import com.faiz.smartexpensetrackerapi.enums.Category;
import com.faiz.smartexpensetrackerapi.enums.TransactionType;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class TransactionResponse {
    private Long id;
    private TransactionType type;
    private Category category;
    private BigDecimal amount;
    private LocalDate date;
    private String note;
}