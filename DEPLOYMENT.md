# Deployment Guide for Render

This project is configured to deploy on Render with separate frontend and backend services.

## Prerequisites

1. A Render account (https://render.com)
2. MongoDB Atlas database (already configured)
3. Gmail SMTP access with App Password

## Deployment Steps

### Option 1: Using render.yaml (Recommended)

1. **Fork/Clone this repository** to your GitHub account

2. **Create New Web Service on Render**:
   - Connect your GitHub repository
   - Render will automatically detect the `render.yaml` file
   - Both services will be created automatically

3. **Configure Environment Variables**:

   **Backend Service Environment Variables**:
   ```
   MONGODB_URI=mongodb+srv://harshith:Ts08ej8892@cluster0.jitcsrz.mongodb.net/mia-altar?retryWrites=true&w=majority&appName=cluster0
   JWT_SECRET=asdfhwqewfj457834579dgfdwfj2re8
   JWT_EXPIRE=7d
   PORT=10000
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=harshithmuddasani2004@gmail.com
   SMTP_PASS=jofllfkgofgvbraw
   EMAIL_FROM=no-reply@mialtar.com
   FRONTEND_URL=https://your-frontend-app.onrender.com
   NODE_ENV=production
   ```

   **Frontend Service Environment Variables**:
   ```
   VITE_API_URL=https://your-backend-app.onrender.com
   NODE_ENV=production
   ```

4. **Update URLs**: After deployment, update the `FRONTEND_URL` in backend and `VITE_API_URL` in frontend with actual Render URLs

### Option 2: Manual Service Creation

#### Backend Deployment

1. **Create Web Service**:
   - Runtime: Node
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`

2. **Set Environment Variables** (same as above)

#### Frontend Deployment

1. **Create Static Site**:
   - Runtime: Static Site
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`

2. **Set Environment Variables** (same as above)

## Important Notes

1. **Free Tier Limitations**:
   - Services may sleep after 15 minutes of inactivity
   - Consider upgrading to paid plans for production use

2. **Database Connection**:
   - MongoDB Atlas connection is already configured
   - Database allows connections from all IPs (0.0.0.0/0)

3. **Email Configuration**:
   - Gmail SMTP is already configured with App Password
   - Email credentials are already set up

4. **CORS Configuration**:
   - The backend is configured to accept requests from the frontend URL
   - Update `FRONTEND_URL` environment variable after frontend deployment

## Environment Files

- Use `.env.example` files as templates for your actual values
- Never commit actual `.env` files to version control
- Set sensitive variables as secrets in Render dashboard

## Troubleshooting

1. **Build Failures**:
   - Check build logs in Render dashboard
   - Ensure all dependencies are in `package.json`

2. **Connection Issues**:
   - Verify environment variables are set correctly
   - Check CORS configuration
   - Ensure database allows connections

3. **Email Issues**:
   - Verify SMTP credentials in environment variables
   - Check spam folder for test emails

## Local Development

1. Copy `.env.example` to `.env` in both directories
2. Fill in your actual configuration values
3. Run backend: `cd backend && npm run dev`
4. Run frontend: `cd frontend && npm run dev`

## Your Current Configuration

Your project is already configured with:
- MongoDB Atlas database connection
- JWT authentication
- Gmail SMTP for emails
- CORS enabled for frontend-backend communication