import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  username: { type: String, required: true },
  name: { type: String, required: true },
  items: { type: Array, required: true },
  altarStyle: { type: String, required: true },
  timestamp: { type: Number, required: true },
});

const Session = mongoose.model('Session', sessionSchema);
export default Session; 