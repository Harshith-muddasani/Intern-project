import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Stage, Layer, Image as KonvaImage } from 'react-konva';
import useImage from 'use-image';
import { useTranslation } from 'react-i18next';
import { Heart, MessageSquare, Share2, ChevronLeft } from 'lucide-react';
import { getApiUrl } from '../utils/apiConfig';
import '../styles/DarkUI.css';

// Import default backgrounds
import altarClassic from '../assets/altar-classic.jpg';
import altarModern from '../assets/altar-modern.jpg';
import altarTraditional from '../assets/altar-traditional.jpg';

const backgrounds = {
  'Clásico': altarClassic,
  'Moderno': altarModern,
  'Tradicional': altarTraditional
};

// Fixed canvas dimensions for consistency
const FIXED_STAGE_WIDTH = 900;
const FIXED_STAGE_HEIGHT = 600;

function PublicAltarView() {
  const { shareId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const stageRef = useRef(null);
  
  // State for altar data
  const [altarData, setAltarData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for background image
  const [bgImage] = useImage(altarData?.backgroundSrc || altarClassic);
  
  // State for story/memory submission
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [storyText, setStoryText] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [submittingStory, setSubmittingStory] = useState(false);
  
  // State for stories list
  const [stories, setStories] = useState([]);
  const [showStoriesList, setShowStoriesList] = useState(false);

  // Mobile responsive canvas dimensions
  const [canvasSize, setCanvasSize] = useState({
    width: FIXED_STAGE_WIDTH,
    height: FIXED_STAGE_HEIGHT,
    scale: 1
  });

  // Calculate responsive canvas size
  useEffect(() => {
    const updateCanvasSize = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      
      // Mobile breakpoint
      if (screenWidth < 768) {
        const maxWidth = screenWidth - 32; // Account for padding
        const maxHeight = screenHeight * 0.5; // Use 50% of screen height
        
        const scaleX = maxWidth / FIXED_STAGE_WIDTH;
        const scaleY = maxHeight / FIXED_STAGE_HEIGHT;
        const scale = Math.min(scaleX, scaleY, 1); // Don't scale up on larger screens
        
        setCanvasSize({
          width: FIXED_STAGE_WIDTH * scale,
          height: FIXED_STAGE_HEIGHT * scale,
          scale
        });
      } else {
        // Desktop - use original size
        setCanvasSize({
          width: FIXED_STAGE_WIDTH,
          height: FIXED_STAGE_HEIGHT,
          scale: 1
        });
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  // Fetch altar data
  useEffect(() => {
    const fetchAltarData = async () => {
      try {
        const response = await fetch(`${getApiUrl()}/api/public/altar/${shareId}`);
        if (!response.ok) {
          throw new Error('Altar not found or sharing is disabled');
        }
        const data = await response.json();
        setAltarData(data);
        
        // Fetch stories for this altar
        const storiesResponse = await fetch(`${getApiUrl()}/api/public/altar/${shareId}/stories`);
        if (storiesResponse.ok) {
          const storiesData = await storiesResponse.json();
          setStories(storiesData);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAltarData();
  }, [shareId]);

  // Handle story submission
  const handleSubmitStory = async () => {
    if (!storyText.trim()) {
      alert('Please enter your story or memory');
      return;
    }

    setSubmittingStory(true);
    try {
      const response = await fetch(`${getApiUrl()}/api/public/altar/${shareId}/stories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: storyText.trim(),
          author: authorName.trim() || 'Anonymous'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit story');
      }

      // Refresh stories list
      const storiesResponse = await fetch(`${getApiUrl()}/api/public/altar/${shareId}/stories`);
      if (storiesResponse.ok) {
        const storiesData = await storiesResponse.json();
        setStories(storiesData);
      }

      setStoryText('');
      setAuthorName('');
      setShowStoryModal(false);
      alert('Thank you for sharing your memory!');
    } catch (err) {
      alert('Failed to submit story. Please try again.');
    } finally {
      setSubmittingStory(false);
    }
  };

  // Handle sharing
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${altarData.creatorName}'s Digital Altar`,
          text: 'View this beautiful digital altar and share your memories',
          url: window.location.href
        });
      } catch (err) {
        // User cancelled sharing
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      } catch (err) {
        alert('Unable to share. Please copy the URL manually.');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading altar...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Altar Not Available</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            style={{
              backgroundColor: '#3B82F6',
              color: 'white',
              padding: '0.5rem 1.5rem',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              border: 'none'
            }}
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ChevronLeft size={20} />
              <span className="hidden sm:inline">Back to Home</span>
            </button>
            <h1 className="text-xl font-semibold text-gray-800 text-center flex-1">
              {altarData.creatorName}'s Digital Altar
            </h1>
            <button
              onClick={handleShare}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: '#3B82F6',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: 'none'
              }}
            >
              <Share2 size={18} />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6 lg:py-8">
        {/* Altar Display */}
        <div className="bg-white rounded-2xl shadow-lg p-4 lg:p-8 mb-6">
          <div className="flex flex-col items-center">
            <div className="mb-4 text-center">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
                {altarData.sessionName || 'Digital Altar'}
              </h2>
              <p className="text-gray-600">
                Created on {new Date(altarData.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Altar Canvas */}
            <div 
              className="rounded-xl overflow-hidden shadow-lg"
              style={{ 
                width: canvasSize.width,
                height: canvasSize.height
              }}
            >
              <Stage 
                ref={stageRef} 
                width={canvasSize.width} 
                height={canvasSize.height}
                scaleX={canvasSize.scale}
                scaleY={canvasSize.scale}
              >
                <Layer>
                  {bgImage && (
                    <KonvaImage 
                      image={bgImage} 
                      width={FIXED_STAGE_WIDTH} 
                      height={FIXED_STAGE_HEIGHT} 
                    />
                  )}
                  {altarData.items?.map((item, i) => (
                    <AltarItem
                      key={item.id || i}
                      item={item}
                    />
                  ))}
                </Layer>
              </Stage>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => setShowStoryModal(true)}
            className="flex items-center justify-center gap-3 bg-purple-600 text-white p-4 rounded-xl hover:bg-purple-700 transition-colors shadow-lg"
          >
            <MessageSquare size={24} />
            <span className="font-semibold">Share Your Memory</span>
          </button>
          <button
            onClick={() => setShowStoriesList(!showStoriesList)}
            className="flex items-center justify-center gap-3 bg-indigo-600 text-white p-4 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg"
          >
            <Heart size={24} />
            <span className="font-semibold">
              View Memories ({stories.length})
            </span>
          </button>
        </div>

        {/* Stories List */}
        {showStoriesList && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Shared Memories</h3>
            {stories.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No memories shared yet. Be the first to add one!
              </p>
            ) : (
              <div className="space-y-4">
                {stories.map((story, index) => (
                  <div key={index} className="border-l-4 border-purple-400 pl-4 py-3">
                    <p className="text-gray-700 mb-2">{story.text}</p>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>— {story.author}</span>
                      <span>{new Date(story.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Story Submission Modal */}
      {showStoryModal && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-[9999]" style={{ backgroundColor: 'var(--theme-overlay, rgba(0,0,0,0.5))' }}>
          <div className="dark-modal w-full max-w-md p-6">
            <h3 className="text-2xl font-bold mb-4 dark-text">Share Your Memory</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 dark-text">
                  Your name (optional)
                </label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Anonymous"
                  className="w-full p-3 rounded-lg focus:outline-none dark-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 dark-text">
                  Your memory or story
                </label>
                <textarea
                  value={storyText}
                  onChange={(e) => setStoryText(e.target.value)}
                  placeholder="Share a memory, story, or message about this altar..."
                  rows={4}
                  className="w-full p-3 rounded-lg focus:outline-none dark-input resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowStoryModal(false)}
                className="flex-1 py-2 px-4 rounded-lg transition-colors dark-button text-white"
                disabled={submittingStory}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitStory}
                className="flex-1 py-2 px-4 rounded-lg transition-colors dark-button primary text-white"
                disabled={submittingStory}
              >
                {submittingStory ? 'Submitting...' : 'Share Memory'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Component for rendering altar items (non-interactive)
function AltarItem({ item }) {
  const [image] = useImage(item.src);
  
  if (!image) return null;

  return (
    <KonvaImage
      image={image}
      x={item.x}
      y={item.y}
      width={item.size}
      height={item.size}
      rotation={item.rotation || 0}
      offsetX={item.size / 2}
      offsetY={item.size / 2}
    />
  );
}

export default PublicAltarView;