import mongoose from 'mongoose';

const sharedAltarSchema = new mongoose.Schema({
  sessionId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Session', 
    required: true 
  },
  shareId: { 
    type: String, 
    required: true, 
    unique: true,
    index: true
  },
  enabled: { 
    type: Boolean, 
    default: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  viewCount: { 
    type: Number, 
    default: 0 
  },
  lastViewed: { 
    type: Date 
  }
});

// Index for efficient lookups
sharedAltarSchema.index({ sessionId: 1 });

const SharedAltar = mongoose.model('SharedAltar', sharedAltarSchema);
export default SharedAltar;