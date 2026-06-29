# Deployment Guide - CourseHub MERN Stack

## Overview
This guide covers deploying your CourseHub application to production environments.

## Backend Deployment

### Option 1: Heroku

1. **Install Heroku CLI**
   ```bash
   # Download and install from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku App**
   ```bash
   cd backend
   heroku create your-app-name
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set MONGODB_URI=your_mongodb_atlas_uri
   heroku config:set JWT_SECRET=your_secure_jwt_secret
   heroku config:set NODE_ENV=production
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

6. **View Logs**
   ```bash
   heroku logs --tail
   ```

### Option 2: Railway.app

1. **Create Account** at https://railway.app

2. **Connect GitHub Repository**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Set Environment Variables**
   - Go to Project Settings
   - Add environment variables:
     - MONGODB_URI
     - JWT_SECRET
     - NODE_ENV=production

4. **Deploy**
   - Railway automatically deploys on push

### Option 3: Render.com

1. **Create Account** at https://render.com

2. **Create New Service**
   - Select "Web Service"
   - Connect GitHub

3. **Configure**
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`

4. **Add Environment Variables**
   - MONGODB_URI
   - JWT_SECRET
   - NODE_ENV=production

### Option 4: AWS EC2

1. **Create EC2 Instance**
   - Ubuntu 20.04 LTS
   - t2.micro (free tier eligible)

2. **Connect via SSH**
   ```bash
   ssh -i your-key.pem ubuntu@your-instance-ip
   ```

3. **Install Dependencies**
   ```bash
   sudo apt update
   sudo apt install nodejs npm
   ```

4. **Clone Repository**
   ```bash
   git clone your-repo-url
   cd nodejs/backend
   npm install
   ```

5. **Set Environment Variables**
   ```bash
   export MONGODB_URI=your_mongodb_uri
   export JWT_SECRET=your_secret
   ```

6. **Start with PM2**
   ```bash
   npm install -g pm2
   pm2 start server.js --name "coursehub-backend"
   pm2 startup
   pm2 save
   ```

---

## Frontend Deployment

### Option 1: Vercel (Recommended for React)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd frontend
   vercel
   ```

3. **Set Environment Variables**
   - In Vercel Dashboard → Project Settings → Environment Variables
   - Add: `REACT_APP_API_URL=your_backend_url`

4. **Connect GitHub (Optional)**
   - Auto-deploy on push

### Option 2: Netlify

1. **Create Account** at https://netlify.com

2. **Build Frontend**
   ```bash
   cd frontend
   npm run build
   ```

3. **Deploy Build Folder**
   - Drag and drop `build` folder to Netlify
   - Or connect GitHub for auto-deploy

4. **Set Environment Variables**
   - Site Settings → Build & Deploy → Environment
   - Add: `REACT_APP_API_URL=your_backend_url`

### Option 3: AWS S3 + CloudFront

1. **Build Frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Create S3 Bucket**
   - Upload contents of `build` folder
   - Enable static website hosting

3. **Create CloudFront Distribution**
   - Link to S3 bucket
   - Set up SSL certificate

### Option 4: GitHub Pages

1. **Update package.json**
   ```json
   "homepage": "https://username.github.io/repo-name"
   ```

2. **Build and Deploy**
   ```bash
   cd frontend
   npm run build
   npx gh-pages -d build
   ```

---

## MongoDB Setup

### Option 1: MongoDB Atlas (Cloud) - Recommended

1. **Create Account** at https://www.mongodb.com/cloud/atlas

2. **Create Cluster**
   - Choose free tier (M0)
   - Select region close to your app

3. **Create Database User**
   - Username & Password

4. **Get Connection String**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/course-platform
   ```

5. **Set in Backend**
   - Update MONGODB_URI in environment variables

### Option 2: Self-Hosted MongoDB

1. **On Server**
   ```bash
   sudo apt-get install -y mongodb-org
   sudo systemctl start mongod
   ```

2. **Configure Remote Access**
   - Edit `/etc/mongod.conf`
   - Change `bindIp` to `0.0.0.0`

3. **Connection String**
   ```
   mongodb://your-server-ip:27017/course-platform
   ```

---

## Production Checklist

- [ ] Change JWT_SECRET to a strong random string
- [ ] Set NODE_ENV=production
- [ ] Update REACT_APP_API_URL to production backend
- [ ] Enable HTTPS/SSL certificates
- [ ] Set up proper error logging
- [ ] Configure CORS for production domain
- [ ] Add rate limiting middleware
- [ ] Set up database backups
- [ ] Enable authentication on all protected routes
- [ ] Add logging and monitoring
- [ ] Set up CI/CD pipeline
- [ ] Test all API endpoints
- [ ] Performance optimization
- [ ] Security headers configuration

---

## Environment Variables for Production

### Backend
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=your_secure_random_string_min_32_chars
PORT=5000
NODE_ENV=production
```

### Frontend
```
REACT_APP_API_URL=https://api.yourdomain.com/api
```

---

## Monitoring & Logging

### Backend Logging
```bash
npm install winston
npm install helmet  # Security headers
npm install express-rate-limit  # Rate limiting
```

### Frontend Error Tracking
```bash
npm install @sentry/react
```

---

## SSL/TLS Certificate

### Let's Encrypt (Free)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot certonly --standalone -d yourdomain.com
```

### Update Node Server
```javascript
const fs = require('fs');
const https = require('https');

const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/domain/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/domain/fullchain.pem')
};

https.createServer(options, app).listen(443);
```

---

## Performance Optimization

1. **Frontend**
   - Code splitting with React.lazy()
   - Image optimization
   - Minification enabled in build
   - Enable gzip compression

2. **Backend**
   - Database indexing
   - Caching strategies
   - API response compression
   - Connection pooling

3. **Database**
   - Add indexes on frequently queried fields
   - Archival of old data
   - Regular backups

---

## Troubleshooting

### CORS Issues
Update backend .env:
```
FRONTEND_URL=https://yourdomain.com
```

### Database Connection
- Check MongoDB credentials
- Verify IP whitelist in MongoDB Atlas
- Test connection string locally first

### Slow API Response
- Check database indexes
- Monitor server logs
- Profile slow queries

---

## Support

For deployment help:
- Heroku Docs: https://devcenter.heroku.com/
- Vercel Docs: https://vercel.com/docs
- AWS Docs: https://docs.aws.amazon.com/
- MongoDB Atlas: https://docs.atlas.mongodb.com/

---

**Last Updated:** 2024-01-15
