package com.faiz.smartexpensetrackerapi.service.impl;

import com.faiz.smartexpensetrackerapi.dto.analytics.CategoryAnalyticsResponse;
import com.faiz.smartexpensetrackerapi.dto.analytics.MonthlyReportResponse;
import com.faiz.smartexpensetrackerapi.dto.analytics.MonthlyTrendResponse;
import com.faiz.smartexpensetrackerapi.entity.User;
import com.faiz.smartexpensetrackerapi.enums.Category;
import com.faiz.smartexpensetrackerapi.enums.TransactionType;
import com.faiz.smartexpensetrackerapi.repository.TransactionRepository;
import com.faiz.smartexpensetrackerapi.repository.UserRepository;
import com.faiz.smartexpensetrackerapi.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AnalyticsServiceImpl implements AnalyticsService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    @Override
    public List<CategoryAnalyticsResponse> getCategoryWiseExpense(String userEmail, int month, int year) {
        User user = getUser(userEmail);

        List<Object[]> rows = transactionRepository.findCategoryWiseTotals(
                user, TransactionType.EXPENSE, month, year
        );

        List<CategoryAnalyticsResponse> result = new ArrayList<>();
        for (Object[] row : rows) {
            Category category = (Category) row[0];
            BigDecimal total = (BigDecimal) row[1];
            result.add(new CategoryAnalyticsResponse(category, total));
        }

        return result;
    }

    @Override
    public MonthlyReportResponse getMonthlyReport(String userEmail, int month, int year) {
        User user = getUser(userEmail);

        BigDecimal income = transactionRepository.sumByUserTypeAndMonthYear(
                user, TransactionType.INCOME, month, year
        );
        BigDecimal expense = transactionRepository.sumByUserTypeAndMonthYear(
                user, TransactionType.EXPENSE, month, year
        );
        BigDecimal savings = income.subtract(expense);

        return MonthlyReportResponse.builder()
                .month(month)
                .year(year)
                .totalIncome(income)
                .totalExpense(expense)
                .savings(savings)
                .build();
    }

    @Override
    public List<MonthlyTrendResponse> getMonthlyTrend(String userEmail, int year) {
        User user = getUser(userEmail);

        Map<Integer, BigDecimal> incomeMap = new HashMap<>();
        Map<Integer, BigDecimal> expenseMap = new HashMap<>();

        for (Object[] row : transactionRepository.findMonthlyTotalsByType(user, TransactionType.INCOME, year)) {
            incomeMap.put((Integer) row[0], (BigDecimal) row[1]);
        }

        for (Object[] row : transactionRepository.findMonthlyTotalsByType(user, TransactionType.EXPENSE, year)) {
            expenseMap.put((Integer) row[0], (BigDecimal) row[1]);
        }

        List<MonthlyTrendResponse> trend = new ArrayList<>();
        for (int m = 1; m <= 12; m++) {
            trend.add(MonthlyTrendResponse.builder()
                    .month(m)
                    .income(incomeMap.getOrDefault(m, BigDecimal.ZERO))
                    .expense(expenseMap.getOrDefault(m, BigDecimal.ZERO))
                    .build());
        }

        return trend;
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}