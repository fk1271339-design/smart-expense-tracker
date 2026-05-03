package com.faiz.smartexpensetrackerapi.service;

import com.faiz.smartexpensetrackerapi.dto.transaction.TransactionRequest;
import com.faiz.smartexpensetrackerapi.dto.transaction.TransactionResponse;

import java.util.List;

public interface TransactionService {
    TransactionResponse addTransaction(String userEmail, TransactionRequest request);
    List<TransactionResponse> getMyTransactions(String userEmail);
    TransactionResponse updateTransaction(String userEmail, Long id, TransactionRequest request);
    void deleteTransaction(String userEmail, Long id);
}