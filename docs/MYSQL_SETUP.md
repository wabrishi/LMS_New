# Production MySQL Database Setup & Deployment Guide

This guide provides step-by-step instructions to configure, migrate, seed, and run the **Enterprise Online Learning Management System (LMS)** using **MySQL 8.0+** and **Prisma ORM**.

---

## 📋 Prerequisites

Ensure you have the following installed on your host system or server:
1. **Node.js**: v18.0.0 or higher
2. **MySQL Server**: 8.0+ (Local MySQL Server, XAMPP, Docker MySQL, or Managed Cloud MySQL like AWS RDS / GCP Cloud SQL)
3. **NPM**: v9.0.0 or higher

---

## 🛠️ Step 1: Create MySQL Database

Open your MySQL Terminal, MySQL Workbench, or phpMyAdmin and execute:

```sql
CREATE DATABASE IF NOT EXISTS online_class_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

If you prefer creating a dedicated database user for security:

```sql
CREATE USER 'lms_admin'@'localhost' IDENTIFIED BY 'SuperSecurePassword2026!';
GRANT ALL PRIVILEGES ON online_class_db.* TO 'lms_admin'@'localhost';
FLUSH PRIVILEGES;
```

---

## ⚙️ Step 2: Configure Environment Variables

Create or edit `.env` in the project root folder:

```env
# MySQL Database Connection String
# Format: mysql://USER:PASSWORD@HOST:PORT/DATABASE_NAME
DATABASE_URL="mysql://root:password@localhost:3306/online_class_db"

# JWT Authentication Secret Key
JWT_SECRET="edupulse_super_secret_jwt_key_2026"

# Backend Express API Port
PORT=5000

# Frontend API Endpoint
VITE_API_BASE_URL="http://localhost:5000/api/v1"
```

---

## 🚀 Step 3: Run Prisma Database Migrations & Client Generation

1. **Generate Prisma Client**:
   ```bash
   npm run db:generate
   ```

2. **Push Schema to MySQL Database**:
   ```bash
   npm run db:push
   ```

3. **(Alternative) Create Versioned Migration**:
   ```bash
   npm run db:migrate
   ```

---

## 🌱 Step 4: Seed Database with Initial Production & Demo Data

Run the automated seeding script to populate default institutes, roles, users, courses, batches, live classes, assignments, quizzes, and certificates:

```bash
npm run db:seed
```

### Pre-configured Demo Accounts:
| Role | Email | Password |
| :--- | :--- | :--- |
| **Super Admin** | `admin@institute.edu` | `SuperSecurePass123!` |
| **Faculty** | `faculty@institute.edu` | `SuperSecurePass123!` |
| **Student** | `student@institute.edu` | `SuperSecurePass123!` |

---

## 🖥️ Step 5: Start the Backend & Frontend Servers

### Option A: Run Express Backend Server Only
```bash
npm run server
```
*API running at: `http://localhost:5000`*
*Healthcheck endpoint: `http://localhost:5000/api/v1/health`*

### Option B: Run Frontend Development Server
```bash
npm run dev
```

---

## 📊 Step 6: Visual Database Management with Prisma Studio

To inspect, query, or edit records in MySQL using a web GUI:

```bash
npm run db:studio
```
*Opens automatically at `http://localhost:5555`*

---

## 🐳 Docker Deployment Setup (Optional)

If deploying via Docker Compose, create a `docker-compose.yml`:

```yaml
version: '3.8'

services:
  mysqldb:
    image: mysql:8.0
    container_name: lms_mysql
    environment:
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: online_class_db
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

  api_server:
    build: .
    ports:
      - "5000:5000"
    environment:
      DATABASE_URL: "mysql://root:password@mysqldb:3306/online_class_db"
      JWT_SECRET: "edupulse_super_secret_jwt_key_2026"
      PORT: 5000
    depends_on:
      - mysqldb

volumes:
  mysql_data:
```

---

## 🔒 Security Best Practices for Production
1. **SSL / TLS**: Always enable `sslmode=require` or SSL connection parameters in `DATABASE_URL` for production MySQL hosts.
2. **Connection Pooling**: Adjust connection pool limit using URL parameters: `mysql://user:pass@host:3306/db?connection_limit=20`.
3. **Environment Secrets**: Never commit real database credentials or `.env` files to git version control.
