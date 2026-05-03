package com.faiz.smartexpensetrackerapi.dto.budget;

import com.faiz.smartexpensetrackerapi.enums.Category;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class BudgetRequest {

    @NotNull(message = "Category is required")
    private Category category;

    @NotNull(message = "Month is required")
    @Min(value = 1, message = "Month must be between 1 and 12")
    @Max(value = 12, message = "Month must be between 1 and 12")
    private Integer month;

    @NotNull(message = "Year is required")
    @Min(value = 2000, message = "Year must be valid")
    private Integer year;

    @NotNull(message = "Limit amount is required")
    @DecimalMin(value = "0.01", message = "Limit must be greater than 0")
    private BigDecimal limitAmount;
}