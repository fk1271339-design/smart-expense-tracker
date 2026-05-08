# Smart Expense Tracker

A full-stack Expense Management System built with **Spring Boot** (Backend) and **Next.js** (Frontend). This application allows users to track income, manage expenses, set budgets, and visualize financial analytics with JWT-based security.

---

## 🚀 Features

### 🔙 Backend (Spring Boot)
- **Authentication & Security:** 
  - JWT-based authentication (Login/Register).
  - Role-based access control (Spring Security).
  - Password encryption using BCrypt.
- **Transaction Management:**
  - Full CRUD operations for Income and Expenses.
  - Category-based classification.
- **Budgeting System:**
  - Monthly category-wise budget limits.
  - Real-time budget status alerts: `SAFE`, `WARNING`, `EXCEEDED`.
- **Analytics Engine:**
  - Category-wise expense breakdown.
  - Monthly income vs. expense reports.
  - Trend data for visual charts.
- **API Documentation:**
  - Integrated Swagger/OpenAPI UI for easy testing.

### 🎨 Frontend (Next.js)
- **Responsive Dashboard:** Overview of total balance, recent transactions, and budget status.
- **Authentication Flow:** Modern Login and Registration pages.
- **Transaction Tracking:** Detailed views for adding, editing, and listing transactions.
- **Budget Management:** Visual progress bars for budget tracking.
- **Analytics Visuals:** Interactive charts and graphs for financial insights.
- **UI/UX:** Built with Tailwind CSS and Shadcn UI for a clean, professional look.

---

## 🛠 Tech Stack

### Backend
- **Java 17** & **Spring Boot 3**
- **Spring Security** (JWT)
- **Spring Data JPA**
- **MySQL** (Database)
- **Lombok** & **Validation**
- **Swagger/OpenAPI**
- **Maven** (Build Tool)

### Frontend
- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Shadcn UI** (Component Library)
- **Lucide React** (Icons)
- **Axios** (API Requests)

---

## 📁 Project Structure

### Backend (`/src/main/java/...`)
```text
com.faiz.smartexpensetrackerapi
 ┣ 📂 config          # Security, Web, and OpenAPI configurations
 ┣ 📂 controller      # REST Controllers (Auth, Analytics, Budget, Transactions)
 ┣ 📂 dto             # Data Transfer Objects for API requests/responses
 ┣ 📂 entity          # JPA Entities (User, Transaction, Budget)
 ┣ 📂 enums           # Enums (Role, TransactionType, Category)
 ┣ 📂 repository      # Spring Data JPA Repositories
 ┣ 📂 security        # JWT Service, Filter, and Custom User Details
 ┗ 📂 service         # Business Logic Implementation
```

### Frontend (`/smart-expense-tracker-frontend`)
```text
src/
 ┣ 📂 app             # Next.js App Router (Pages: Dashboard, Login, Register, etc.)
 ┣ 📂 components      
 ┃ ┣ 📂 features      # Domain-specific components (Forms, Tables)
 ┃ ┣ 📂 layout        # Shared layouts (Dashboard Layout)
 ┃ ┗ 📂 ui            # Reusable UI components (Button, Card, Dialog, etc.)
 ┣ 📂 hooks           # Custom React hooks (useAuth)
 ┣ 📂 lib             # API configuration and utility functions
 ┗ 📂 styles          # Global CSS
```

---

## ⚙️ Setup & Installation

### 1. Prerequisites
- JDK 17 or higher
- Node.js 18+ & npm
- MySQL Server

### 2. Backend Setup
1. Clone the repository.
2. Configure your MySQL credentials in `src/main/resources/application.yml`.
3. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```
4. Access Swagger UI: `http://localhost:8080/swagger-ui.html`

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd smart-expense-tracker-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Access the app: `http://localhost:3000`

---

## 🔒 Security
The project uses **JWT (JSON Web Tokens)** for secure communication.
- Tokens are generated upon successful login.
- Most API endpoints require the `Authorization: Bearer <token>` header.

---

## 📝 License
This project is licensed under the MIT License.
