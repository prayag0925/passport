# 🔐 Passport.js — EduAdmin Project

---

## 🤔 What is Passport.js?
Passport.js is like a **security guard** that checks who can login and who cannot!

---

## ⚙️ How it Works in Our Project
User enters Email + Password
↓
Passport checks database
↓
bcrypt compares password
↓
✅ Correct → Session created → Dashboard
❌ Wrong → Error message → Login page

---

## 📁 Files Used

| File | Purpose |
|---|---|
| `config/passportLocal.js` | Login strategy defined |
| `middleware/auth.js` | Page restriction using isAuthenticated() |
| `controllers/adminController.js` | passport.authenticate() called |
| `app.js` | Passport initialized |

---

## 🛡️ Restricted Middleware

- `checkAuth` → Checks if user is logged in using `isAuthenticated()`
- ✅ Logged in → Page accessible
- ❌ Not logged in → Redirected to Login

---

## 🎥 Demo Video
📁 

https://github.com/user-attachments/assets/b37374cb-c4e4-40c5-a2f0-dde817cc1f4c


- Tested wrong email → Error shown
- Tested wrong password → Error shown
- Tested correct login → Dashboard opened

---

*EduAdmin Project — Node.js + Express + MongoDB* 🚀

