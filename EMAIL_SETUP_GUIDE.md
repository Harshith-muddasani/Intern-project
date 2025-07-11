# Email Reset Setup Guide

## Overview
This guide will help you configure the email reset functionality for the MiAltar application. The email reset feature allows users to reset their passwords via email.

## Prerequisites
1. A Gmail account
2. MongoDB database (local or Atlas)
3. Node.js and npm installed

## Step 1: Create Environment File

Create a `.env` file in the `backend` directory with the following variables:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/mialtar
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mialtar

# JWT Configuration
JWT_SECRET=your_very_secure_jwt_secret_key_here

# Email Configuration (Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password_here

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Server Configuration
PORT=4000
```

## Step 2: Gmail App Password Setup

### For Gmail Users:
1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Navigate to Security
   - Under "2-Step Verification", click "App passwords"
   - Select "Mail" and "Other (Custom name)"
   - Enter "MiAltar" as the name
   - Copy the generated 16-character password
   - Use this password as your `EMAIL_PASS` in the .env file

### Alternative: Use Gmail with "Less Secure Apps"
⚠️ **Not recommended for production**
- Go to Google Account settings
- Navigate to Security
- Turn on "Less secure app access"
- Use your regular Gmail password as `EMAIL_PASS`

## Step 3: Test Email Configuration

1. **Start the backend server**:
   ```bash
   cd backend
   npm run dev
   ```

2. **Test the email reset**:
   - Go to `http://localhost:5173/forgot-password`
   - Enter a username or email that exists in your database
   - Check if the email is sent successfully

## Step 4: Troubleshooting

### Common Issues:

1. **"Failed to send reset email"**
   - Check if `EMAIL_USER` and `EMAIL_PASS` are set correctly
   - Verify Gmail app password is correct
   - Check console logs for detailed error messages

2. **"Email service not configured"**
   - Ensure `.env` file exists in backend directory
   - Verify environment variables are loaded correctly

3. **"Authentication failed"**
   - Double-check Gmail credentials
   - Ensure 2FA is enabled and app password is used
   - Try the SMTP fallback configuration

4. **"User not found"**
   - Verify the user exists in the database
   - Check if username/email is entered correctly

### Debug Information:
The improved email reset system now provides detailed error messages:
- Check browser console for frontend errors
- Check backend console for server-side errors
- Email configuration errors will show specific details

## Step 5: Production Considerations

### For Production Deployment:
1. **Use a dedicated email service** like SendGrid, Mailgun, or AWS SES
2. **Update email configuration** in the authController.js
3. **Set proper environment variables** on your hosting platform
4. **Use HTTPS** for the frontend URL
5. **Implement rate limiting** for password reset requests

### Security Best Practices:
1. **Use strong JWT secrets**
2. **Implement rate limiting** (max 3 requests per hour per email)
3. **Log security events** for monitoring
4. **Use environment variables** for all sensitive data
5. **Regularly rotate app passwords**

## Step 6: Alternative Email Services

If Gmail doesn't work, you can modify the email configuration in `backend/controllers/authController.js`:

### SendGrid Example:
```javascript
const transporter = nodemailer.createTransporter({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY
  }
});
```

### Mailgun Example:
```javascript
const transporter = nodemailer.createTransporter({
  host: 'smtp.mailgun.org',
  port: 587,
  auth: {
    user: process.env.MAILGUN_USER,
    pass: process.env.MAILGUN_PASS
  }
});
```

## Support

If you continue to experience issues:
1. Check the backend console logs for detailed error messages
2. Verify your Gmail app password is correct
3. Ensure all environment variables are properly set
4. Test with a different email service if needed

The improved email reset system includes better error handling and multiple fallback options to ensure reliability. 