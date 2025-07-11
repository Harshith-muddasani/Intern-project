import mongoose from 'mongoose';

const altarStyleSchema = new mongoose.Schema({
  username: { type: String, required: true },
  name: { type: String, required: true },
  value: { type: String, required: true },
  image: { type: String, required: true },
});

const AltarStyle = mongoose.model('AltarStyle', altarStyleSchema);
export default AltarStyle; 