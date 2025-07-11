import AltarStyle from '../models/AltarStyle.js';

export const listAltarStyles = async (req, res) => {
  try {
    const styles = await AltarStyle.find({ username: req.user.username });
    res.json(styles);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch altar styles.' });
  }
};

export const createAltarStyle = async (req, res) => {
  const { name, value, image } = req.body;
  if (!name || !value || !image) return res.status(400).json({ message: 'Missing altar style data.' });
  try {
    const exists = await AltarStyle.findOne({ username: req.user.username, name });
    if (exists) return res.status(409).json({ message: 'Style already exists.' });
    const style = await AltarStyle.create({ username: req.user.username, name, value, image });
    res.status(201).json(style);
  } catch (err) {
    res.status(500).json({ message: 'Failed to save altar style.' });
  }
};

export const deleteAltarStyle = async (req, res) => {
  try {
    await AltarStyle.deleteOne({ _id: req.params.id, username: req.user.username });
    res.json({ message: 'Altar style deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete altar style.' });
  }
}; 