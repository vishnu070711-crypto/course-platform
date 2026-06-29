# CourseHub - MERN Stack Application

A full-featured online learning platform built with MongoDB, Express.js, React, and Node.js (MERN stack).

## 🎯 Features

### Backend
- **User Authentication**: JWT-based authentication with role-based access control (Student, Instructor, Admin)
- **Course Management**: Create, read, update, delete courses
- **Enrollment System**: Students can enroll in courses and track progress
- **Paid Course Support**: Courses can be marked as paid and require confirmation before enrollment
- **Assignment Workflow**: Instructors can create assignments and students can submit work
- **MongoDB Integration**: Robust data persistence with Mongoose ODM
- **API Security**: Bcrypt password hashing and JWT token validation
- **Error Handling**: Comprehensive error handling middleware

### Frontend
- **Responsive Design**: Material-UI components for modern responsive UI
- **Authentication Pages**: Login and Registration with form validation
- **Course Browsing**: Search and filter courses by category
- **Course Details**: Comprehensive course information display with enrollment actions
- **Student Dashboard**: Track enrolled courses and progress
- **Instructor Dashboard**: View and manage all courses created by the logged-in instructor
- **Course Creation**: Instructors can create courses with thumbnails and pricing
- **Assignment Pages**: Create assignments, submit work, and review submissions
- **Profile Management**: Update profile details and view account information
- **Navigation**: Context-based routing with protected routes

## 📁 Project Structure

```
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Auth logic
│   │   └── courseController.js   # Course logic
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication
│   │   └── errorHandler.js      # Error handling
│   ├── models/
│   │   ├── User.js              # User schema
│   │   ├── Course.js            # Course schema
│   │   └── Enrollment.js        # Enrollment schema
│   ├── routes/
│   │   ├── auth.js              # Auth endpoints
│   │   └── courses.js           # Course endpoints
│   ├── .env                      # Environment variables
│   ├── package.json
│   └── server.js                # Main server file
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.js        # Navigation component
│   │   ├── context/
│   │   │   └── AuthContext.js   # Auth context & hooks
│   │   ├── pages/
│   │   │   ├── Home.js                # Home page
│   │   │   ├── Login.js               # Login page
│   │   │   ├── Register.js            # Register page
│   │   │   ├── Courses.js             # Courses listing
│   │   │   ├── CourseDetail.js        # Course details and enrollment
│   │   │   ├── Dashboard.js           # Student dashboard
│   │   │   ├── InstructorDashboard.js # Instructor course overview
│   │   │   ├── CreateCourse.js        # Course creation form
│   │   │   ├── CreateAssignment.js    # Assignment creation
│   │   │   ├── SubmitAssignment.js    # Assignment submission
│   │   │   ├── AssignmentSubmissions.js # Review student work
│   │   │   ├── MySubmissions.js       # Student submission history
│   │   │   └── Profile.js             # Profile page
│   │   ├── services/
│   │   │   └── api.js           # API client
│   │   ├── app.js               # Main app component
│   │   └── index.js             # React entry point
│   ├── .env
│   └── package.json
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation & Setup

#### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (already exists with defaults)
# Update MongoDB URI if needed
# MONGODB_URI=mongodb://localhost:27017/course-platform

# Start the server
npm run dev    # Development mode with nodemon
# or
npm start      # Production mode
```

Backend will run on `http://localhost:5000`

#### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

Frontend will run on `http://localhost:3000`

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (protected)
- `PUT /api/auth/profile` - Update profile (protected)

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course details
- `GET /api/courses/instructor` - Get courses created by the logged-in instructor
- `POST /api/courses` - Create course (Instructor/Admin)
- `PUT /api/courses/:id` - Update course (Instructor/Admin)
- `DELETE /api/courses/:id` - Delete course (Instructor/Admin)
- `POST /api/courses/enroll` - Enroll in course (Student)
- `DELETE /api/courses/unenroll` - Unenroll from a course (Student)
- `GET /api/courses/my-courses` - Get enrolled courses (Student)

### Assignments
- `POST /api/assignments/courses/:courseId/assignments` - Create an assignment for a course
- `GET /api/assignments/courses/:courseId/assignments` - Get assignments for a course
- `POST /api/assignments/:assignmentId/submissions` - Submit an assignment
- `GET /api/assignments/my-submissions` - Get a student's submissions
- `GET /api/assignments/:assignmentId/submissions` - View submissions for an assignment
- `PATCH /api/assignments/submissions/:submissionId` - Grade a submission

## 🔐 Authentication Flow

1. User registers with email and password
2. Password is hashed using bcryptjs
3. JWT token is generated and stored in localStorage
4. Token is sent with each API request in Authorization header
5. Backend validates token and allows access to protected routes

## 📦 Dependencies

### Backend
- `express`: Web framework
- `mongoose`: MongoDB ODM
- `bcryptjs`: Password hashing
- `jsonwebtoken`: JWT authentication
- `cors`: Cross-origin resource sharing
- `dotenv`: Environment variables

### Frontend
- `react`: UI library
- `react-router-dom`: Routing
- `axios`: HTTP client
- `@mui/material`: Component library
- `@emotion/react` & `@emotion/styled`: CSS-in-JS

## 🔧 Configuration

### Backend Environment Variables (.env)
```
MONGODB_URI=mongodb://localhost:27017/course-platform
JWT_SECRET=your_jwt_secret_key_change_this_in_production
PORT=5000
NODE_ENV=development
```

### Frontend Environment Variables (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## 💾 Database Schema

### User Schema
- fullName, email, password
- role (student, instructor, admin)
- avatar, bio, createdAt

### Course Schema
- title, description, category
- instructor (reference to User)
- price, image, rating
- students (array of User references)
- modules with lessons

### Enrollment Schema
- student (reference to User)
- course (reference to Course)
- progress, completed status
- completedAt, lessonsCompleted

## 🧪 Testing the Application

1. **Register a Student**
   - Go to http://localhost:3000/register
   - Fill in details and select "Student" role
   - Click Register

2. **Browse Courses**
   - Click "Courses" in navigation
   - Search by keyword or filter by category
   - Click on any course to view details

3. **Enroll in a Course**
   - On the course detail page, click the enrollment button
   - Free courses enroll immediately
   - Paid courses show a confirmation step before enrollment is completed

4. **Use Instructor Features**
   - Register or log in as an instructor
   - Open the instructor dashboard to see your created courses
   - Create a new course with a thumbnail and price
   - Add assignments to a course and review student submissions

5. **Manage Assignments**
   - Students can submit assignments from the course detail flow
   - Instructors can review submissions and leave grades/feedback

6. **View Dashboard**
   - Student dashboard shows enrolled courses
   - Instructor dashboard shows courses created by the logged-in instructor

## 🚨 Error Handling

- Validation errors return 400 status
- Authentication errors return 401 status
- Authorization errors return 403 status
- Not found errors return 404 status
- Server errors return 500 status

## 📈 Future Enhancements

- Video lesson uploads and streaming
- Discussion forums
- Quiz and assignments
- Payment integration
- Advanced analytics
- Mobile app

## 📄 License

MIT

## 👥 Support

For issues or questions, please create an issue in the repository.

---

**Happy Learning! 📚**
