package com.faiz.smartexpensetrackerapi.repository;

import com.faiz.smartexpensetrackerapi.entity.Budget;
import com.faiz.smartexpensetrackerapi.entity.User;
import com.faiz.smartexpensetrackerapi.enums.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BudgetRepository extends JpaRepository<Budget, Long> {
    Optional<Budget> findByUserAndCategoryAndMonthAndYear(User user, Category category, Integer month, Integer year);
    List<Budget> findByUserAndMonthAndYear(User user, Integer month, Integer year);
}