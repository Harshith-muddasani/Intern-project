import Offering from '../models/Offering.js';

export const listOfferings = async (req, res) => {
  try {
    const offerings = await Offering.find({});
    res.json(offerings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch offerings.' });
  }
};

export const createOffering = async (req, res) => {
  const { name, category, src } = req.body;
  if (!name || !category || !src) return res.status(400).json({ message: 'Missing offering data.' });
  try {
    const exists = await Offering.findOne({ name, category });
    if (exists) return res.status(409).json({ message: 'Offering already exists in this category.' });
    const offering = await Offering.create({ name, category, src });
    res.status(201).json(offering);
  } catch (err) {
    res.status(500).json({ message: 'Failed to save offering.' });
  }
};

export const deleteOffering = async (req, res) => {
  try {
    await Offering.deleteOne({ _id: req.params.id });
    res.json({ message: 'Offering deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete offering.' });
  }
}; 