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
import html2canvas from 'html2canvas';
import { useTranslation } from 'react-i18next';
import frame1Img from './assets/Frame1.png';
import frame2Img from './assets/Frame1.jpg';
import { useAuth } from './auth/AuthContext';
import AuthForm from './pages/AuthForm';
import UpdatePasswordForm from './pages/UpdatePasswordForm';
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
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-orange-50 to-white">
      <h1 className="text-4xl font-bold mb-6 text-orange-500">Welcome to MiAltar</h1>
      <p className="mb-8 text-lg text-orange-700">Create, customize, and save your own digital altar experience.</p>
      <div className="flex gap-4">
        <button className="sunrise-btn" onClick={() => navigate('/login')}>Login</button>
        <button className="sunrise-btn" onClick={() => navigate('/register')}>Register</button>
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
  const { user, loading, logout, token } = useAuth();

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

  // Add fixed canvas size
  const FIXED_STAGE_WIDTH = 900;
  const FIXED_STAGE_HEIGHT = 600;

  // Add state for stageWidth and stageHeight
  const [stageWidth, setStageWidth] = useState(FIXED_STAGE_WIDTH);
  const [stageHeight, setStageHeight] = useState(FIXED_STAGE_HEIGHT);

  const handleAddItem = (src, x = 100, y = 100) => {
    setItems([...items, { src, x, y, size: 60, rotation: 0 }]);
  };

  // Drag-and-drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const imageSrc = e.dataTransfer.getData('imageSrc');
    if (!imageSrc) return;
    const altarRect = e.target.getBoundingClientRect();
    const x = e.clientX - altarRect.left;
    const y = e.clientY - altarRect.top;
    handleAddItem(imageSrc, x, y);
  };

  const handleExport = () => {
    const altarElement = document.getElementById('altar-canvas');
    if (!altarElement) return;
    html2canvas(altarElement).then((canvas) => {
      const link = document.createElement('a');
      link.download = 'my-altar.png';
      link.href = canvas.toDataURL();
      link.click();
    });
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

    const newSession = {
      name: sessionName.trim(),
      items,
      altarStyle,
      stageWidth: FIXED_STAGE_WIDTH,
      stageHeight: FIXED_STAGE_HEIGHT,
      timestamp: Date.now(),
    };
    
    try {
      await saveSession(token, newSession);
      setSessions(await getSessions(token));
      setShowSessionDialog(false);
      setSessionName('');
    } catch (e) {
      alert(e.message);
    }
  };

  // Handle session dialog cancel
  const handleCancelSessionName = () => {
    setShowSessionDialog(false);
    setSessionName('');
  };

  // Load session from backend
  const handleLoadSession = (session) => {
    setItems(session.items);
    setAltarStyle(session.altarStyle);
    if (session.stageWidth && session.stageHeight) {
      setStageWidth(session.stageWidth);
      setStageHeight(session.stageHeight);
    } else {
      setStageWidth(FIXED_STAGE_WIDTH);
      setStageHeight(FIXED_STAGE_HEIGHT);
    }
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

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-orange-500 text-xl">Loading...</div>;
  }

  return (
    <>
      {/* Session Naming Dialog */}
      {showSessionDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-md mx-auto flex flex-col items-center justify-center shadow-xl">
            <h3 className="text-2xl font-semibold mb-6 text-center text-orange-600 w-full">
              {t('enterSessionName')}
            </h3>
            <input
              type="text"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              placeholder={t('sessionNamePlaceholder')}
              className="w-4/5 p-3 border border-orange-200 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-orange-400 text-center text-lg"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleConfirmSessionName();
                }
              }}
              autoFocus
            />
            <div className="flex gap-4 justify-center w-full">
              <button
                onClick={handleCancelSessionName}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors border border-gray-200 rounded-lg bg-gray-50"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleConfirmSessionName}
                className="sunrise-btn px-6 py-2 text-lg"
              >
                {t('confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/profile" element={
        <RequireAuth user={user}>
          <>
            <div className="w-full flex">
              <button
                className="sunrise-btn ml-6 mt-2 mb-2"
                onClick={() => navigate(-1)}
              >
                ← Back
              </button>
            </div>
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
              <UpdatePasswordForm />
            </div>
          </>
        </RequireAuth>
      } />
      <Route path="/sessions" element={
        <RequireAuth user={user}>
          <>
            <div className="w-full flex">
              <button
                className="sunrise-btn ml-6 mt-2 mb-2"
                onClick={() => navigate(-1)}
              >
                ← Back
              </button>
            </div>
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
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
                      <div className="flex gap-2">
                        <button className="text-xs px-2 py-1 bg-orange-100 text-orange-600 rounded hover:bg-orange-200" onClick={() => { handleLoadSession(s); navigate('/'); }}>Load</button>
                        <button className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200" onClick={() => handleDeleteSession(s.name)}>Delete</button>
                      </div>
                    )
                  }))}
                />
              )}
            </div>
          </>
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
            {/* Main altar builder UI (existing code) */}
            <>
              <Navbar
                user={user}
                onLogout={logout}
                onProfile={() => navigate('/profile')}
                onViewSessions={() => navigate('/sessions')}
                onAdminPanel={() => navigate('/admin')}
              />
              <h1 className="text-3xl font-bold mb-4 text-center" style={{ color: '#ff5e62' }}>{t('welcome')}</h1>
              <div className="flex flex-1 w-full h-full overflow-hidden main-flex">
                {/* Fixed Sidebar */}
                <aside className="sidebar sunrise-panel w-72 min-w-[220px] max-w-xs h-full p-4 overflow-y-auto border-r flex-shrink-0 bg-[#fff8f0] border-2 border-orange-200 rounded-2xl fixed top-[72px] left-0 z-40" style={{ height: 'calc(100vh - 72px)' }}>
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
                </aside>
                {/* Main Content + Count Box */}
                <main className="flex-1 flex flex-col items-center justify-center h-full w-full overflow-auto relative ml-72" style={{ marginLeft: '18rem' }}>
                  <div className="relative flex-1 flex justify-center items-center h-full w-full">
                    <div
                      id="altar-canvas"
                      className="bg-white rounded overflow-hidden shadow-md w-full h-full flex items-center justify-center sunrise-panel"
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      ref={altarRef}
                      onClick={e => {
                        // Only deselect if the user clicks on the background, not on a sticker
                        if (e.target === e.currentTarget) {
                          setSelectedIdx(null);
                        }
                      }}
                    >
                      <Stage width={FIXED_STAGE_WIDTH} height={FIXED_STAGE_HEIGHT}>
                        <Layer>
                          {bgImage && (
                            <KonvaImage image={bgImage} width={FIXED_STAGE_WIDTH} height={FIXED_STAGE_HEIGHT} />
                          )}
                          {items.map((item, i) => (
                            <DraggableItem
                              key={i}
                              item={item}
                              stageWidth={FIXED_STAGE_WIDTH}
                              stageHeight={FIXED_STAGE_HEIGHT}
                              isSelected={selectedIdx === i}
                              onSelect={() => handleSelectItem(i)}
                              pulse={selectedIdx === i}
                              onDelete={() => handleDeleteItem(i)}
                              rotation={item.rotation || 0}
                            />
                          ))}
                        </Layer>
                      </Stage>
                    </div>
                    {/* Count Box on the right */}
                    <div style={{ position: 'absolute', right: 24, top: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }} className={items.length > 0 ? 'fade-in-right' : ''}>
                      <div className="font-extrabold text-lg mb-1" style={{ color: 'linear-gradient(90deg, #ffb300 0%, #ff5e62 60%, #ff3cac 100%)', background: 'linear-gradient(90deg, #ffb300 0%, #ff5e62 60%, #ff3cac 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '1px', textShadow: '0 2px 8px #ffb30033' }}>
                        {t('totalCount')}
                      </div>
                      <div className="bg-white border-2 border-[#ffb88c] rounded-2xl shadow-lg px-6 py-3 flex flex-col items-center gap-1" style={{ minWidth: 80, justifyContent: 'center' }}>
                        <span className={"text-[#ff5e62] font-extrabold text-2xl drop-shadow " + (items.length > 0 ? 'bounce-in' : '')}>{items.length}</span>
                        <span className="text-xs text-[#ffb88c] tracking-wide">{t('onAltar')}</span>
                      </div>
                    </div>
                  </div>
                  {/* Save Session and Save Altar Buttons */}
                  <div className="mt-2 text-center flex flex-row justify-center gap-4">
                    <button
                      onClick={handleSaveSession}
                      className="sunrise-btn"
                    >
                      {t('saveSession')}
                    </button>
                    <button
                      onClick={handleExport}
                      className="sunrise-btn"
                    >
                      {t('saveAltar')}
                    </button>
                  </div>
                </main>
              </div>
            </>
          </RequireAuth>
        ) : (
          <PublicLanding />
        )
      } />
      <Route path="*" element={<LoginForm />} />
    </Routes>
    </>
  );
}

export default App;
