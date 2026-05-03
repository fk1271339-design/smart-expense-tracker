package com.faiz.smartexpensetrackerapi.dto.budget;

import com.faiz.smartexpensetrackerapi.enums.Category;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class BudgetResponse {
    private Long id;
    private Category category;
    private Integer month;
    private Integer year;
    private BigDecimal limitAmount;
}