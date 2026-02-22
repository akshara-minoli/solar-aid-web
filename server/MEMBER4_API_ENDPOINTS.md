# 🌞 MEMBER 4 - API ENDPOINTS QUICK REFERENCE

## 🎯 All Endpoints at a Glance

### **🎓 EDUCATION CONTENT** (`/api/education`)

```
✅ GET    /api/education                    - Get all published content
✅ GET    /api/education/:id                - Get single content (public read)
✅ GET    /api/education/category/:category - Filter by category
⚡ POST   /api/education                    - Create content (Auth+Admin)
⚡ PUT    /api/education/:id                - Update content (Auth+Owner)
⚡ DELETE /api/education/:id                - Delete content (Auth+Owner)
⚡ PUT    /api/education/:id/like           - Like/Unlike content (Auth)
```

**Categories**: Solar Basics | System Installation | Maintenance | Safety Tips | Benefits | Cost Analysis | FAQ | Video Tutorial

**Content Types**: Article | Video | PDF | Infographic | Interactive

**Difficulty Levels**: Beginner | Intermediate | Advanced

**Response Example:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Solar Panel Installation Guide",
    "category": "System Installation",
    "description": "Complete guide for installing solar panels",
    "content": "...",
    "contentType": "Article",
    "author": { "fullName": "Admin", "email": "admin@example.com" },
    "tags": ["solar", "installation", "guide"],
    "difficulty": "Intermediate",
    "isPublished": true,
    "views": 245,
    "likes": 18,
    "createdAt": "2026-02-21T10:30:00Z",
    "updatedAt": "2026-02-21T10:30:00Z"
  }
}
```

---

### **🔔 NOTIFICATIONS** (`/api/notifications`)

```
✅ GET    /api/notifications                  - Get my notifications (Auth)
✅ GET    /api/notifications/all              - Get all (Auth+Admin)
✅ GET    /api/notifications/:id              - Get single (Auth)
⚡ POST   /api/notifications                  - Create notification (Auth+Admin)
⚡ POST   /api/notifications/bulk             - Send to multiple users (Auth+Admin)
⚡ PUT    /api/notifications/:id/read         - Mark as read (Auth)
⚡ PUT    /api/notifications/mark-all/read    - Mark all as read (Auth)
⚡ PUT    /api/notifications/:id/archive      - Archive (Auth)
⚡ DELETE /api/notifications/:id              - Delete (Auth)
```

**Notification Types**: Maintenance Reminder | New Subsidy | Education Alert | System Update | Service Notification | General

**Status**: Sent | Read | Archived

**Priority**: Low | Medium | High

**Response Example:**
```json
{
  "success": true,
  "unreadCount": 3,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "userId": "507f1f77bcf86cd799439000",
      "title": "Maintenance Reminder",
      "message": "Your solar system needs maintenance",
      "notificationType": "Maintenance Reminder",
      "priority": "High",
      "status": "Sent",
      "readAt": null,
      "expiresAt": "2026-03-23T10:30:00Z",
      "createdAt": "2026-02-21T10:30:00Z"
    }
  ]
}
```

---

### **⭐ FEEDBACK & REVIEWS** (`/api/feedback`)

```
✅ GET    /api/feedback/my                - Get my feedback (Auth)
✅ GET    /api/feedback                   - Get all (Auth+Admin)
✅ GET    /api/feedback/:id               - Get details (Auth+Admin)
✅ GET    /api/feedback/stats             - Get statistics (Auth+Admin)
⚡ POST   /api/feedback                   - Submit feedback (Public/Auth)
⚡ PUT    /api/feedback/:id/approve       - Approve (Auth+Admin)
⚡ PUT    /api/feedback/:id/reject        - Reject (Auth+Admin)
⚡ DELETE /api/feedback/:id               - Delete (Auth+Owner)
```

**Feedback Types**: General Feedback | Service Review | Content Review | Bug Report | Feature Request | System Improvement

**Rating**: 1-5 stars

**Status**: Pending | Approved | Rejected | Under Review

**Request Example:**
```json
{
  "feedbackType": "Service Review",
  "rating": 5,
  "title": "Excellent Service",
  "message": "The system helped me plan my solar setup perfectly",
  "relatedEntityType": "System",
  "isAnonymous": false,
  "attachments": []
}
```

**Response Example:**
```json
{
  "success": true,
  "stats": {
    "totalFeedback": 245,
    "approvedFeedback": 220,
    "pendingFeedback": 15,
    "rejectedFeedback": 10,
    "averageRating": 4.67,
    "feedbackByType": [
      { "_id": "Service Review", "count": 120 },
      { "_id": "General Feedback", "count": 80 },
      { "_id": "Bug Report", "count": 25 },
      { "_id": "Feature Request", "count": 20 }
    ],
    "ratingDistribution": [
      { "_id": 5, "count": 180 },
      { "_id": 4, "count": 45 },
      { "_id": 3, "count": 15 },
      { "_id": 2, "count": 5 }
    ]
  }
}
```

---

## 📊 API STATISTICS

| Endpoint Group | Total Endpoints | Public | Protected | Admin-Only |
|---|---|---|---|---|
| Education | 7 | 3 | 2 | 2 |
| Notifications | 9 | 0 | 9 | 2 |
| Feedback | 8 | 1 | 7 | 3 |
| **TOTAL** | **24** | **4** | **18** | **7** |

---

## 🔐 AUTHENTICATION REQUIREMENTS

```
PUBLIC (No Auth)        ✅ Get education list
                        ✅ Get single education
                        ✅ Get education by category
                        ✅ Submit feedback

USER (Auth Required)    ✅ Get my notifications
                        ✅ Mark notification as read
                        ✅ Get my feedback
                        ✅ Like education content

ADMIN (Auth + Admin)    ✅ Create education content
                        ✅ Send notifications
                        ✅ Send bulk notifications
                        ✅ Approve/Reject feedback
                        ✅ View all feedback
```

---

## 🚀 QUICK API CALLS

### **1. Get All Education Content**
```bash
curl http://localhost:5000/api/education
```

### **2. Create Education Content (Admin)**
```bash
curl -X POST http://localhost:5000/api/education \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Solar Efficiency Tips",
    "category": "Benefits",
    "description": "Tips to maximize solar efficiency",
    "content": "Here are the best practices...",
    "contentType": "Article",
    "difficulty": "Beginner",
    "tags": ["efficiency", "tips", "solar"]
  }'
```

### **3. Get User Notifications**
```bash
curl http://localhost:5000/api/notifications \
  -H "Authorization: Bearer TOKEN"
```

### **4. Send Bulk Notifications (Admin)**
```bash
curl -X POST http://localhost:5000/api/notifications/bulk \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userIds": ["id1", "id2", "id3"],
    "title": "Maintenance Alert",
    "message": "Schedule your system maintenance",
    "notificationType": "Maintenance Reminder",
    "priority": "High"
  }'
```

### **5. Submit Feedback**
```bash
curl -X POST http://localhost:5000/api/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "feedbackType": "General Feedback",
    "rating": 4,
    "title": "Good Experience",
    "message": "The system is user-friendly",
    "isAnonymous": false
  }'
```

### **6. Approve Feedback (Admin)**
```bash
curl -X PUT http://localhost:5000/api/feedback/507f1f77bcf86cd799439012/approve \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "adminNotes": "Great feedback, will implement suggestion"
  }'
```

### **7. Get Feedback Statistics (Admin)**
```bash
curl http://localhost:5000/api/feedback/stats \
  -H "Authorization: Bearer TOKEN"
```

### **8. Mark All Notifications as Read**
```bash
curl -X PUT http://localhost:5000/api/notifications/mark-all/read \
  -H "Authorization: Bearer TOKEN"
```

---

## 💡 COMMON QUERY PARAMETERS

### **Education Content Filters**
```
GET /api/education?category=Solar Basics&difficulty=Beginner&contentType=Article&search=solar
```

### **Notifications Filters**
```
GET /api/notifications?status=Sent&priority=High&notificationType=Education Alert
```

### **Feedback Filters**
```
GET /api/feedback?status=Pending&feedbackType=Bug Report&rating=5
```

---

## ✨ SPECIAL FEATURES

### **1. Education Content Features**
- ✅ Auto-increment views when accessed
- ✅ Like/Unlike functionality
- ✅ Smart search by title, description, tags
- ✅ Category filtering
- ✅ Difficulty levels for learning paths
- ✅ Support for multiple content types

### **2. Notification Features**
- ✅ Auto-expiration (30 days TTL)
- ✅ Unread count tracking
- ✅ Bulk sending capability
- ✅ Link to related content/services
- ✅ Read/Archive status management
- ✅ Priority-based sorting

### **3. Feedback Features**
- ✅ Anonymous submission option
- ✅ 5-star rating system
- ✅ Attachment support
- ✅ Admin approval workflow
- ✅ Statistical analysis (avg rating, distribution)
- ✅ Category-based organization

---

## 📋 ERROR RESPONSES

All endpoints return standardized errors:

```json
{
  "success": false,
  "message": "Error description"
}
```

**Common Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (auth required)
- `403` - Forbidden (no permission)
- `404` - Not Found
- `500` - Server Error

---

## 🔑 SUGGESTED API KEYS FOR INTEGRATION

```env
# Twilio (SMS Notifications) - Already configured
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1234567890

# Firebase (Push Notifications) ⭐ RECOMMENDED
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_email@firebase.com
FIREBASE_DATABASE_URL=https://your-project.firebaseio.com

# SendGrid (Email) ⭐ RECOMMENDED
SENDGRID_API_KEY=SG.your_api_key
SENDGRID_FROM_EMAIL=noreply@solaraid.com

# AWS S3 (Media Storage) ⭐ RECOMMENDED
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_S3_BUCKET_NAME=solar-aid-content
AWS_REGION=us-east-1

# Google Cloud (Alternative Storage)
GOOGLE_CLOUD_PROJECT_ID=your_project_id
GOOGLE_CLOUD_PRIVATE_KEY=your_private_key
GOOGLE_CLOUD_CLIENT_EMAIL=your_email@gcloud.com
GOOGLE_CLOUD_STORAGE_BUCKET=solar-aid-bucket

# OpenAI (AI Features) - Optional
OPENAI_API_KEY=sk-your_api_key
OPENAI_ORG_ID=org-your_id
```

---

**Member 4 - Education & Communication Layer**
**Solar Aid Web Application | MERN Stack**
**Last Updated: February 21, 2026**
