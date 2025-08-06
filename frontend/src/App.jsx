import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Image as KonvaImage } from 'react-konva';
import useImage from 'use-image';
import altarClassic from './assets/altar-classic.jpg';
import altarModern from './assets/altar-modern.jpg';
import altarTraditional from './assets/altar-traditional.jpg';
import candleImg from './assets/candle.png';
import incenseImg from './assets/incense.png';
import flowerImg from './assets/flower.png';
import panImg from './assets/pan.png';
import photoImg from './assets/photo.png';
import ItemPanel from './features/altar/ItemPanel';
import DraggableItem from './features/altar/DraggableItem';
import Navbar from './components/Navbar';
// Remove html2canvas import
// import html2canvas from 'html2canvas';
import { useTranslation } from 'react-i18next';
import frame1Img from './assets/Frame1.png';
import frame2Img from './assets/Frame1.jpg';
import { useAuth } from './hooks/useAuth';
import AuthForm from './pages/AuthForm';
import UpdatePasswordForm from './pages/UpdatePasswordForm';
import './styles/DarkUI.css';
import {
  getAltarStyles,
  addAltarStyle,
  deleteAltarStyle,
  getOfferings,
  addOffering,
  deleteOffering,
  getSessions,
  saveSession,
  deleteSession
} from './auth/api';
import AdminPanel from './pages/AdminPanel';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import TableTemplate from './components/TableTemplate';
import LoginForm from './pages/Login';
import RegisterForm from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import NewsletterDialog from './features/admin/NewsletterDialog'; // Import the new component
import MainLayout from './components/MainLayout'; // Import the new component
import PublicAltarView from './pages/PublicAltarView';
import SharingSettings from './pages/SharingSettings';

const backgrounds = {
  'Clásico': altarClassic,
  'Moderno': altarModern,
  'Tradicional': altarTraditional
};

function RequireAuth({ user, children }) {
  if (!user) return <Navigate to="/" replace />;
  return children;
}

function RequireAdmin({ user, children }) {
  if (!user || user.username !== 'admin') return <Navigate to="/" replace />;
  return children;
}

function PublicLanding() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center transition-colors duration-300"
      style={{ backgroundColor: 'var(--theme-bg)', color: 'var(--theme-text)' }}
    >
      <h1 
        className="text-4xl font-bold mb-6"
        style={{ color: 'var(--theme-accent)' }}
      >
        {t('welcome')}
      </h1>
      <p 
        className="mb-8 text-lg opacity-80"
        style={{ color: 'var(--theme-text)' }}
      >
        Create, customize, and save your own digital altar experience.
      </p>
      <div className="flex gap-4">
        <button 
          style={{
            padding: '0.5rem 1.5rem',
            borderRadius: '0.75rem',
            backgroundColor: '#3B82F6',
            color: 'white',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontSize: '1rem',
            border: 'none',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}
          onClick={() => navigate('/login')}
        >
          {t('login')}
        </button>
        <button 
          style={{
            padding: '0.5rem 1.5rem',
            borderRadius: '0.75rem',
            backgroundColor: '#171717',
            color: 'white',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontSize: '1rem',
            border: '2px solid #333'
          }}
          onClick={() => navigate('/register')}
        >
          {t('register')}
        </button>
      </div>
    </div>
  );
}

function App() {
  // Remove old user state and logic
  // const [user, setUser] = useState(() => { ... });
  // const [loginName, setLoginName] = useState('');
  // const handleLogin = ...
  // const handleLogout = ...
  const { user, loading: authLoading, logout, token } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [showNewsletterDialog, setShowNewsletterDialog] = useState(false);

  // Save user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Sessions state (from backend)
  const [sessions, setSessions] = useState([]);
  useEffect(() => {
    if (token) {
      getSessions(token).then(setSessions).catch(() => setSessions([]));
    } else {
      setSessions([]);
    }
  }, [token]);

  // Altar styles state (CRUD)
  const [altarStyles, setAltarStyles] = useState([]);
  const [offerings, setOfferings] = useState({});

  // Session naming dialog state
  const [showSessionDialog, setShowSessionDialog] = useState(false);
  const [sessionName, setSessionName] = useState('');

  // Fetch altar styles and offerings from backend on login
  useEffect(() => {
    if (token) {
      getAltarStyles(token)
        .then(styles => setAltarStyles(styles))
        .catch(() => setAltarStyles([]));
      getOfferings(token)
        .then(backendOfferings => {
          // Convert flat array to category map
          const byCategory = {};
          backendOfferings.forEach(o => {
            if (!byCategory[o.category]) byCategory[o.category] = [];
            byCategory[o.category].push({ name: o.name, src: o.src, _id: o._id });
          });
          setOfferings(byCategory);
        })
        .catch(() => setOfferings({}));
    } else {
      setAltarStyles([]);
      setOfferings({});
    }
  }, [token]);

  // Handlers for altar styles
  const handleAddAltarStyle = async (style) => {
    const newStyle = await addAltarStyle(token, style);
    setAltarStyles(prev => [...prev, newStyle]);
  };
  const handleDeleteAltarStyle = async (style) => {
    await deleteAltarStyle(token, style._id);
    setAltarStyles(prev => prev.filter(s => s._id !== style._id));
  };

  // Handlers for offerings
  const handleAddOffering = async (offering) => {
    const newOffering = await addOffering(token, offering);
    setOfferings(prev => {
      const updated = { ...prev };
      if (!updated[newOffering.category]) updated[newOffering.category] = [];
      updated[newOffering.category] = [...updated[newOffering.category], { name: newOffering.name, src: newOffering.src, _id: newOffering._id }];
      return updated;
    });
  };
  const handleDeleteOffering = async (item, category) => {
    await deleteOffering(token, item._id);
    setOfferings(prev => {
      const updated = { ...prev };
      updated[category] = updated[category].filter(o => o._id !== item._id);
      if (updated[category].length === 0) delete updated[category];
      return updated;
    });
  };

  const [items, setItems] = useState([]);
  const [altarStyle, setAltarStyle] = useState('Clásico');
  // Find the selected altar style object
  const selectedStyleObj = altarStyles.find(s => s.name === altarStyle);
  // Use the image from the selected style if available, otherwise use the default backgrounds mapping
  const selectedBgSrc = selectedStyleObj && selectedStyleObj.image ? selectedStyleObj.image : backgrounds[altarStyle];
  const [bgImage] = useImage(selectedBgSrc);
  const altarRef = useRef(null);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [resizeValue, setResizeValue] = useState(60);
  const [rotateValue, setRotateValue] = useState(0);
  const { t } = useTranslation();
  // const { user, loading } = useAuth(); // This line is removed as per the edit hint
  const [showProfile, setShowProfile] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showSessionsModal, setShowSessionsModal] = useState(false);
  const navigate = useNavigate();
  const stageRef = useRef(null); // <-- Add this line at the top of App

  // Add fixed canvas size
  const FIXED_STAGE_WIDTH = 900;
  const FIXED_STAGE_HEIGHT = 600;

  // Add state for stageWidth and stageHeight
  const [stageWidth, setStageWidth] = useState(FIXED_STAGE_WIDTH);
  const [stageHeight, setStageHeight] = useState(FIXED_STAGE_HEIGHT);

  const handleAddItem = (src, x = 100, y = 100) => {
    const newItem = { 
      id: Date.now() + Math.random(), // Unique ID for tracking
      src, 
      x: Math.round(x), // Ensure integer coordinates
      y: Math.round(y), // Ensure integer coordinates
      size: 60, 
      rotation: 0 
    };
    setItems([...items, newItem]);
  };

  // Drag-and-drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const imageSrc = e.dataTransfer.getData('imageSrc');
    if (!imageSrc) return;
    
    // Get canvas position relative to the stage
    const stageElement = stageRef.current?.container();
    if (stageElement) {
      const stageRect = stageElement.getBoundingClientRect();
      const x = Math.round(e.clientX - stageRect.left);
      const y = Math.round(e.clientY - stageRect.top);
      
      // Ensure the item is placed within canvas bounds
      const clampedX = Math.max(0, Math.min(x, FIXED_STAGE_WIDTH - 60));
      const clampedY = Math.max(0, Math.min(y, FIXED_STAGE_HEIGHT - 60));
      
      handleAddItem(imageSrc, clampedX, clampedY);
    } else {
      // Fallback to default position
      handleAddItem(imageSrc, 100, 100);
    }
  };

  const handleExport = () => {
    if (stageRef.current) {
      const dataURL = stageRef.current.toDataURL({ pixelRatio: 2 }); // higher quality
      const link = document.createElement('a');
      link.download = 'my-altar.png';
      link.href = dataURL;
      link.click();
    }
  };

  // Handle selecting and resizing items
  const handleSelectItem = (idx) => {
    if (!items[idx]) return;
    setSelectedIdx(idx);
    setResizeValue(items[idx]?.size || 60);
    setRotateValue(items[idx]?.rotation || 0);
  };

  const handleDeleteItem = (idx) => {
    setItems(items.filter((_, i) => i !== idx));
    setSelectedIdx(null);
  };

  // Handle position changes from DraggableItem
  const handleItemPositionChange = (itemIndex, newX, newY) => {
    setItems(prevItems => 
      prevItems.map((item, idx) => 
        idx === itemIndex 
          ? { ...item, x: Math.round(newX), y: Math.round(newY) }
          : item
      )
    );
  };

  const handleResize = (e) => {
    const newSize = Number(e.target.value);
    setResizeValue(newSize);
    setItems(items.map((item, idx) => idx === selectedIdx ? { ...item, size: newSize } : item));
  };

  const handleRotate = (e) => {
    const newRotation = Number(e.target.value);
    setRotateValue(newRotation);
    setItems(items.map((item, idx) => idx === selectedIdx ? { ...item, rotation: newRotation } : item));
  };

  // Save session to backend
  const handleSaveSession = async () => {
    setSessionName('');
    setShowSessionDialog(true);
  };

  // Handle session name confirmation
  const handleConfirmSessionName = async () => {
    if (isSaving) return; // Prevent multiple clicks

    if (!sessionName.trim()) {
      alert('Please enter a session name');
      return;
    }

    // Check if name already exists
    const existingNames = sessions.map(s => s.name);
    if (existingNames.includes(sessionName.trim())) {
      alert('A session with this name already exists. Please choose a different name.');
      return;
    }

    // Ensure all items have accurate positions and properties
    const sanitizedItems = items.map(item => ({
      ...item,
      x: Math.round(item.x || 0),
      y: Math.round(item.y || 0),
      size: item.size || 60,
      rotation: item.rotation || 0
    }));

    const newSession = {
      name: sessionName.trim(),
      items: sanitizedItems,
      altarStyle,
      stageWidth: FIXED_STAGE_WIDTH,
      stageHeight: FIXED_STAGE_HEIGHT,
      timestamp: Date.now(),
      version: '1.0' // For future compatibility
    };
    
    setIsSaving(true); // Disable button
    try {
      await saveSession(token, newSession);
      setSessions(await getSessions(token));
      setShowSessionDialog(false);
      setSessionName('');
    } catch (e) {
      alert(e.message);
    } finally {
      setIsSaving(false); // Re-enable button
    }
  };

  // Handle session dialog cancel
  const handleCancelSessionName = () => {
    setShowSessionDialog(false);
    setSessionName('');
  };

  // Load session from backend
  const handleLoadSession = (session) => {
    // Ensure loaded items have accurate positions and IDs
    const restoredItems = (session.items || []).map((item, index) => ({
      ...item,
      id: item.id || Date.now() + index, // Ensure unique IDs
      x: Math.round(item.x || 0),
      y: Math.round(item.y || 0),
      size: item.size || 60,
      rotation: item.rotation || 0
    }));

    setItems(restoredItems);
    setAltarStyle(session.altarStyle || 'Clásico');
    
    // Always use consistent canvas dimensions
    setStageWidth(FIXED_STAGE_WIDTH);
    setStageHeight(FIXED_STAGE_HEIGHT);
    
    // Clear selection state
    setSelectedIdx(null);
    setResizeValue(60);
    setRotateValue(0);
  };

  // Delete session from backend
  const handleDeleteSession = async (name) => {
    try {
      await deleteSession(token, name);
      setSessions(await getSessions(token));
    } catch (e) {
      alert(e.message);
    }
  };

  // Simple login form
  // const [loginName, setLoginName] = useState(''); // This line is removed as per the edit hint
  // const handleLogin = (e) => { // This line is removed as per the edit hint
  //   e.preventDefault(); // This line is removed as per the edit hint
  //   if (loginName.trim()) { // This line is removed as per the edit hint
  //     setUser({ name: loginName.trim() }); // This line is removed as per the edit hint
  //     setLoginName(''); // This line is removed as per the edit hint
  //   } // This line is removed as per the edit hint
  // }; // This line is removed as per the edit hint
  // const handleLogout = () => setUser(null); // This line is removed as per the edit hint

  const handleSendNewsletter = () => {
    setShowNewsletterDialog(true);
  };

  if (authLoading) {
    return <div className="flex items-center justify-center min-h-screen text-gray-500 text-xl">Loading...</div>;
  }

  return (
    <>
      {/* Session Naming Dialog */}
      {showSessionDialog && (
        <div 
          style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}
        >
          <div 
            style={{
              backgroundColor: '#171717',
              borderRadius: '20px',
              padding: '2rem',
              border: '1px solid #333',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
              width: '100%',
              maxWidth: '400px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <h3 className="dark-text text-2xl font-semibold mb-6 text-center w-full">
              {t('enterSessionName')}
            </h3>
            <input
              type="text"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              placeholder={t('sessionNamePlaceholder')}
              style={{
                width: '80%',
                marginBottom: '1.5rem',
                textAlign: 'center',
                fontSize: '1.125rem',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                border: '2px solid #333',
                backgroundColor: '#171717',
                color: '#d3d3d3',
                outline: 'none'
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleConfirmSessionName();
                }
              }}
              autoFocus
            />
            <div className="flex gap-6 justify-center w-full">
              <button
                onClick={handleCancelSessionName}
                style={{
                  padding: '0.5rem 1.5rem',
                  borderRadius: '0.75rem',
                  border: '2px solid #333',
                  backgroundColor: '#252525',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontSize: '1rem'
                }}
                disabled={isSaving}
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleConfirmSessionName}
                style={{
                  padding: '0.5rem 1.5rem',
                  borderRadius: '0.75rem',
                  backgroundColor: '#3B82F6',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontSize: '1.125rem',
                  border: 'none',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : t('confirm')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Newsletter Dialog */}
      {showNewsletterDialog && (
        <NewsletterDialog
          token={token}
          onClose={() => setShowNewsletterDialog(false)}
        />
      )}

      <div className="min-h-screen" style={{ backgroundColor: '#0a0a0a' }}>
        {/* Update Password Modal (only for /profile route) */}
        <Routes>
          <Route path="/profile" element={
            <RequireAuth user={user}>
              <UpdatePasswordForm />
            </RequireAuth>
          } />
        </Routes>

        <MainLayout onSendNewsletter={handleSendNewsletter}>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/public/altar/:shareId" element={<PublicAltarView />} />
          <Route path="/sharing" element={
            <RequireAuth user={user}>
              <SharingSettings />
            </RequireAuth>
          } />
          <Route path="/sessions" element={
            <RequireAuth user={user}>
              <h2 className="text-xl font-bold mb-4 text-center">Your Saved Sessions</h2>
              {sessions.length === 0 ? (
                <div className="text-gray-500 text-center">No saved sessions.</div>
              ) : (
                <TableTemplate
                  headers={["Name", "Items", "Altar Style", "Actions"]}
                  data={sessions.map(s => ({
                    Name: s.name,
                    Items: s.items.length,
                    "Altar Style": s.altarStyle,
                    Actions: (
                      <div className="flex gap-6">
                        <button 
                          style={{
                            fontSize: '0.75rem',
                            padding: '0.25rem 0.5rem',
                            backgroundColor: '#3B82F6',
                            color: 'white',
                            borderRadius: '0.25rem',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            border: 'none'
                          }}
                          onClick={() => { handleLoadSession(s); navigate('/'); }}
                        >
                          Load
                        </button>
                        <button className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200" onClick={() => handleDeleteSession(s.name)}>Delete</button>
                      </div>
                    )
                  }))}
                />
              )}
            </RequireAuth>
          } />
          <Route path="/admin" element={
            <RequireAdmin user={user}>
              <AdminPanel />
            </RequireAdmin>
          } />
          <Route path="/" element={
            user ? (
              <RequireAuth user={user}>
                <div className="flex flex-1 w-full h-full">
                  <aside 
                    className="w-72 min-w-[220px] max-w-xs p-6 overflow-y-auto flex-shrink-0 transition-colors duration-300 dark-sidebar" 
                    style={{ 
                      backgroundColor: 'var(--theme-card-bg, #171717)',
                      borderRight: `1px solid var(--theme-border, #333)`,
                      color: 'var(--theme-text, #d3d3d3)'
                    }}
                  >
                    <div className="space-y-6">
                      <ItemPanel
                        onAdd={handleAddItem}
                        selectedIdx={selectedIdx}
                        selectedItem={items[selectedIdx] || null}
                        resizeValue={resizeValue}
                        onResize={handleResize}
                        rotateValue={rotateValue}
                        onRotate={handleRotate}
                        altarStyle={altarStyle}
                        setAltarStyle={setAltarStyle}
                        altarStyles={altarStyles}
                        setAltarStyles={setAltarStyles}
                        offerings={Object.values(offerings).flat()}
                        setOfferings={setOfferings}
                        onAddAltarStyle={handleAddAltarStyle}
                        onDeleteAltarStyle={handleDeleteAltarStyle}
                        onAddOffering={handleAddOffering}
                        onDeleteOffering={handleDeleteOffering}
                      />
                    </div>
                  </aside>
                  <main 
                    className="flex-1 flex flex-col items-center justify-center h-full w-full overflow-auto relative transition-colors duration-300" 
                    style={{ 
                      backgroundColor: 'var(--theme-bg)'
                    }}
                  >
                    <h1 
                      className="text-3xl font-bold mb-4 text-center"
                      style={{ color: 'var(--theme-text)' }}
                    >
                      Welcome, {user.username}!
                    </h1>
                    <div
                      id="altar-canvas"
                      className="rounded-2xl overflow-hidden shadow-lg transition-colors duration-300"
                      style={{ backgroundColor: 'var(--theme-canvas)' }}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      ref={altarRef}
                    >
                      <Stage ref={stageRef} width={FIXED_STAGE_WIDTH} height={FIXED_STAGE_HEIGHT}>
                        <Layer>
                          {bgImage && <KonvaImage image={bgImage} width={FIXED_STAGE_WIDTH} height={FIXED_STAGE_HEIGHT} />}
                          {items.map((item, i) => (
                            <DraggableItem
                              key={item.id || i}
                              item={item}
                              stageWidth={FIXED_STAGE_WIDTH}
                              stageHeight={FIXED_STAGE_HEIGHT}
                              isSelected={selectedIdx === i}
                              onSelect={() => handleSelectItem(i)}
                              onDelete={() => handleDeleteItem(i)}
                              onPositionChange={(newX, newY) => handleItemPositionChange(i, newX, newY)}
                              rotation={item.rotation || 0}
                            />
                          ))}
                        </Layer>
                      </Stage>
                    </div>
                                            <div className="mt-4 flex justify-center gap-4 flex-wrap">
                          <button
                            onClick={handleSaveSession}
                            style={{
                              padding: '0.5rem 1.5rem',
                              borderRadius: '0.75rem',
                              backgroundColor: '#3B82F6',
                              color: 'white',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              fontSize: '1rem',
                              border: 'none',
                              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                            }}
                          >
                            {t('saveSession')}
                          </button>
                          <button
                            onClick={handleExport}
                            style={{
                              padding: '0.5rem 1.5rem',
                              borderRadius: '0.75rem',
                              backgroundColor: '#3B82F6',
                              color: 'white',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              fontSize: '1rem',
                              border: 'none',
                              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                            }}
                          >
                            {t('saveAltar')}
                          </button>
                          <button
                            onClick={() => navigate('/sharing')}
                            style={{
                              padding: '0.5rem 1.5rem',
                              borderRadius: '0.75rem',
                              backgroundColor: '#171717',
                              color: 'white',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              fontSize: '1rem',
                              border: '2px solid #333'
                            }}
                          >
                            Share Altar
                          </button>
                        </div>
                  </main>
                </div>
              </RequireAuth>
            ) : (
              <PublicLanding />
            )
          } />
          <Route path="*" element={<LoginForm />} />
        </Routes>
        </MainLayout>
      </div>
    </>
  );
}

export default App;
