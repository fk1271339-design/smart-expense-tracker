package com.faiz.smartexpensetrackerapi.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
public class MonthlyTrendResponse {
    private Integer month;
    private BigDecimal income;
    private BigDecimal expense;
}