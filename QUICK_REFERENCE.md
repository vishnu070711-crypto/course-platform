# 📋 Quick Reference Guide - CourseHub MERN

## 🚀 Quick Start (One-Minute Setup)

```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm install
npm start
```

Visit: http://localhost:3000

---

## 📂 Key Files Location

| Task | File |
|------|------|
| Backend Server | `/backend/server.js` |
| MongoDB Config | `/backend/config/db.js` |
| Auth Logic | `/backend/controllers/authController.js` |
| Course Logic | `/backend/controllers/courseController.js` |
| User Model | `/backend/models/User.js` |
| Auth Routes | `/backend/routes/auth.js` |
| Course Routes | `/backend/routes/courses.js` |
| Main React App | `/frontend/src/app.js` |
| Auth Context | `/frontend/src/context/AuthContext.js` |
| API Client | `/frontend/src/services/api.js` |

---

## 🔑 Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/course-platform
JWT_SECRET=your_jwt_secret_key
PORT=5000
NODE_ENV=development
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 🌐 API Quick Reference

### Auth Endpoints
```
POST   /api/auth/register      {fullName, email, password, role}
POST   /api/auth/login         {email, password}
GET    /api/auth/me            [Protected]
PUT    /api/auth/profile       {fullName, bio, avatar} [Protected]
```

### Course Endpoints
```
GET    /api/courses            ?search=x&category=y
GET    /api/courses/:id
POST   /api/courses            {title, description, ...} [Instructor]
PUT    /api/courses/:id        {title, price, ...} [Instructor]
DELETE /api/courses/:id        [Instructor]
POST   /api/courses/enroll     {courseId} [Student]
GET    /api/courses/my-courses [Student]
```

---

## 🔓 Authentication Flow

1. User registers → Password hashed → JWT token generated
2. Token stored in localStorage
3. Sent in every request: `Authorization: Bearer <token>`
4. Backend validates token → grants access

---

## 📊 Database Models

### User
- fullName, email, password (hashed)
- role: 'student' | 'instructor' | 'admin'
- avatar, bio, createdAt

### Course
- title, description, category, price
- instructor (ref: User)
- students [], modules []

### Enrollment
- student (ref: User), course (ref: Course)
- progress (0-100), completed (boolean)

---

## 🛠️ Common Commands

```bash
# Backend
npm run dev          # Start with auto-reload
npm start           # Start production mode
npm install         # Install dependencies

# Frontend
npm start           # Start dev server
npm build           # Create production build
npm test            # Run tests

# Both
npm install package-name
npm uninstall package-name
npm update
```

---

## 🧪 Test Users

After registering, use these to test:

**Student Account**
- Email: student@example.com
- Password: test1234
- Role: student

**Instructor Account**
- Email: instructor@example.com
- Password: test1234
- Role: instructor

---

## 📍 API Base URL

- **Local**: `http://localhost:5000/api`
- **Production**: Update in frontend .env

---

## 🔐 Security Checklist

- ✅ JWT tokens expire after 30 days
- ✅ Passwords hashed with bcrypt (10 rounds)
- ✅ Protected endpoints check auth
- ✅ Role-based access control
- ✅ CORS enabled for localhost

---

## 🐛 Quick Fixes

| Issue | Fix |
|-------|-----|
| MongoDB not connecting | `sudo systemctl start mongod` |
| Port in use | Change PORT in .env or kill process |
| Token invalid | Clear localStorage, re-login |
| Styles not loading | Clear cache (Ctrl+Shift+R), restart npm |
| API 404 | Check endpoint name, spelling, method |
| CORS error | Verify CORS enabled in backend |

---

## 📚 File Types

- `.js` - JavaScript files
- `.env` - Environment variables (NOT in git)
- `.json` - Configuration files
- `.md` - Documentation files
- `.bat` - Windows batch scripts

---

## 🚀 Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Change JWT_SECRET to random string
- [ ] Set NODE_ENV=production
- [ ] Update REACT_APP_API_URL to production API
- [ ] Enable HTTPS
- [ ] Test all endpoints
- [ ] Set up CI/CD
- [ ] Configure backups
- [ ] Add monitoring

---

## 📖 Documentation Index

1. **README.md** - Project overview
2. **SETUP_GUIDE.md** - Local setup
3. **API_DOCUMENTATION.md** - API reference
4. **DEPLOYMENT_GUIDE.md** - Production deploy
5. **TROUBLESHOOTING.md** - Common issues
6. **PROJECT_SUMMARY.md** - What's included

---

## 🎯 User Roles & Permissions

### Student
- ✅ View courses
- ✅ Enroll in courses
- ✅ Track progress
- ❌ Create courses
- ❌ Manage users

### Instructor
- ✅ Create courses
- ✅ Edit own courses
- ✅ Delete own courses
- ✅ View students
- ❌ Delete user accounts

### Admin
- ✅ All permissions
- ✅ Manage all courses
- ✅ Manage users

---

## 🔗 Important URLs

- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- API Docs: /api/health
- MongoDB: localhost:27017

---

## 📦 Dependencies Overview

### Backend
- express - Web framework
- mongoose - MongoDB ODM
- bcryptjs - Password hashing
- jsonwebtoken - Auth tokens
- cors - Cross-origin

### Frontend
- react - UI library
- react-router-dom - Routing
- axios - HTTP client
- @mui/material - UI components

---

## 🎨 UI Components Used

- TextField - Text input
- Button - Clickable button
- Card - Content container
- Grid - Layout system
- Navbar - Navigation
- Modal - Dialogs

---

## 🧠 Logic Flow

1. **Register** → Hash password → Create user → Generate token
2. **Login** → Find user → Compare password → Generate token
3. **Browse** → Fetch courses → Filter → Display
4. **Enroll** → Verify user → Create enrollment → Add to course
5. **Dashboard** → Fetch enrollments → Show progress

---

## 💡 Tips & Tricks

- Use MongoDB Compass to view database
- Use Postman to test API endpoints
- Use DevTools (F12) to debug frontend
- Check browser Console for errors
- Check Network tab for API responses
- Use `npm run dev` for auto-reload

---

## 🆘 Emergency Contacts (Resources)

- Stack Overflow: https://stackoverflow.com
- GitHub Issues: Check official repos
- Documentation: Check included .md files
- MongoDB Support: https://www.mongodb.com/support
- React Help: https://react.dev

---

## ✅ Before Going Live

- [ ] All tests pass
- [ ] No console errors
- [ ] No security warnings
- [ ] Database backups enabled
- [ ] Monitoring set up
- [ ] Error logging configured
- [ ] Performance optimized
- [ ] HTTPS enabled

---

## 🎓 Learning Resources

- MongoDB: https://docs.mongodb.com/
- Express: https://expressjs.com/
- React: https://react.dev/
- Node.js: https://nodejs.org/docs/
- JWT: https://jwt.io/

---

**Created:** January 2024  
**Version:** 1.0.0  
**Status:** Production Ready ✅

---

**Print this page for quick reference!**
