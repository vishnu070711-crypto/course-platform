# CourseHub API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"  // or "instructor"
}
```

**Response:** (201 Created)
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

---

### Login User
**POST** `/auth/login`

Authenticate user and get JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** (200 OK)
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

---

### Get Current User
**GET** `/auth/me`

Get authenticated user's profile. *(Protected)*

**Response:** (200 OK)
```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "bio": "Learning enthusiast",
    "avatar": "https://...",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### Update Profile
**PUT** `/auth/profile`

Update user profile information. *(Protected)*

**Request Body:**
```json
{
  "fullName": "Jane Doe",
  "bio": "Full stack developer",
  "avatar": "https://..."
}
```

**Response:** (200 OK)
```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "fullName": "Jane Doe",
    "email": "john@example.com",
    "role": "student",
    "bio": "Full stack developer",
    "avatar": "https://...",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

## Course Endpoints

### Get All Courses
**GET** `/courses`

Get list of all courses with optional filtering.

**Query Parameters:**
- `search` (optional): Search by title or description
- `category` (optional): Filter by category
  - Web Development
  - Mobile Development
  - Data Science
  - Machine Learning
  - DevOps
  - Other

**Example:** `/courses?category=Web Development&search=React`

**Response:** (200 OK)
```json
{
  "success": true,
  "count": 5,
  "courses": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "React Fundamentals",
      "description": "Learn React from basics...",
      "category": "Web Development",
      "price": 49.99,
      "image": "https://...",
      "rating": 4.5,
      "students": ["507f1f77bcf86cd799439012"],
      "instructor": {
        "_id": "507f1f77bcf86cd799439010",
        "fullName": "Jane Smith",
        "email": "jane@example.com"
      },
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

### Get Course Details
**GET** `/courses/:id`

Get detailed information about a specific course.

**Response:** (200 OK)
```json
{
  "success": true,
  "course": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "React Fundamentals",
    "description": "Learn React from basics...",
    "category": "Web Development",
    "price": 49.99,
    "image": "https://...",
    "rating": 4.5,
    "modules": [
      {
        "title": "Introduction",
        "lessons": [
          {
            "title": "What is React?",
            "duration": 15,
            "videoUrl": "https://...",
            "content": "Lesson content"
          }
        ]
      }
    ],
    "students": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "fullName": "John Doe"
      }
    ],
    "instructor": {
      "_id": "507f1f77bcf86cd799439010",
      "fullName": "Jane Smith",
      "email": "jane@example.com",
      "bio": "React expert"
    }
  }
}
```

---

### Create Course
**POST** `/courses`

Create a new course. *(Protected - Instructor/Admin only)*

**Request Body:**
```json
{
  "title": "Node.js Backend Development",
  "description": "Build scalable backend with Node.js...",
  "category": "Web Development",
  "price": 59.99,
  "image": "https://..."
}
```

**Response:** (201 Created)
```json
{
  "success": true,
  "course": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Node.js Backend Development",
    "description": "Build scalable backend with Node.js...",
    "category": "Web Development",
    "price": 59.99,
    "image": "https://...",
    "instructor": "507f1f77bcf86cd799439010",
    "students": [],
    "modules": [],
    "rating": 0,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### Update Course
**PUT** `/courses/:id`

Update course details. *(Protected - Instructor/Admin only)*

**Request Body:**
```json
{
  "title": "Advanced Node.js",
  "price": 79.99,
  "description": "Updated description..."
}
```

**Response:** (200 OK)
```json
{
  "success": true,
  "course": { /* updated course object */ }
}
```

---

### Delete Course
**DELETE** `/courses/:id`

Delete a course. *(Protected - Instructor/Admin only)*

**Response:** (200 OK)
```json
{
  "success": true,
  "message": "Course deleted"
}
```

---

### Enroll in Course
**POST** `/courses/enroll`

Enroll student in a course. *(Protected - Student)*

**Request Body:**
```json
{
  "courseId": "507f1f77bcf86cd799439011"
}
```

**Response:** (201 Created)
```json
{
  "success": true,
  "message": "Successfully enrolled in course",
  "enrollment": {
    "_id": "507f1f77bcf86cd799439020",
    "student": "507f1f77bcf86cd799439012",
    "course": "507f1f77bcf86cd799439011",
    "progress": 0,
    "completed": false,
    "enrolledAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### Get Enrolled Courses
**GET** `/courses/my-courses`

Get all courses enrolled by current student. *(Protected - Student)*

**Response:** (200 OK)
```json
{
  "success": true,
  "enrollments": [
    {
      "_id": "507f1f77bcf86cd799439020",
      "progress": 25,
      "completed": false,
      "enrolledAt": "2024-01-15T10:30:00Z",
      "course": {
        "_id": "507f1f77bcf86cd799439011",
        "title": "React Fundamentals",
        "price": 49.99,
        "instructor": {
          "_id": "507f1f77bcf86cd799439010",
          "fullName": "Jane Smith",
          "email": "jane@example.com"
        }
      }
    }
  ]
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Please provide all required fields"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "User role 'student' is not authorized to access this route"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Course not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Server Error"
}
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Auth required/failed |
| 403 | Forbidden - Access denied |
| 404 | Not Found - Resource not found |
| 500 | Server Error |

---

## Rate Limiting
Currently no rate limiting is implemented. Consider adding for production.

## Pagination
Pagination can be added to the GET `/courses` endpoint for better performance with large datasets.

## Webhooks
Webhook support can be implemented for course enrollment events.

---

**Last Updated:** 2024-01-15
