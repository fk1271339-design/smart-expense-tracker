package com.faiz.smartexpensetrackerapi.repository;

import com.faiz.smartexpensetrackerapi.entity.Transaction;
import com.faiz.smartexpensetrackerapi.entity.User;
import com.faiz.smartexpensetrackerapi.enums.Category;
import com.faiz.smartexpensetrackerapi.enums.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByUserOrderByDateDesc(User user);

    Optional<Transaction> findByIdAndUser(Long id, User user);

    @Query("""
        SELECT COALESCE(SUM(t.amount), 0)
        FROM Transaction t
        WHERE t.user = :user
          AND t.type = :type
          AND t.category = :category
          AND YEAR(t.date) = :year
          AND MONTH(t.date) = :month
    """)
    BigDecimal sumByUserTypeCategoryAndMonthYear(@Param("user") User user,
                                                 @Param("type") TransactionType type,
                                                 @Param("category") Category category,
                                                 @Param("month") int month,
                                                 @Param("year") int year);
}