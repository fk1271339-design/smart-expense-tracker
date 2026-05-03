package com.faiz.smartexpensetrackerapi.service.impl;

import com.faiz.smartexpensetrackerapi.dto.transaction.TransactionRequest;
import com.faiz.smartexpensetrackerapi.dto.transaction.TransactionResponse;
import com.faiz.smartexpensetrackerapi.entity.Transaction;
import com.faiz.smartexpensetrackerapi.entity.User;
import com.faiz.smartexpensetrackerapi.repository.TransactionRepository;
import com.faiz.smartexpensetrackerapi.repository.UserRepository;
import com.faiz.smartexpensetrackerapi.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    @Override
    public TransactionResponse addTransaction(String userEmail, TransactionRequest request) {
        User user = getUserByEmail(userEmail);

        Transaction transaction = Transaction.builder()
                .user(user)
                .type(request.getType())
                .category(request.getCategory())
                .amount(request.getAmount())
                .date(request.getDate())
                .note(request.getNote())
                .build();

        Transaction saved = transactionRepository.save(transaction);
        return mapToResponse(saved);
    }

    @Override
    public List<TransactionResponse> getMyTransactions(String userEmail) {
        User user = getUserByEmail(userEmail);
        return transactionRepository.findByUserOrderByDateDesc(user)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public TransactionResponse updateTransaction(String userEmail, Long id, TransactionRequest request) {
        User user = getUserByEmail(userEmail);

        Transaction transaction = transactionRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        transaction.setType(request.getType());
        transaction.setCategory(request.getCategory());
        transaction.setAmount(request.getAmount());
        transaction.setDate(request.getDate());
        transaction.setNote(request.getNote());

        Transaction updated = transactionRepository.save(transaction);
        return mapToResponse(updated);
    }

    @Override
    public void deleteTransaction(String userEmail, Long id) {
        User user = getUserByEmail(userEmail);

        Transaction transaction = transactionRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        transactionRepository.delete(transaction);
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private TransactionResponse mapToResponse(Transaction transaction) {
        return TransactionResponse.builder()
                .id(transaction.getId())
                .type(transaction.getType())
                .category(transaction.getCategory())
                .amount(transaction.getAmount())
                .date(transaction.getDate())
                .note(transaction.getNote())
                .build();
    }
}