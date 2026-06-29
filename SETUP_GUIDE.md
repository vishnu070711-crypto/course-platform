# MERN Stack Setup Guide

## Quick Start

### Prerequisites
Ensure you have installed:
- Node.js (v14+)
- MongoDB (local or MongoDB Atlas cloud)
- Git

### Step 1: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 2: Configure Backend
The `.env` file is already created with default values. Update if needed:
- MONGODB_URI: Your MongoDB connection string
- JWT_SECRET: Change to a secure random string for production
- PORT: Server port (default: 5000)

### Step 3: Start Backend Server
```bash
cd backend
npm run dev
```
Server runs on http://localhost:5000

### Step 4: Install Frontend Dependencies
```bash
cd frontend
npm install
```

### Step 5: Configure Frontend
The `.env` file is already created with:
- REACT_APP_API_URL: Points to backend API

### Step 6: Start Frontend
```bash
cd frontend
npm start
```
Frontend runs on http://localhost:3000

## MongoDB Setup

### Local MongoDB
1. Install MongoDB Community Edition
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/course-platform`

### MongoDB Atlas (Cloud)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update MONGODB_URI in backend/.env

## Testing the Application

### Create Test Data
1. Register as Student (http://localhost:3000/register)
2. Register as Instructor

### Add Sample Courses
Using MongoDB Compass or Atlas UI, add sample courses:
```json
{
  "title": "Web Development Fundamentals",
  "description": "Learn HTML, CSS, and JavaScript",
  "category": "Web Development",
  "price": 49.99,
  "instructor": "instructor_user_id",
  "rating": 4.5
}
```

## Deployment

### Backend (Node.js)
- Deploy to Heroku, Railway, or Render
- Set environment variables on hosting platform

### Frontend (React)
- Build: `npm run build`
- Deploy to Vercel, Netlify, or AWS S3

## Common Issues

### MongoDB Connection Error
- Check MongoDB service is running
- Verify connection string in .env
- Check network access for MongoDB Atlas

### CORS Error
- Backend already has CORS enabled
- Ensure correct REACT_APP_API_URL in frontend .env

### Port Already in Use
- Backend: Change PORT in .env
- Frontend: Use PORT=3001 npm start

## File Structure Summary

```
backend/
  - server.js (entry point)
  - config/ (database config)
  - models/ (MongoDB schemas)
  - controllers/ (business logic)
  - routes/ (API endpoints)
  - middleware/ (auth, error handling)

frontend/
  - public/ (static files)
  - src/
    - pages/ (route pages)
    - components/ (React components)
    - services/ (API calls)
    - context/ (state management)
    - app.js (main component)
    - index.js (entry point)
```

## Next Steps

1. Customize the UI/branding
2. Add more course features
3. Implement payment system
4. Add email notifications
5. Set up CI/CD pipeline

Happy coding! 🚀
