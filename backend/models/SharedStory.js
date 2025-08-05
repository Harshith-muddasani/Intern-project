import mongoose from 'mongoose';

const sharedStorySchema = new mongoose.Schema({
  sharedAltarId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'SharedAltar', 
    required: true 
  },
  text: { 
    type: String, 
    required: true,
    maxlength: 1000 // Limit story length
  },
  author: { 
    type: String, 
    default: 'Anonymous',
    maxlength: 100
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  ipAddress: { 
    type: String // For spam prevention
  },
  isApproved: { 
    type: Boolean, 
    default: true // Auto-approve for now, can add moderation later
  }
});

// Index for efficient lookups
sharedStorySchema.index({ sharedAltarId: 1, createdAt: -1 });

const SharedStory = mongoose.model('SharedStory', sharedStorySchema);
export default SharedStory;