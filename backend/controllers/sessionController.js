import Session from '../models/Session.js';

export const listSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ username: req.user.username });
    
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch sessions.' });
  }
};

export const saveSession = async (req, res) => {
  const { name, items, altarStyle, timestamp } = req.body;
  if (!name || !items || !altarStyle || !timestamp) return res.status(400).json({ message: 'Missing session data.' });
  try {
    await Session.findOneAndDelete({ username: req.user.username, name });
    await Session.create({ username: req.user.username, name, items, altarStyle, timestamp });
    res.json({ message: 'Session saved.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to save session.' });
  }
};

export const deleteSession = async (req, res) => {
  const { name } = req.params;
  try {
    await Session.deleteOne({ username: req.user.username, name });
    res.json({ message: 'Session deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete session.' });
  }
}; 