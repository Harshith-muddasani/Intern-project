import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { sendWelcomeEmail, sendPasswordResetEmail } from '../utils/email.js';

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
    const user = await User.create({ username, email, password: hashed });
    // Send welcome email
    try {
      await sendWelcomeEmail(email, username);
    } catch (emailErr) {
      console.error('Failed to send welcome email:', emailErr);
    }
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
    const token = jwt.sign({ username, email: user.email }, JWT_SECRET, { expiresIn: '2h' });
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
    if (!username && !email) {
      return res.status(400).json({ message: 'Username or email is required.' });
    }
    const user = await User.findOne({ 
      $or: [
        { username: username || undefined },
        { email: email || undefined }
      ]
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 1000 * 60 * 60; // 1 hour
    await user.save();
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetUrl = `${frontendUrl}/reset-password?token=${token}`;
    try {
      await sendPasswordResetEmail(user.email, resetUrl);
    } catch (emailErr) {
      console.error('Failed to send password reset email:', emailErr);
      return res.status(500).json({ message: 'Failed to send password reset email.' });
    }
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