package com.faiz.smartexpensetrackerapi.dto.analytics;

import com.faiz.smartexpensetrackerapi.enums.Category;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
public class CategoryAnalyticsResponse {
    private Category category;
    private BigDecimal totalAmount;
}