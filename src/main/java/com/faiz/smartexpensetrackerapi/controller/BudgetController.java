package com.faiz.smartexpensetrackerapi.controller;

import com.faiz.smartexpensetrackerapi.dto.budget.BudgetAlertResponse;
import com.faiz.smartexpensetrackerapi.dto.budget.BudgetRequest;
import com.faiz.smartexpensetrackerapi.dto.budget.BudgetResponse;
import com.faiz.smartexpensetrackerapi.service.BudgetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class BudgetController {

    private final BudgetService budgetService;

    @PostMapping
    public ResponseEntity<BudgetResponse> setBudget(@Valid @RequestBody BudgetRequest request,
                                                    Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(budgetService.setBudget(email, request));
    }

    @GetMapping
    public ResponseEntity<List<BudgetResponse>> getBudgets(@RequestParam Integer month,
                                                           @RequestParam Integer year,
                                                           Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(budgetService.getBudgets(email, month, year));
    }

    @GetMapping("/alerts")
    public ResponseEntity<List<BudgetAlertResponse>> getAlerts(@RequestParam Integer month,
                                                               @RequestParam Integer year,
                                                               Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(budgetService.getBudgetAlerts(email, month, year));
    }
}