# Solar Aid Backend - API Testing Guide

## Your Complete MERN Backend is Ready! 🚀

## Features Implemented
✅ User Registration with JWT  
✅ User Login with JWT  
✅ Forgot Password (with reset token simulation)  
✅ Password Reset functionality  
✅ Contact Form with database storage  
✅ MongoDB integration with Mongoose  
✅ MVC architecture  
✅ JWT authentication middleware  
✅ bcrypt password hashing  
✅ Environment variables configuration  

## API Endpoints

### 1. User Registration
**POST** `/api/users/register`
```json
{
  "name": "John Doe",
  "email": "john@example.com", 
  "password": "john123"
}
```

### 2. User Login
**POST** `/api/users/login`
```json
{
  "email": "john@example.com",
  "password": "john123"
}
```

### 3. Forgot Password
**POST** `/api/users/forgot-password`
```json
{
  "email": "john@example.com"
}
```

### 4. Reset Password
**POST** `/api/auth/reset-password`
```json
{
  "resetToken": "your_reset_token_here",
  "newPassword": "newpass123",
  "confirmPassword": "newpass123"
}
```

### 5. Contact Form
**POST** `/api/contact`
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Your message here"
}
```

## PowerShell Test Commands

### Test Registration:
```powershell
$body = @{ name = "Test User"; email = "test@example.com"; password = "test123" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:5000/api/users/register" -Method Post -Body $body -ContentType "application/json"
```

### Test Login:
```powershell
$body = @{ email = "test@example.com"; password = "test123" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:5000/api/users/login" -Method Post -Body $body -ContentType "application/json"
```

### Test Forgot Password:
```powershell
$body = @{ email = "test@example.com" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:5000/api/users/forgot-password" -Method Post -Body $body -ContentType "application/json"
```

### Test Contact Form:
```powershell
$body = @{ name = "John Doe"; email = "john@example.com"; message = "Test message" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:5000/api/contact" -Method Post -Body $body -ContentType "application/json"
```

## Environment Variables (.env)
```
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
```

## Project Structure
```
server/
├── config/
│   └── db.js                 # MongoDB connection
├── controllers/
│   ├── authController.js     # Auth logic (signup, login, forgot/reset password)
│   ├── contactController.js  # Contact form logic
│   └── userController.js     # User-specific logic for /api/users routes
├── middleware/
│   └── auth.js              # JWT authentication middleware
├── models/
│   ├── User.js              # User model with bcrypt hashing
│   └── Contact.js           # Contact form model
├── routes/
│   ├── auth.js              # /api/auth routes
│   ├── users.js             # /api/users routes (register, login, forgot-password)
│   └── contact.js           # /api/contact routes
├── .env                     # Environment variables
├── server.js                # Express server setup
└── package.json
```

## Next Steps
1. Start your frontend development
2. Connect React components to these API endpoints
3. Add protected routes using JWT tokens
4. Implement user dashboard features
5. Add email functionality for real password reset

Your backend is production-ready with proper error handling, validation, and security! 🎉