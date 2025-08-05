import Session from '../models/Session.js';
import SharedAltar from '../models/SharedAltar.js';
import SharedStory from '../models/SharedStory.js';
import crypto from 'crypto';

// Generate a unique share ID
function generateShareId() {
  return crypto.randomBytes(16).toString('hex');
}

// Get sharing settings for a specific session
export const getSharingSettings = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const username = req.user.username;

    // Verify the session belongs to the user
    const session = await Session.findOne({ _id: sessionId, username });
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Get sharing settings
    const sharedAltar = await SharedAltar.findOne({ sessionId });
    
    if (!sharedAltar) {
      return res.json({ enabled: false, shareId: null });
    }

    res.json({
      enabled: sharedAltar.enabled,
      shareId: sharedAltar.shareId,
      viewCount: sharedAltar.viewCount || 0,
      createdAt: sharedAltar.createdAt,
      lastViewed: sharedAltar.lastViewed
    });
  } catch (error) {
    console.error('Get sharing settings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update sharing settings for a session
export const updateSharingSettings = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { enabled } = req.body;
    const username = req.user.username;

    // Verify the session belongs to the user
    const session = await Session.findOne({ _id: sessionId, username });
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    let sharedAltar = await SharedAltar.findOne({ sessionId });

    if (enabled) {
      if (!sharedAltar) {
        // Create new shared altar
        const shareId = generateShareId();
        sharedAltar = new SharedAltar({
          sessionId,
          shareId,
          enabled: true
        });
      } else {
        // Enable existing shared altar
        sharedAltar.enabled = true;
      }
      await sharedAltar.save();
    } else {
      if (sharedAltar) {
        // Disable sharing
        sharedAltar.enabled = false;
        await sharedAltar.save();
      }
    }

    res.json({
      enabled: sharedAltar?.enabled || false,
      shareId: sharedAltar?.shareId || null,
      viewCount: sharedAltar?.viewCount || 0,
      createdAt: sharedAltar?.createdAt,
      lastViewed: sharedAltar?.lastViewed
    });
  } catch (error) {
    console.error('Update sharing settings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete sharing settings (completely remove sharing)
export const deleteSharingSettings = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const username = req.user.username;

    // Verify the session belongs to the user
    const session = await Session.findOne({ _id: sessionId, username });
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Find and delete the shared altar
    const sharedAltar = await SharedAltar.findOne({ sessionId });
    if (sharedAltar) {
      // Also delete all associated stories
      await SharedStory.deleteMany({ sharedAltarId: sharedAltar._id });
      await SharedAltar.deleteOne({ _id: sharedAltar._id });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Delete sharing settings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get public altar data by share ID
export const getPublicAltar = async (req, res) => {
  try {
    const { shareId } = req.params;

    // Find the shared altar
    const sharedAltar = await SharedAltar.findOne({ 
      shareId, 
      enabled: true 
    }).populate('sessionId');

    if (!sharedAltar) {
      return res.status(404).json({ error: 'Altar not found or sharing is disabled' });
    }

    // Update view count and last viewed
    sharedAltar.viewCount = (sharedAltar.viewCount || 0) + 1;
    sharedAltar.lastViewed = new Date();
    await sharedAltar.save();

    // Get session data
    const session = sharedAltar.sessionId;
    
    // Determine background source
    let backgroundSrc;
    const backgrounds = {
      'Clásico': '/src/assets/altar-classic.jpg',
      'Moderno': '/src/assets/altar-modern.jpg',
      'Tradicional': '/src/assets/altar-traditional.jpg'
    };
    
    // Use custom background if available, otherwise use default
    backgroundSrc = backgrounds[session.altarStyle] || backgrounds['Clásico'];

    res.json({
      sessionName: session.name,
      creatorName: session.username,
      items: session.items,
      altarStyle: session.altarStyle,
      backgroundSrc,
      createdAt: session.timestamp,
      viewCount: sharedAltar.viewCount,
      shareId: sharedAltar.shareId
    });
  } catch (error) {
    console.error('Get public altar error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get stories for a public altar
export const getPublicAltarStories = async (req, res) => {
  try {
    const { shareId } = req.params;

    // Find the shared altar
    const sharedAltar = await SharedAltar.findOne({ 
      shareId, 
      enabled: true 
    });

    if (!sharedAltar) {
      return res.status(404).json({ error: 'Altar not found or sharing is disabled' });
    }

    // Get approved stories
    const stories = await SharedStory.find({
      sharedAltarId: sharedAltar._id,
      isApproved: true
    }).sort({ createdAt: -1 }); // Most recent first

    res.json(stories.map(story => ({
      text: story.text,
      author: story.author,
      createdAt: story.createdAt
    })));
  } catch (error) {
    console.error('Get public altar stories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Add a story to a public altar
export const addPublicAltarStory = async (req, res) => {
  try {
    const { shareId } = req.params;
    const { text, author } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Story text is required' });
    }

    if (text.length > 1000) {
      return res.status(400).json({ error: 'Story text is too long (max 1000 characters)' });
    }

    // Find the shared altar
    const sharedAltar = await SharedAltar.findOne({ 
      shareId, 
      enabled: true 
    });

    if (!sharedAltar) {
      return res.status(404).json({ error: 'Altar not found or sharing is disabled' });
    }

    // Create the story
    const story = new SharedStory({
      sharedAltarId: sharedAltar._id,
      text: text.trim(),
      author: (author && author.trim()) || 'Anonymous',
      ipAddress: req.ip // For potential spam prevention
    });

    await story.save();

    res.json({
      text: story.text,
      author: story.author,
      createdAt: story.createdAt
    });
  } catch (error) {
    console.error('Add public altar story error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};