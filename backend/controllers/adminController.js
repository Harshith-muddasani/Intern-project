import User from '../models/User.js';
import Session from '../models/Session.js';
import { sendNewsletter } from '../utils/email.js';

export const getAllUsers = async (req, res) => {
  if (req.user.username !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  try {
    // Return only username and email, excluding the admin's own email
    const users = await User.find({ username: { $ne: 'admin' } }, 'username email');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users.' });
  }
};

export const getAllUsersAndSessions = async (req, res) => {
  if (req.user.username !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  try {
    const allUsers = await User.find({}, { username: 1, _id: 0 });
    const allSessionsArr = await Session.find({});
    const allSessions = {};
    allSessionsArr.forEach(s => {
      if (!allSessions[s.username]) allSessions[s.username] = [];
      allSessions[s.username].push({
        name: s.name,
        items: s.items,
        altarStyle: s.altarStyle,
        timestamp: s.timestamp
      });
    });
    res.json({ users: allUsers, sessions: allSessions });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch admin data.' });
  }
};

// Newsletter sending endpoint (admin only)
export const sendNewsletterToAll = async (req, res) => {
  if (req.user.username !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  const { subject, content, recipients } = req.body;
  if (!subject || !content) return res.status(400).json({ message: 'Subject and content required.' });
  if (!recipients || recipients.length === 0) return res.status(400).json({ message: 'At least one recipient is required.'});

  try {
    let sent = 0, failed = 0;
    // The recipients are expected to be an array of email addresses
    for (const email of recipients) {
      try {
        await sendNewsletter(email, subject, content); // Pass subject here
        sent++;
      } catch (err) {
        failed++;
        console.error('Failed to send newsletter to', email, err);
      }
    }
    res.json({ message: `Newsletter sent to ${sent} users, failed for ${failed}.` });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send newsletter.' });
  }
}; 