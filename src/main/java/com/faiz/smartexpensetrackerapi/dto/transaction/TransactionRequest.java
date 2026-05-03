package com.faiz.smartexpensetrackerapi.dto.transaction;

import com.faiz.smartexpensetrackerapi.enums.Category;
import com.faiz.smartexpensetrackerapi.enums.TransactionType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class TransactionRequest {

    @NotNull(message = "Type is required")
    private TransactionType type;

    @NotNull(message = "Category is required")
    private Category category;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    private BigDecimal amount;

    @NotNull(message = "Date is required")
    private LocalDate date;

    private String note;
}