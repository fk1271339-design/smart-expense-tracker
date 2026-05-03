package com.faiz.smartexpensetrackerapi.service;

import com.faiz.smartexpensetrackerapi.dto.budget.BudgetAlertResponse;
import com.faiz.smartexpensetrackerapi.dto.budget.BudgetRequest;
import com.faiz.smartexpensetrackerapi.dto.budget.BudgetResponse;

import java.util.List;

public interface BudgetService {
    BudgetResponse setBudget(String userEmail, BudgetRequest request);
    List<BudgetResponse> getBudgets(String userEmail, Integer month, Integer year);
    List<BudgetAlertResponse> getBudgetAlerts(String userEmail, Integer month, Integer year);
}