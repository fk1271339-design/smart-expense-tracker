# Smart Expense Tracker API

Smart Expense Tracker API is a Spring Boot backend application for managing income, expenses, budgets, and analytics.  
It includes JWT-based authentication, protected REST APIs, category-wise analytics, monthly reports, budget alerts, and Swagger API documentation.

---

## 🚀 Features

### Authentication
- User registration
- User login
- JWT token generation
- JWT-protected APIs

### Transactions
- Add income/expense
- Get user transactions
- Update transaction
- Delete transaction
- Category-based transaction management

### Budget Management
- Set monthly category budget
- Get monthly budgets
- Budget alert system:
  - `SAFE`
  - `WARNING`
  - `EXCEEDED`

### Analytics
- Category-wise expense analytics
- Monthly income/expense report
- Monthly trend data for charts

### API Documentation
- Swagger/OpenAPI UI integrated

---

## 🛠 Tech Stack

- Java 17
- Spring Boot
- Spring Web
- Spring Security
- JWT
- Spring Data JPA
- MySQL
- Lombok
- Validation
- Swagger/OpenAPI
- Maven

---

## 📁 Project Structure

```text
src/main/java/com/faiz/smartexpensetrackerapi
 ┣ config
 ┃ ┗ SecurityConfig.java
 ┣ controller
 ┃ ┣ AuthController.java
 ┃ ┣ TransactionController.java
 ┃ ┣ BudgetController.java
 ┃ ┗ AnalyticsController.java
 ┣ dto
 ┃ ┣ auth
 ┃ ┣ transaction
 ┃ ┣ budget
 ┃ ┗ analytics
 ┣ entity
 ┃ ┣ User.java
 ┃ ┣ Transaction.java
 ┃ ┗ Budget.java
 ┣ enums
 ┃ ┣ Role.java
 ┃ ┣ TransactionType.java
 ┃ ┗ Category.java
 ┣ repository
 ┃ ┣ UserRepository.java
 ┃ ┣ TransactionRepository.java
 ┃ ┗ BudgetRepository.java
 ┣ security
 ┃ ┣ JwtService.java
 ┃ ┣ JwtAuthFilter.java
 ┃ ┗ CustomUserDetailsService.java
 ┣ service
 ┃ ┣ AuthService.java
 ┃ ┣ TransactionService.java
 ┃ ┣ BudgetService.java
 ┃ ┗ AnalyticsService.java
 ┗ SmartExpenseTrackerApiApplication.java
