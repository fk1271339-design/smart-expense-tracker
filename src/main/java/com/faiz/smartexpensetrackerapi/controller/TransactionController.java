package com.faiz.smartexpensetrackerapi.controller;

import com.faiz.smartexpensetrackerapi.dto.transaction.TransactionRequest;
import com.faiz.smartexpensetrackerapi.dto.transaction.TransactionResponse;
import com.faiz.smartexpensetrackerapi.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping
    public ResponseEntity<TransactionResponse> addTransaction(@Valid @RequestBody TransactionRequest request,
                                                              Authentication authentication) {
        String userEmail = authentication.getName();
        return ResponseEntity.ok(transactionService.addTransaction(userEmail, request));
    }

    @GetMapping
    public ResponseEntity<List<TransactionResponse>> getMyTransactions(Authentication authentication) {
        String userEmail = authentication.getName();
        return ResponseEntity.ok(transactionService.getMyTransactions(userEmail));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TransactionResponse> updateTransaction(@PathVariable Long id,
                                                                 @Valid @RequestBody TransactionRequest request,
                                                                 Authentication authentication) {
        String userEmail = authentication.getName();
        return ResponseEntity.ok(transactionService.updateTransaction(userEmail, id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTransaction(@PathVariable Long id, Authentication authentication) {
        String userEmail = authentication.getName();
        transactionService.deleteTransaction(userEmail, id);
        return ResponseEntity.ok("Transaction deleted successfully");
    }
}