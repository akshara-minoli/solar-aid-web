# 🎨 MEMBER 4 - VISUAL ARCHITECTURE & FLOW DIAGRAMS

## 📊 System Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                       SOLAR AID PLATFORM                         │
│                    (Empowering Rural Communities)                │
└──────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     FRONTEND (React/Vite)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │  Education   │  │ Notification │  │  Feedback    │           │
│  │     Hub      │  │    Center    │  │    System    │           │
│  │              │  │              │  │              │           │
│  │ • List       │  │ • Bell       │  │ • Form       │           │
│  │ • Search     │  │ • Dropdown   │  │ • Rating     │           │
│  │ • Detail     │  │ • Read/Mark  │  │ • Admin View │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
└─────────────────────────────────────────────────────────────────┘
         ↓ HTTP/HTTPS + JWT Token ↓
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Node.js/Express)                     │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    MIDDLEWARE/SECURITY                     │ │
│  │  ┌────────────────────────────────────────────────────────┐│ │
│  │  │ JWT Authentication │ CORS │ Validation │ Error Handler││ │
│  │  └────────────────────────────────────────────────────────┘│ │
│  └────────────────────────────────────────────────────────────┘ │
│           ↓              ↓              ↓                        │
│  ┌──────────────────┬──────────────────┬──────────────────────┐ │
│  │  EDUCATION API   │  NOTIFICATION    │   FEEDBACK API       │ │
│  │  (7 endpoints)   │    API (9)       │   (8 endpoints)      │ │
│  │                  │                  │                      │ │
│  │ POST /api/edu    │ POST /notify     │ POST /feedback       │ │
│  │ GET /api/edu     │ GET /notify      │ GET /feedback        │ │
│  │ PUT /api/edu/:id │ PUT /notify/:id  │ PUT /feedback/:id    │ │
│  │ DELETE /edu/:id  │ DELETE /notify   │ DELETE /feedback     │ │
│  │                  │                  │                      │ │
│  └──────────────────┴──────────────────┴──────────────────────┘ │
│           ↓              ↓              ↓                        │
│  ┌──────────────────┬──────────────────┬──────────────────────┐ │
│  │ EducationController │ NotificationController │ FeedbackController│
│  │ • CRUD logic     │ • Notification logic   │ • Feedback logic   │
│  │ • Search         │ • Bulk send            │ • Approval flow    │
│  │ • Filter         │ • Status management    │ • Statistics       │
│  └──────────────────┴──────────────────┬──────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
         ↓          ↓          ↓
┌─────────────────────────────────────────────────────────────────┐
│               DATABASE (MongoDB)                                 │
│  ┌───────────────┬──────────────┬───────────────────────────┐  │
│  │EducationContent│  Notification  │      Feedback Collection│  │
│  │                │                │                        │  │
│  │ title          │ userId         │ userId (optional)      │  │
│  │ category       │ title          │ feedbackType           │  │
│  │ content        │ message        │ rating (1-5)           │  │
│  │ author ───────→├─ ref(User)     │ title                  │  │
│  │ views (counter)│ status         │ message                │  │
│  │ likes (counter)│ readAt         │ status                 │  │
│  │ tags []        │ expiresAt (TTL)│ isAnonymous            │  │
│  │ createdAt      │ createdAt      │ adminNotes             │  │
│  └───────────────┴──────────────┴───────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
         ↓ External APIs (Optional)↓
┌─────────────────────────────────────────────────────────────────┐
│            EXTERNAL SERVICES (Integration Layer)                 │
│  ┌──────────────┬──────────────┬──────────────┬──────────────┐ │
│  │   Firebase   │  SendGrid    │  AWS S3      │  Twilio SMS  │ │
│  │  (Push)      │  (Email)     │  (Storage)   │  (Mobile)    │ │
│  └──────────────┴──────────────┴──────────────┴──────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 DATA FLOW DIAGRAMS

### **Flow 1: Education Content (Learning)**

```
Start
  ↓
User/Admin visits "Education Hub"
  ↓
Frontend: GET /api/education
  ↓
Backend: Route → Controller → Model
  ↓
Query MongoDB: EducationContent collection
  ↓
Apply filters: category, difficulty, search
  ↓
Return: Array of content
  ↓
Frontend displays:
  • Title, description, content type
  • Author, tags, difficulty
  • Views count, likes
  ↓
User clicks → GET /api/education/:id
  ↓
Backend increments views counter
  ↓
Frontend shows full content
  ↓
User: ❤️ Like → PUT /api/education/:id/like
  ↓
Backend increments likes counter
  ↓
End (Content Learned)
```

### **Flow 2: Notifications (Communication)**

```
Event Triggered
  ↓
Admin Dashboard
  ↓
Admin selects users → POST /api/notifications/bulk
  ↓
Backend: Create notification for each user
  ↓
MongoDB: Insert notifications with:
  • userId
  • title, message
  • status: "Sent"
  • expiresAt: +30 days (TTL)
  ↓
Optional: Send Push/Email/SMS
  (Firebase/SendGrid/Twilio)
  ↓
User receives notification
  ↓
Frontend: Bell icon shows unread count
  ↓
User clicks bell → GET /api/notifications
  ↓
Backend returns unread notifications
  ↓
User reads notification
  ↓
Frontend: PUT /api/notifications/:id/read
  ↓
Backend: Update status to "Read"
  ↓
Auto-expire after 30 days (TTL index)
  ↓
End (Notification lifecycle complete)
```

### **Flow 3: Feedback (System Improvement)**

```
User Experience (Positive/Negative)
  ↓
User clicks "Send Feedback"
  ↓
Frontend: FeedbackForm component
  ↓
Fill form:
  • Type: Bug Report / Feature Request / etc
  • Rating: 1 ⭐ to 5 ⭐
  • Title: "Feedback Title"
  • Message: "Detailed feedback"
  • Attachments: [optional]
  • Anonymous: [checkbox]
  ↓
Submit: POST /api/feedback
  ↓
Backend validates:
  • Rating between 1-5 ✓
  • Title, Message not empty ✓
  • Type in enum ✓
  ↓
Create Feedback document:
  • status: "Pending"
  • createdAt: now
  ↓
Return success message to user
  ↓
Admin Dashboard
  ↓
Admin: GET /api/feedback (see all pending)
  ↓
Admin reviews feedback
  ↓
Admin: PUT /api/feedback/:id/approve
  OR
  Admin: PUT /api/feedback/:id/reject
  ↓
Update status to "Approved" or "Rejected"
  ↓
Optional: Send response email
  (SendGrid)
  ↓
Frontend: Show stats
  • Total feedback: 245
  • Average rating: 4.7
  • Distribution chart
  ↓
End (Feedback processed)
```

---

## 🎯 REQUEST/RESPONSE FLOW

### **Example 1: Get All Education Content**

```
┌─ CLIENT (React) ─────────────────────────────────┐
│                                                   │
│  useEffect(() => {                                │
│    axios.get('/api/education')                   │
│      .then(res => setContent(res.data.data))     │
│  })                                              │
│                                                   │
└──────────────────────────┬────────────────────────┘
                           │ GET /api/education
                           ↓
┌─ SERVER (Express) ───────────────────────────────┐
│                                                   │
│  Router: GET /api/education                      │
│     ↓                                             │
│  educationController.getAllEducationContent()    │
│     ↓                                             │
│  EducationContent.find({                         │
│    isPublished: true,                           │
│    category: filterBy,                          │
│    $or: [{title}, {description}, {tags}]       │
│  })                                              │
│    ↓                                             │
│  MongoDB Query (EducationContent collection)    │
│    ↓                                             │
│  Return: [doc1, doc2, doc3, ...]               │
│    ↓                                             │
│  res.json({                                      │
│    success: true,                                │
│    count: 15,                                    │
│    data: [...]                                   │
│  })                                              │
│                                                   │
└──────────────────────────┬────────────────────────┘
                           │ 200 OK + JSON
                           ↓
┌─ CLIENT (React) ─────────────────────────────────┐
│                                                   │
│  Response received:                              │
│  {                                               │
│    success: true,                                │
│    count: 15,                                    │
│    data: [{                                      │
│      _id: "...",                                │
│      title: "Solar Basics",                      │
│      category: "Solar Basics",                   │
│      views: 245,                                 │
│      likes: 18,                                  │
│      ...                                         │
│    }, ...]                                       │
│  }                                               │
│                                                   │
│  setContent(res.data.data)                       │
│  Render content list                             │
│                                                   │
└────────────────────────────────────────────────────┘
```

### **Example 2: Submit Feedback (POST)**

```
┌─ CLIENT (React) ──────────────────────────────────┐
│                                                    │
│  const handleSubmitFeedback = (formData) => {     │
│    axios.post('/api/feedback', {                 │
│      feedbackType: 'Bug Report',                 │
│      rating: 4,                                  │
│      title: 'Search not working',                │
│      message: 'Cannot search by tags',           │
│      isAnonymous: false                          │
│    })                                            │
│  }                                               │
│                                                   │
└──────────────────────────┬────────────────────────┘
                           │ POST /api/feedback
                           │ {feedbackData}
                           ↓
┌─ SERVER (Express) ──────────────────────────────┐
│                                                  │
│  Router: POST /api/feedback                     │
│  (no auth required)                             │
│     ↓                                           │
│  Validate input:                                │
│  - rating: 1-5 ✓                               │
│  - title: not empty ✓                          │
│  - message: not empty ✓                        │
│  - feedbackType: in enum ✓                     │
│     ↓                                           │
│  Feedback.create({                              │
│    userId: null (anonymous),                    │
│    feedbackType: 'Bug Report',                  │
│    rating: 4,                                   │
│    title: 'Search not working',                 │
│    message: 'Cannot search by tags',            │
│    status: 'Pending',                           │
│    createdAt: now                               │
│  })                                             │
│     ↓                                           │
│  MongoDB: Insert to Feedback collection        │
│     ↓                                           │
│  res.status(201).json({                        │
│    success: true,                               │
│    message: 'Feedback submitted successfully',  │
│    data: {newFeedback}                         │
│  })                                             │
│                                                  │
└──────────────────────────┬────────────────────────┘
                           │ 201 CREATED + JSON
                           ↓
┌─ CLIENT (React) ──────────────────────────────────┐
│                                                    │
│  Response:                                         │
│  {                                                │
│    success: true,                                 │
│    message: "Feedback submitted successfully",   │
│    data: {                                        │
│      _id: "507f1f77bcf86cd799439012",           │
│      userId: null,                               │
│      feedbackType: "Bug Report",                 │
│      rating: 4,                                  │
│      status: "Pending",                          │
│      createdAt: "2026-02-21T..."                │
│    }                                             │
│  }                                               │
│                                                    │
│  Show: "Thank you! Your feedback has been        │
│  submitted and will be reviewed by our team"     │
│                                                    │
└────────────────────────────────────────────────────┘
```

---

## 🔐 Authentication Flow

```
┌─ User Login ───────────────────┐
│                                 │
│  POST /api/auth/login           │
│  {email, password}              │
│                                 │
└──────────────┬──────────────────┘
               ↓
      Backend validates
      Generates JWT
               ↓
      Returns: {token}
               ↓
┌─ Store Token ──────────────────┐
│                                 │
│  localStorage.setItem('token')  │
│                                 │
└──────────────┬──────────────────┘
               ↓
┌─ Making Protected Request ─────┐
│                                 │
│  GET /api/notifications         │
│  Header: Authorization: Bearer {token}
│                                 │
└──────────────┬──────────────────┘
               ↓
      Backend: protect middleware
      Verify JWT signature
      Extract userId
               ↓
      If valid ✓:
      Proceed to controller
               ↓
      If invalid ✗:
      Return 401 Unauthorized
               ↓
```

---

## 🌊 Complete User Journey

```
┌──────────────────────────────────────────────────────────┐
│          COMPLETE USER JOURNEY IN MEMBER 4               │
└──────────────────────────────────────────────────────────┘

PHASE 1: LEARNING
  ↓
  1. User visits "Education Hub"
  2. Browse solar education articles
  3. Search for "solar efficiency"
  4. Read article → views increment
  5. Like the article → likes increment
  6. Share with community

PHASE 2: COMMUNICATION
  ↓
  1. System sends notification:
     "New course: Solar Maintenance"
  2. User opens notification
  3. Click link to view content
  4. Mark notification as read
  5. Receive maintenance reminder

PHASE 3: FEEDBACK & IMPROVEMENT
  ↓
  1. Complete feature → satisfied user
  2. Click "Send Feedback"
  3. Rate 5 stars ⭐⭐⭐⭐⭐
  4. Write: "Great system!"
  5. (Optional) Stay anonymous
  6. Submit feedback

PHASE 4: ADMIN REVIEW
  ↓
  1. Admin logs into dashboard
  2. Views feedback statistics
  3. Average rating: 4.7 stars
  4. Sees distribution chart
  5. Approves positive feedback
  6. Uses feedback to improve

PHASE 5: LOOP BACK
  ↓
  System improvement complete →
  New education content created →
  User learns again
  CYCLE CONTINUES...

┌──────────────────────────────────────────────────────────┐
│         RESULT: Better system → Better learning         │
└──────────────────────────────────────────────────────────┘
```

---

## 📋 Entity Relationship Diagram

```
┌─────────────────┐
│      User       │
├─────────────────┤
│ _id             │
│ fullName        │
│ email           │
│ role (admin)    │
└────────┬────────┘
         │
    ┌────┼────┐
    │    │    │
    ↓    ↓    ↓
┌─────────────────┐   ┌──────────────────┐   ┌─────────────────┐
│ Education       │   │ Notification     │   │  Feedback       │
│ Content         │   │                  │   │                 │
├─────────────────┤   ├──────────────────┤   ├─────────────────┤
│ _id             │   │ _id              │   │ _id             │
│ title           │───│ userId (FK)      │───│ userId (FK)     │
│ content         │   │ title            │   │ rating          │
│ author (FK)─ ─ ─┼───│ message          │   │ status          │
│ views ⬆️       │   │ readAt           │   │ feedback_type   │
│ likes ⬆️       │   │ expiresAt (TTL)  │   │ adminNotes      │
│ tags []         │   │ status           │   │ isAnonymous     │
└─────────────────┘   └──────────────────┘   └─────────────────┘
         ↓                     ↓
    Referenced               Referenced
    by Notification      by Admin Dashboard
```

---

## 🎬 State Management Flow

```
┌─────────────────────────────────────────────────┐
│           FRONTEND STATE (React)                │
└─────────────────────────────────────────────────┘
         ↓            ↓            ↓
   ┌──────────┐  ┌───────────┐  ┌─────────┐
   │Education │  │Notification│ │Feedback │
   │State     │  │State       │  │State    │
   ├──────────┤  ├───────────┤  ├─────────┤
   │content[] │  │notifs[]   │  │feedback │
   │loading   │  │unreadCount│  │rating   │
   │error     │  │status     │  │error    │
   └──────────┘  └───────────┘  └─────────┘
         ↓            ↓            ↓
   
   Actions/Reducers
   ├── setContent()
   ├── setNotifications()
   ├── setFeedback()
   ├── incrementViews()
   ├── addLike()
   ├── markNotificationRead()
   └── submitFeedback()
         ↓
   API Calls
   ├── axios.get('/api/education')
   ├── axios.get('/api/notifications')
   ├── axios.post('/api/feedback')
   └── ...
         ↓
   Backend Response
   └── Update State
         ↓
   Re-render UI
```

---

## 🏆 Complete CRUD Matrix

```
┌────────────────────────────────────────────────────────────┐
│               MEMBER 4 CRUD OPERATIONS                    │
├────────────────────────────────────────────────────────────┤
│                                                             │
│ EDUCATION CONTENT                                          │
│  CREATE:  Admin → POST /api/education                     │
│  READ:    Public → GET /api/education                    │
│  UPDATE:  Owner/Admin → PUT /api/education/:id           │
│  DELETE:  Owner/Admin → DELETE /api/education/:id        │
│  SPECIAL: Like/View tracking                              │
│                                                             │
│ NOTIFICATION                                               │
│  CREATE:  Admin → POST /api/notifications                │
│  READ:    User → GET /api/notifications                  │
│  UPDATE:  User → PUT /api/notifications/:id/read         │
│  DELETE:  User/Admin → DELETE /api/notifications/:id     │
│  SPECIAL: Bulk send, auto-expire, unread count           │
│                                                             │
│ FEEDBACK                                                   │
│  CREATE:  Public → POST /api/feedback                    │
│  READ:    Admin → GET /api/feedback                      │
│  UPDATE:  Admin → PUT /api/feedback/:id/approve          │
│  DELETE:  User/Admin → DELETE /api/feedback/:id          │
│  SPECIAL: Anonymous, stats, approval workflow            │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

---

## ✨ Architecture Strengths

```
🔒 SECURITY
   ├─ JWT Authentication on 20/24 endpoints
   ├─ Role-based access control (User/Admin)
   ├─ Input validation on all fields
   └─ Error messages don't expose internals

⚡ PERFORMANCE  
   ├─ Efficient MongoDB queries
   ├─ Indexed collections
   ├─ TTL auto-cleanup
   └─ Bulk operations support

📈 SCALABILITY
   ├─ Ready for message queues
   ├─ Can handle 1000s of notifications/minute
   ├─ Modular architecture
   └─ External service integration ready

🛡️ RELIABILITY
   ├─ Error handling on all endpoints
   ├─ Data validation at multiple levels
   ├─ Transaction support ready
   └─ Automated data cleanup (TTL)

🎯 MAINTAINABILITY
   ├─ Clear folder structure
   ├─ Well-documented code
   ├─ Consistent naming conventions
   ├─ Reusable controller patterns
   └─ Comprehensive guides provided
```

---

**Created for: Member 4 - Education & Communication Layer**
**Solar Aid Web Application | MERN Stack**
**Date: February 21, 2026**
