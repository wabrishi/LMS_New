# Complete Hostinger Deployment Guide (MySQL Production)

This guide provides end-to-end instructions for deploying the **Online Learning Management System (LMS)** to **Hostinger** (hPanel Web Hosting or Hostinger VPS) using **MySQL** for production while maintaining zero-setup **SQLite** on your local machine.

---

## 🎯 Architecture Summary

- **Local Machine**: Runs on **SQLite** (`prisma/dev.db`) with dummy/default data pre-populated via `npm run db:dev:setup`. No local MySQL server required!
- **Hostinger Production**: Runs on **Hostinger MySQL Database** with production Prisma schema (`prisma/schema.prisma`) and Express REST API backend server.

---

## 📋 Step 1: Create MySQL Database in Hostinger hPanel

1. Log into your **Hostinger Account** and navigate to **hPanel** (Control Panel).
2. Go to **Databases** ➔ **MySQL Databases**.
3. Create a new database:
   - **Database Name**: e.g., `u123456789_online_lms`
   - **MySQL Username**: e.g., `u123456789_lmsuser`
   - **Password**: Enter a strong password (e.g., `HostingerSecurePass2026!`)
4. Click **Create**. Note down the full Database Name, Username, and Password.

---

## 📁 Step 2: Deploy Code to Hostinger

### Option A: Via Hostinger Node.js Application Manager (hPanel Web Hosting)

1. Go to **hPanel** ➔ **Advanced** ➔ **Setup Node.js App**.
2. Click **Create Application**:
   - **Node.js version**: Choose `18.x` or `20.x`
   - **Application Mode**: `Production`
   - **Application Root**: `onlineclass` (or public directory)
   - **Application URL**: Select your domain name (e.g., `https://yourdomain.com`)
   - **Application Startup File**: `server/index.js` (or compiled entry point)
3. Click **Create**.

### Option B: Via Hostinger VPS / SSH Git Deployment

1. Connect to your Hostinger VPS via SSH:
   ```bash
   ssh root@YOUR_HOSTINGER_VPS_IP
   ```
2. Clone your repository:
   ```bash
   git clone https://github.com/youraccount/OnlineClass.git /var/www/onlineclass
   cd /var/www/onlineclass
   npm install
   ```

---

## ⚙️ Step 3: Configure Environment Variables on Hostinger

In your Hostinger Node.js App Manager (or `.env` file on your VPS), set the following environment variables:

```env
# Hostinger MySQL Database URL Format:
# mysql://MYSQL_USER:MYSQL_PASSWORD@localhost:3306/MYSQL_DATABASE
DATABASE_URL="mysql://u123456789_lmsuser:HostingerSecurePass2026!@localhost:3306/u123456789_online_lms"

# JWT Secret & Port
JWT_SECRET="edupulse_production_secret_jwt_2026"
PORT=5000
NODE_ENV="production"
VITE_API_BASE_URL="https://yourdomain.com/api/v1"
```

---

## 🗄️ Step 4: Import Database Schema & Seed Production Data

You have **two easy methods** to initialize your Hostinger MySQL database:

### Method A: Via Hostinger phpMyAdmin (Recommended for cPanel / hPanel)
1. In Hostinger **hPanel**, go to **Databases** ➔ **phpMyAdmin** and click **Enter phpMyAdmin** next to your database.
2. Click on the **Import** tab at the top.
3. Click **Choose File** and select `prisma/production_init.sql` from your project directory.
4. Click **Go** at the bottom. This will create all 10 core tables and populate minimal production data.

### Method B: Via Hostinger SSH / Command Line
```bash
# 1. Push Prisma Schema to Hostinger MySQL
npm run db:prod:push

# 2. Seed Initial Production Data
npm run db:prod:seed
```

---

## 🔑 Dedicated Production Credentials (NOT shared with Development)

| Role | Production Email | Production Password |
| :--- | :--- | :--- |
| **Production Super Admin** | `sysadmin@yourdomain.com` | `ProdAdminSecure#2026!` |
| **Production Faculty Lead** | `head.faculty@yourdomain.com` | `FacultyProdSecure#2026!` |
| **Production Student Demo** | `student.demo@yourdomain.com` | `StudentProdSecure#2026!` |

> [!CAUTION]
> Development credentials (`admin@institute.edu`, `faculty@institute.edu`, `student@institute.edu` / `SuperSecurePass123!`) are **strictly isolated to local SQLite** and are NOT present in the production database.

---

## 🚀 Step 5: Build Frontend & Start Server

1. **Build Production Assets**:
   ```bash
   npm run build
   ```

2. **Start Express Server**:
   - On Hostinger Node.js Manager: Click **Restart Application**.
   - On Hostinger VPS (using PM2):
     ```bash
     pm2 start ecosystem.config.cjs
     pm2 save
     ```

---

## 🔒 Step 6: Enable Free SSL Certificate & Domain Routing

1. In Hostinger hPanel, navigate to **Security** ➔ **SSL**.
2. Click **Install SSL** on your domain to enable `https://`.
3. Check `https://yourdomain.com/api/v1/health` in your browser. It should return:
   ```json
   {
     "success": true,
     "status": "UP",
     "database": "MySQL connected"
   }
   ```

---

## 💻 Local Machine Quickstart (SQLite)

When developing locally on your laptop/PC:

```bash
# 1. Setup local SQLite database & seed dummy data in 1 command
npm run db:dev:setup

# 2. Run local frontend
npm run dev

# 3. Run local backend (uses dev.db SQLite)
npm run server
```

### Local Demo Credentials:
- **Super Admin**: `admin@institute.edu` | Password: `SuperSecurePass123!`
- **Faculty**: `faculty@institute.edu` | Password: `SuperSecurePass123!`
- **Student**: `student@institute.edu` | Password: `SuperSecurePass123!`
