import User from '../models/User.js';
import Session from '../models/Session.js';

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