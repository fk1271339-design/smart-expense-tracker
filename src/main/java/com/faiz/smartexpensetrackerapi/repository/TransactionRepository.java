package com.faiz.smartexpensetrackerapi.repository;

import com.faiz.smartexpensetrackerapi.entity.Transaction;
import com.faiz.smartexpensetrackerapi.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByUserOrderByDateDesc(User user);
    Optional<Transaction> findByIdAndUser(Long id, User user);
}