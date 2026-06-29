# 🔧 Troubleshooting Guide - CourseHub MERN Stack

## Common Issues & Solutions

---

## Backend Issues

### MongoDB Connection Error

**Error Message:**
```
✗ MongoDB Connection Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solutions:**
1. **Check MongoDB is Running**
   ```bash
   # Windows
   net start MongoDB
   
   # macOS
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

2. **Verify Connection String**
   - Check `.env` file has correct MONGODB_URI
   - Local: `mongodb://localhost:27017/course-platform`
   - Atlas: `mongodb+srv://user:password@cluster.mongodb.net/course-platform`

3. **Test Connection**
   ```bash
   # Use MongoDB Compass to test connection
   # Download from https://www.mongodb.com/products/compass
   ```

---

### Port Already in Use

**Error Message:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solutions:**
1. **Change Port in .env**
   ```
   PORT=5001
   ```

2. **Kill Process Using Port**
   ```bash
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   
   # macOS/Linux
   lsof -i :5000
   kill -9 <PID>
   ```

3. **Restart Backend**
   ```bash
   npm run dev
   ```

---

### Dependencies Not Installing

**Error Message:**
```
npm ERR! code E404
npm ERR! 404 Not Found - GET https://registry.npmjs.org/...
```

**Solutions:**
1. **Clear npm Cache**
   ```bash
   npm cache clean --force
   ```

2. **Delete node_modules and package-lock.json**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Use Different npm Registry**
   ```bash
   npm config set registry https://registry.npmjs.org/
   npm install
   ```

---

### JWT Token Issues

**Error Message:**
```
JsonWebTokenError: invalid token
```

**Solutions:**
1. **Ensure JWT_SECRET is Set**
   ```
   JWT_SECRET=your_super_secret_key_min_32_chars
   ```

2. **Clear localStorage in Browser**
   - Open DevTools (F12)
   - Console: `localStorage.clear()`
   - Refresh page

3. **Re-login**
   - Invalid tokens require fresh login

---

### CORS Errors

**Error Message:**
```
Access to XMLHttpRequest at 'http://localhost:5000/api/...' 
from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Solutions:**
1. **Verify CORS is Enabled in Backend**
   In `server.js`:
   ```javascript
   app.use(cors());
   ```

2. **Check API URL in Frontend .env**
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

3. **Frontend Proxy (Alternative)**
   In `frontend/package.json`:
   ```json
   "proxy": "http://localhost:5000"
   ```

---

## Frontend Issues

### Port 3000 Already in Use

**Error Message:**
```
Something is already listening on port 3000
```

**Solutions:**
1. **Use Different Port**
   ```bash
   PORT=3001 npm start
   ```

2. **Kill Process**
   ```bash
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   
   # macOS/Linux
   lsof -i :3000
   kill -9 <PID>
   ```

---

### npm Dependencies Not Found

**Error Message:**
```
Module not found: Can't resolve 'react'
```

**Solutions:**
1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Delete node_modules**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Check Node Version**
   ```bash
   node --version  # Should be v14+
   npm --version   # Should be v6+
   ```

---

### API Calls Returning 404

**Error Message:**
```
GET http://localhost:5000/api/courses 404 (Not Found)
```

**Solutions:**
1. **Verify Backend is Running**
   - Check http://localhost:5000/api/health
   - Should show: `{"success":true,"message":"Server is running"}`

2. **Check API Endpoint**
   - Review `API_DOCUMENTATION.md`
   - Verify endpoint name spelling
   - Check HTTP method (GET, POST, etc.)

3. **Verify REACT_APP_API_URL**
   ```bash
   # In frontend directory
   echo $REACT_APP_API_URL
   # Should output: http://localhost:5000/api
   ```

---

### Authentication Not Working

**Error Message:**
```
Login failed: Invalid credentials
```

**Solutions:**
1. **Verify User Exists**
   - Check MongoDB for user records
   - Use MongoDB Compass or Atlas UI

2. **Check Email Format**
   - Emails must be valid format
   - Check for typos

3. **Password Mismatch**
   - Re-register account
   - Ensure password matches confirmation

4. **Token Not Saved**
   - Check DevTools → Application → Storage
   - Token should be in localStorage

---

### Protected Routes Not Working

**Error Message:**
```
Not authorized to access this route
```

**Solutions:**
1. **Ensure User is Logged In**
   - Token must be valid and not expired
   - Check localStorage has token

2. **Check User Role**
   - Route may require specific role
   - Register as correct role (student/instructor)

3. **Token Expired**
   - Default expiry: 30 days
   - Re-login to get new token

---

### Styles Not Loading

**Error Message:**
```
Material-UI styles not appearing
```

**Solutions:**
1. **Clear Browser Cache**
   - DevTools → Network → Disable cache
   - Refresh page (Ctrl+Shift+R)

2. **Verify Material-UI Installation**
   ```bash
   npm list @mui/material
   ```

3. **Restart Dev Server**
   ```bash
   npm start
   ```

---

## Environment & Configuration Issues

### Environment Variables Not Loading

**Error:**
```
process.env.REACT_APP_API_URL is undefined
```

**Solutions:**
1. **Frontend .env File**
   - Must be in `frontend/` directory
   - Variables must start with `REACT_APP_`
   - Example: `REACT_APP_API_URL=...`

2. **Backend .env File**
   - Must be in `backend/` directory
   - Check file exists and has correct values
   - Restart server after changing

3. **Restart Dev Server**
   - Development servers cache env variables
   - Stop and restart server

---

### Database Connection String Issues

**Error:**
```
MongoParseError: Invalid connection string
```

**Solutions:**
1. **MongoDB Atlas Connection String**
   - Format: `mongodb+srv://user:password@cluster.mongodb.net/dbname`
   - Check credentials have no special characters
   - Escape special characters: `%40` for `@`

2. **Local MongoDB**
   - Format: `mongodb://localhost:27017/database-name`
   - No auth needed for local

3. **Test Connection**
   ```bash
   mongosh "your-connection-string"
   ```

---

## Deployment Issues

### Heroku Deployment Error

**Error:**
```
ERR! code H10 - App crashed
```

**Solutions:**
1. **Check Logs**
   ```bash
   heroku logs --tail
   ```

2. **Ensure Procfile Exists**
   Backend directory needs `Procfile`:
   ```
   web: npm start
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set MONGODB_URI=...
   heroku config:set JWT_SECRET=...
   ```

---

### Frontend Not Calling API

**Error:**
```
Cannot POST http://localhost:3000/api/auth/login
```

**Solutions:**
1. **Check REACT_APP_API_URL**
   - Should NOT include `/api` at end in .env
   - API calls append `/api/...`

2. **Verify Proxy Setting**
   - If using proxy, don't add base URL
   - If not using proxy, use full URL

---

## Performance Issues

### Slow API Response

**Symptoms:**
- API calls take >5 seconds
- Database queries timeout

**Solutions:**
1. **Add Database Indexes**
   ```javascript
   // In models, add indexes
   courseSchema.index({ category: 1 });
   userSchema.index({ email: 1 });
   ```

2. **Check MongoDB Performance**
   - Use MongoDB Atlas Performance Advisor
   - Review slow query logs

3. **Optimize Queries**
   - Use `.select()` to limit fields
   - Use `.populate()` selectively

---

### High Memory Usage

**Symptoms:**
- Application crashes
- "Cannot allocate memory"

**Solutions:**
1. **Restart Node Server**
   ```bash
   npm run dev
   ```

2. **Limit Response Size**
   - Add pagination to list endpoints
   - Limit document population

3. **Monitor with PM2**
   ```bash
   npm install -g pm2
   pm2 monit
   ```

---

## Browser Console Errors

### 404 Not Found (API)
**Check:** Backend running? Endpoint exists? Correct spelling?

### 401 Unauthorized
**Check:** Logged in? Token valid? Token in localStorage?

### 403 Forbidden
**Check:** User role correct? Instructor/Admin required?

### 500 Server Error
**Check:** Backend logs? Database connected? Syntax error?

### CORS Error
**Check:** `app.use(cors())` in backend? API URL correct?

---

## Getting More Help

1. **Check Backend Logs**
   ```bash
   # Terminal running npm run dev
   # Look for error messages
   ```

2. **Check Browser Console**
   - Press F12 in browser
   - Look at Console and Network tabs

3. **Check MongoDB**
   - Use MongoDB Compass
   - Verify data exists

4. **Test API Manually**
   - Use Postman or Insomnia
   - Test endpoints directly

5. **Review Documentation**
   - API_DOCUMENTATION.md
   - SETUP_GUIDE.md
   - README.md

---

## Quick Checklist

Before asking for help, verify:
- ✅ MongoDB is running
- ✅ Backend server is running (port 5000)
- ✅ Frontend dev server is running (port 3000)
- ✅ .env files exist and have correct values
- ✅ Dependencies installed (`npm install`)
- ✅ No typos in file names or variable names
- ✅ Browser console has no errors
- ✅ API endpoint URL is correct
- ✅ User is authenticated (token in localStorage)
- ✅ Network tab shows requests being sent

---

## Nuclear Option (Last Resort)

If nothing works, try complete reset:

```bash
# Stop all servers (Ctrl+C)

# Backend
cd backend
rm -rf node_modules package-lock.json
npm install
npm run dev

# Frontend (new terminal)
cd frontend
rm -rf node_modules package-lock.json .eslintcache
npm install
npm start

# Clear browser cache
# DevTools → Application → Storage → Clear All
```

---

**If issue persists, check the documentation files and verify all prerequisites are installed correctly.**

Last Updated: 2024-01-15
