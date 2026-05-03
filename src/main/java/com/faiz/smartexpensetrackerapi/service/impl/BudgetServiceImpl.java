package com.faiz.smartexpensetrackerapi.service.impl;

import com.faiz.smartexpensetrackerapi.dto.budget.BudgetAlertResponse;
import com.faiz.smartexpensetrackerapi.dto.budget.BudgetRequest;
import com.faiz.smartexpensetrackerapi.dto.budget.BudgetResponse;
import com.faiz.smartexpensetrackerapi.entity.Budget;
import com.faiz.smartexpensetrackerapi.entity.User;
import com.faiz.smartexpensetrackerapi.enums.TransactionType;
import com.faiz.smartexpensetrackerapi.repository.BudgetRepository;
import com.faiz.smartexpensetrackerapi.repository.TransactionRepository;
import com.faiz.smartexpensetrackerapi.repository.UserRepository;
import com.faiz.smartexpensetrackerapi.service.BudgetService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BudgetServiceImpl implements BudgetService {

    private final BudgetRepository budgetRepository;
    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;

    @Override
    public BudgetResponse setBudget(String userEmail, BudgetRequest request) {
        User user = getUser(userEmail);

        Budget budget = budgetRepository
                .findByUserAndCategoryAndMonthAndYear(user, request.getCategory(), request.getMonth(), request.getYear())
                .orElse(Budget.builder()
                        .user(user)
                        .category(request.getCategory())
                        .month(request.getMonth())
                        .year(request.getYear())
                        .build());

        budget.setLimitAmount(request.getLimitAmount());

        Budget saved = budgetRepository.save(budget);
        return mapToBudgetResponse(saved);
    }

    @Override
    public List<BudgetResponse> getBudgets(String userEmail, Integer month, Integer year) {
        User user = getUser(userEmail);

        return budgetRepository.findByUserAndMonthAndYear(user, month, year)
                .stream()
                .map(this::mapToBudgetResponse)
                .toList();
    }

    @Override
    public List<BudgetAlertResponse> getBudgetAlerts(String userEmail, Integer month, Integer year) {
        User user = getUser(userEmail);
        List<Budget> budgets = budgetRepository.findByUserAndMonthAndYear(user, month, year);

        return budgets.stream().map(budget -> {
            BigDecimal spent = transactionRepository.sumByUserTypeCategoryAndMonthYear(
                    user,
                    TransactionType.EXPENSE,
                    budget.getCategory(),
                    month,
                    year
            );

            BigDecimal percent = BigDecimal.ZERO;
            if (budget.getLimitAmount().compareTo(BigDecimal.ZERO) > 0) {
                percent = spent.multiply(BigDecimal.valueOf(100))
                        .divide(budget.getLimitAmount(), 2, RoundingMode.HALF_UP);
            }

            String level;
            String message;

            if (percent.compareTo(BigDecimal.valueOf(100)) >= 0) {
                level = "EXCEEDED";
                message = "Budget exceeded for " + budget.getCategory();
            } else if (percent.compareTo(BigDecimal.valueOf(80)) >= 0) {
                level = "WARNING";
                message = "Budget usage above 80% for " + budget.getCategory();
            } else {
                level = "SAFE";
                message = "Budget is under control for " + budget.getCategory();
            }

            return BudgetAlertResponse.builder()
                    .category(budget.getCategory())
                    .month(month)
                    .year(year)
                    .limitAmount(budget.getLimitAmount())
                    .spentAmount(spent)
                    .usagePercent(percent)
                    .alertLevel(level)
                    .message(message)
                    .build();
        }).toList();
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private BudgetResponse mapToBudgetResponse(Budget budget) {
        return BudgetResponse.builder()
                .id(budget.getId())
                .category(budget.getCategory())
                .month(budget.getMonth())
                .year(budget.getYear())
                .limitAmount(budget.getLimitAmount())
                .build();
    }
}