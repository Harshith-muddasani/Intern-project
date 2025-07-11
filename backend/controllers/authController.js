import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

export const register = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ message: 'Username, email, and password required.' });
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(409).json({ message: 'User already exists.' });
    const existingEmail = await User.findOne({ email });
    if (existingEmail) return res.status(409).json({ message: 'Email already in use.' });
    const hashed = await bcrypt.hash(password, 10);
    await User.create({ username, email, password: hashed });
    res.status(201).json({ message: 'User registered.' });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed.' });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: 'Invalid credentials.' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials.' });
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '2h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Login failed.' });
  }
};

export const profile = (req, res) => {
  res.json({ username: req.user.username });
};

export const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) return res.status(400).json({ message: 'Current and new password required.' });
  try {
    const user = await User.findOne({ username: req.user.username });
    if (!user) return res.status(404).json({ message: 'User not found.' });
    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) return res.status(401).json({ message: 'Current password is incorrect.' });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Password updated.' });
  } catch (err) {
    res.status(500).json({ message: 'Password update failed.' });
  }
};

export const requestPasswordReset = async (req, res) => {
  const { username, email } = req.body;
  
  try {
    // Validate input
    if (!username && !email) {
      return res.status(400).json({ message: 'Username or email is required.' });
    }

    // Find user by username or email
    const user = await User.findOne({ 
      $or: [
        { username: username || undefined },
        { email: email || undefined }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Generate reset token
    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 1000 * 60 * 60; // 1 hour
    await user.save();

    // Check if email configuration exists
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('Email configuration missing. Please set EMAIL_USER and EMAIL_PASS in .env file');
      return res.status(500).json({ 
        message: 'Email service not configured. Please contact administrator.',
        debug: 'EMAIL_USER or EMAIL_PASS not set in environment variables'
      });
    }

    // Create email transporter with multiple options
    let transporter;
    try {
      // Try Gmail first
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
        secure: true,
        tls: {
          rejectUnauthorized: false
        }
      });

      // Verify connection
      await transporter.verify();
      console.log('Gmail transporter verified successfully');
    } catch (gmailError) {
      console.error('Gmail configuration failed:', gmailError.message);
      
      // Fallback to SMTP with different configurations
      try {
        transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
          tls: {
            rejectUnauthorized: false
          }
        });
        
        await transporter.verify();
        console.log('SMTP transporter verified successfully');
      } catch (smtpError) {
        console.error('SMTP configuration also failed:', smtpError.message);
        return res.status(500).json({ 
          message: 'Failed to configure email service.',
          debug: 'Both Gmail and SMTP configurations failed'
        });
      }
    }

    // Create reset URL
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetUrl = `${frontendUrl}/reset-password?token=${token}`;

    // Email content
    const mailOptions = {
      from: `"MiAltar Support" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Password Reset Request - MiAltar',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #f97316;">Password Reset Request</h2>
          <p>Hello ${user.username},</p>
          <p>You requested a password reset for your MiAltar account.</p>
          <p>Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p>Or copy and paste this link in your browser:</p>
          <p style="word-break: break-all; color: #666;">${resetUrl}</p>
          <p><strong>This link will expire in 1 hour.</strong></p>
          <p>If you didn't request this password reset, please ignore this email.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">
            This is an automated message from MiAltar. Please do not reply to this email.
          </p>
        </div>
      `,
      text: `Password Reset Request\n\nHello ${user.username},\n\nYou requested a password reset for your MiAltar account.\n\nClick this link to reset your password: ${resetUrl}\n\nThis link will expire in 1 hour.\n\nIf you didn't request this password reset, please ignore this email.`
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully:', info.messageId);
    
    res.json({ 
      message: 'Password reset email sent successfully.',
      debug: 'Email sent to ' + user.email
    });

  } catch (err) {
    console.error('Password reset error:', err);
    res.status(500).json({ 
      message: 'Failed to send password reset email.',
      debug: err.message
    });
  }
};

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  
  if (!token || !newPassword) {
    return res.status(400).json({ message: 'Token and new password are required.' });
  }

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token.' });
    }

    // Hash new password
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    console.log('Password reset successful for user:', user.username);
    res.json({ message: 'Password has been reset successfully.' });
  } catch (err) {
    console.error('Password reset error:', err);
    res.status(500).json({ message: 'Failed to reset password.' });
  }
}; 