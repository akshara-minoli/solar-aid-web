# Solar Aid API Documentation

Base URL: `http://localhost:5000/api`

## Authentication Endpoints

### 1. Sign Up (Register)
**Endpoint:** `POST /api/auth/signup`

**Description:** Create a new user account

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Account created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

---

### 2. Login
**Endpoint:** `POST /api/auth/login`

**Description:** Login to an existing account

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

### 3. Get Current User
**Endpoint:** `GET /api/auth/me`

**Description:** Get currently logged-in user details

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "createdAt": "2026-02-09T10:30:00.000Z"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Not authorized, no token provided"
}
```

---

## Contact Form Endpoints

### 1. Submit Contact Form
**Endpoint:** `POST /api/contact`

**Description:** Submit a contact form (public access)

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "I would like to know more about solar panels for my home."
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Thank you for contacting us! We will get back to you soon.",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2026-02-09T10:30:00.000Z"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Please provide all required fields"
}
```

---

### 2. Get All Contact Submissions
**Endpoint:** `GET /api/contact`

**Description:** Get all contact form submissions (protected - requires authentication)

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "message": "I would like to know more about solar panels.",
      "status": "new",
      "createdAt": "2026-02-09T10:30:00.000Z"
    }
  ]
}
```

---

### 3. Get Contact By ID
**Endpoint:** `GET /api/contact/:id`

**Description:** Get a specific contact submission (protected)

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "message": "I would like to know more about solar panels.",
    "status": "new",
    "createdAt": "2026-02-09T10:30:00.000Z"
  }
}
```

---

### 4. Update Contact Status
**Endpoint:** `PUT /api/contact/:id`

**Description:** Update contact submission status (protected)

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "read"
}
```

**Valid status values:** `"new"`, `"read"`, `"replied"`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Contact status updated",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "message": "I would like to know more about solar panels.",
    "status": "read",
    "createdAt": "2026-02-09T10:30:00.000Z"
  }
}
```

---

## Testing with curl

### Sign Up
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Submit Contact Form
```bash
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "message": "I would like to know more about solar panels."
  }'
```

### Get Current User (Protected)
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Error Codes

- **200** - Success
- **201** - Created successfully
- **400** - Bad request (validation error)
- **401** - Unauthorized (authentication required)
- **404** - Not found
- **500** - Internal server error

---

## Notes

- All protected routes require a valid JWT token in the Authorization header
- The token is returned upon successful signup or login
- Token format: `Bearer <token>`
- Passwords are automatically hashed using bcrypt
- Email validation is performed on all email fields
