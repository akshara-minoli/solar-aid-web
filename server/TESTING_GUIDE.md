# API Testing Guide

Test your Solar Aid backend APIs using these methods:

## Method 1: Using Postman (Recommended)

1. Download Postman: https://www.postman.com/downloads/
2. Import the requests below
3. Test each endpoint

## Method 2: Using curl (Command Line)

### Test Sign Up
```bash
curl -X POST http://localhost:5000/api/auth/signup -H "Content-Type: application/json" -d "{\"fullName\":\"Test User\",\"email\":\"test@example.com\",\"phone\":\"+1234567890\",\"password\":\"password123\",\"confirmPassword\":\"password123\"}"
```

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"password\":\"password123\"}"
```

### Test Contact Form
```bash
curl -X POST http://localhost:5000/api/contact -H "Content-Type: application/json" -d "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"message\":\"This is a test message about solar panels.\"}"
```

## Method 3: Using PowerShell (Windows)

### Test Sign Up
```powershell
$body = @{
    fullName = "Test User"
    email = "test@example.com"
    phone = "+1234567890"
    password = "password123"
    confirmPassword = "password123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/signup" -Method Post -Body $body -ContentType "application/json"
```

### Test Login
```powershell
$body = @{
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -Body $body -ContentType "application/json"
```

### Test Contact Form
```powershell
$body = @{
    name = "Test User"
    email = "test@example.com"
    message = "This is a test message about solar panels."
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/contact" -Method Post -Body $body -ContentType "application/json"
```

## Expected Results

### Successful Sign Up Response:
```json
{
  "success": true,
  "message": "Account created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "fullName": "Test User",
    "email": "test@example.com",
    "phone": "+1234567890"
  }
}
```

### Successful Login Response:
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "fullName": "Test User",
    "email": "test@example.com",
    "phone": "+1234567890"
  }
}
```

### Successful Contact Form Response:
```json
{
  "success": true,
  "message": "Thank you for contacting us! We will get back to you soon.",
  "data": {
    "id": "...",
    "name": "Test User",
    "email": "test@example.com",
    "createdAt": "2026-02-09T..."
  }
}
```

## Troubleshooting

**Error: Connection refused**
- Make sure your server is running on http://localhost:5000
- Check if MongoDB is connected

**Error: User already exists**
- Try a different email address
- Or login with the existing credentials

**Error: Validation failed**
- Check that all required fields are provided
- Ensure email format is valid
- Password must be at least 6 characters

## Viewing Data in MongoDB

You can view the data stored in your MongoDB database:

1. Go to MongoDB Atlas (https://cloud.mongodb.com)
2. Navigate to your cluster
3. Click "Browse Collections"
4. You'll see two collections:
   - `users` - Contains registered users
   - `contacts` - Contains contact form submissions
