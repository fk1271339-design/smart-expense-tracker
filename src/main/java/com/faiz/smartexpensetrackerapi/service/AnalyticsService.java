package com.faiz.smartexpensetrackerapi.service;

import com.faiz.smartexpensetrackerapi.dto.analytics.CategoryAnalyticsResponse;
import com.faiz.smartexpensetrackerapi.dto.analytics.MonthlyReportResponse;
import com.faiz.smartexpensetrackerapi.dto.analytics.MonthlyTrendResponse;

import java.util.List;

public interface AnalyticsService {
    List<CategoryAnalyticsResponse> getCategoryWiseExpense(String userEmail, int month, int year);
    MonthlyReportResponse getMonthlyReport(String userEmail, int month, int year);
    List<MonthlyTrendResponse> getMonthlyTrend(String userEmail, int year);
}