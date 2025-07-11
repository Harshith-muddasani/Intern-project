import mongoose from 'mongoose';

const offeringSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  src: { type: String, required: true },
});

const Offering = mongoose.model('Offering', offeringSchema);
export default Offering; 