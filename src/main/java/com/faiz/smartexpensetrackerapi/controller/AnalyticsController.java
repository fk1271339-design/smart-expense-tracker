package com.faiz.smartexpensetrackerapi.controller;

import com.faiz.smartexpensetrackerapi.dto.analytics.CategoryAnalyticsResponse;
import com.faiz.smartexpensetrackerapi.dto.analytics.MonthlyReportResponse;
import com.faiz.smartexpensetrackerapi.dto.analytics.MonthlyTrendResponse;
import com.faiz.smartexpensetrackerapi.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/category-wise")
    public ResponseEntity<List<CategoryAnalyticsResponse>> categoryWise(
            @RequestParam int month,
            @RequestParam int year,
            Authentication authentication) {

        String userEmail = authentication.getName();
        return ResponseEntity.ok(analyticsService.getCategoryWiseExpense(userEmail, month, year));
    }

    @GetMapping("/monthly-report")
    public ResponseEntity<MonthlyReportResponse> monthlyReport(
            @RequestParam int month,
            @RequestParam int year,
            Authentication authentication) {

        String userEmail = authentication.getName();
        return ResponseEntity.ok(analyticsService.getMonthlyReport(userEmail, month, year));
    }

    @GetMapping("/monthly-trend")
    public ResponseEntity<List<MonthlyTrendResponse>> monthlyTrend(
            @RequestParam int year,
            Authentication authentication) {

        String userEmail = authentication.getName();
        return ResponseEntity.ok(analyticsService.getMonthlyTrend(userEmail, year));
    }
}