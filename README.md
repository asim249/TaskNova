# TaskNova 🚀

A secure and modern Full stack task management application with OTP email verification, JWT authentication, password recovery system, and complete CRUD functionality for personal task management.

---

# ✨ Features

## 🔐 Authentication System

- User Registration
- User Login
- JWT Based Authentication
- Protected Routes
- Secure Password Hashing

---

## 📧 Email OTP Verification

- 6-Digit OTP sent to user email after registration
- OTP verification required before account activation
- OTP expires within 2 minutes for security

---

## 🔑 Forgot Password System

- Forgot Password via Email
- OTP verification for password reset
- Strong Password Validation
- Real-Time Password Strength Checking
- Confirm Password Validation

---

## ✅ Task Management (CRUD)

Authenticated users can:

- ➕ Add Tasks
- ✏️ Update Tasks
- 👀 View Tasks
- ❌ Delete Tasks

Each user can only access and manage their own tasks.

---

# 🛠️ Tech Stack

## Frontend

- Next JS (TSX)
- Tailwind CSS

## Backend

- Node.js
- Express.js

## Database

- MongoDB
- Mongoose

## Authentication & Security

- JWT (JSON Web Token)
- bcryptjs

## Email Service

- Nodemailer

---

# 🔒 Security Features

- JWT Token Authentication
- Password Hashing using bcryptjs
- OTP Expiration System
- Protected API Routes
- User-Specific Task Access
- Secure Password Reset Workflow

---

# 📂 Project Workflow

## User Registration Flow

1. User registers with email and password
2. System sends a 6-digit OTP to email
3. User enters OTP within 2 minutes
4. Account gets verified successfully

---

## Login Flow

1. User enters email and password
2. JWT token generated after successful login
3. User redirected to Task Dashboard

---

## Forgot Password Flow

1. User clicks on Forgot Password
2. User enters registered email
3. OTP sent to email
4. User verifies OTP
5. User creates new strong password
6. User logs in with updated password

---

# 📸 Main Functionalities

- Authentication Pages
- OTP Verification System
- Password Reset System
- Real-Time Password Strength Validation
- Task Dashboard
- CRUD Operations for Tasks

---

# ⚙️ Installation


## Backend Setup

```bash
cd backend
npm install
npm start
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

# 🌐 Environment Variables

Create a `.env` file inside backend folder:

```env
PORT=5000

MONGO_URI=your_mongodb_connection

JWT_SECRET=your_jwt_secret

EMAIL_USER=your_email

EMAIL_PASS=your_email_password
```

---

# 📁 Folder Structure

```bash
TaskNova/


│


├── frontend/


├── backend/


│


├── controllers/


├── models/


├── routes/


├── middleware/


├── utils/


│


└── README.md
```

---

# 🚀 Future Improvements

- Task Categories
- Task Priority Levels
- Due Dates & Reminders
- Dark Mode
- Drag & Drop Tasks
- Admin Dashboard

---

# 👨‍💻 Author

**Asim Mir**  
Junior MERN Stack Developer

---

# ⭐ Project Highlights

- Full Authentication System
- Email OTP Verification
- Secure Password Recovery
- JWT Authorization
- Complete CRUD Operations
- User-Specific Data Protection
- Beginner-Friendly Clean Architecture

---

# 📌 Conclusion

TaskNova is a complete Full stack task management application focused on authentication security, user privacy, and smooth task management experience. The project demonstrates practical implementation of modern backend authentication workflows and CRUD operations using the MERN stack.
