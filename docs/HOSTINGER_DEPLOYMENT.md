# Your Hostinger Account Deployment Details

We automatically detected your connected Hostinger account and existing databases!

---

## 📊 Connected Hostinger Account Summary

- **Hostinger Account ID / Username**: `u105632535`
- **Detected MySQL Database**: `u105632535_online_class`
- **Database User**: `u105632535_online_class`
- **Assigned Domain**: `skyblue-kingfisher-794068.hostingersite.com` (or your custom domain)

---

## 🔗 Direct phpMyAdmin Access Link

You can open phpMyAdmin directly for your database without entering credentials:

👉 [Click here to open phpMyAdmin for `u105632535_online_class`](https://auth-db1877.hstgr.io/signon.php?sid=M3I5ZVhaRkViOHk5QkdUbEJDd1VrWVlZWTdBNTN4N1lvTTQ0U3R2VjhJZVNPaEkrVmJ2NHdvVkwzMEdDYTEyN0U5UmFMbGJtaldCeGtyYkh6UkJ2UXY4QUlaZ2FHUlk3SnFSL1NEM0ZXRlk2MFllamxocnhJNFNRTWtRa2RRYmwwWlJ1blZPTEUwQVdiK0J0d1ozcHVzTEhMUkI5Z21SOWxPcFpka3JwT3hVc2RvVmtTVVJLVU1YT1p3ekJZdVMzK2Jack5Id1BydjJ0MHRmWWlSMXZlQT09)

---

## 🗄️ Step-by-Step phpMyAdmin Import

1. Click the phpMyAdmin link above.
2. Select your database `u105632535_online_class` on the left sidebar.
3. Click the **Import** tab at the top.
4. Click **Choose File** and select `prisma/production_init.sql` from your project directory.
5. Click **Go** at the bottom.

---

## 🔑 Production Login Credentials (NOT Shared with Local Dev)

| Account Type | Email Address | Password | Environment |
| :--- | :--- | :--- | :---: |
| **Production Super Admin** | `sysadmin@yourdomain.com` | `ProdAdminSecure#2026!` | **Hostinger Production** |
| **Production Faculty Lead** | `head.faculty@yourdomain.com` | `FacultyProdSecure#2026!` | **Hostinger Production** |
| **Production Student Demo** | `student.demo@yourdomain.com` | `StudentProdSecure#2026!` | **Hostinger Production** |

---

## ⚙️ Environment Variables for Hostinger App Manager

In your Hostinger Node.js Application settings, set:

```env
DATABASE_URL="mysql://u105632535_online_class:YOUR_DB_PASSWORD@localhost:3306/u105632535_online_class"
JWT_SECRET="edupulse_production_secret_jwt_2026"
PORT=5000
NODE_ENV="production"
```
