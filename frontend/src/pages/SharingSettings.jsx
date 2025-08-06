import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { Share2, Eye, EyeOff, Copy, Trash2, Settings } from 'lucide-react';
import { getApiUrl } from '../utils/apiConfig';

function SharingSettings() {
  const { user, token } = useAuth();
  const { t } = useTranslation();
  
  // State for sessions and their sharing settings
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  
  // Fetch user sessions and their sharing status
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch(`${getApiUrl()}/sessions`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const sessionsData = await response.json();
          
          // Fetch sharing settings for each session
          const sessionsWithSharing = await Promise.all(
            sessionsData.map(async (session) => {
              try {
                const sharingResponse = await fetch(`${getApiUrl()}/api/sessions/${session._id}/sharing`, {
                  headers: {
                    'Authorization': `Bearer ${token}`
                  }
                });
                
                if (sharingResponse.ok) {
                  const sharingData = await sharingResponse.json();
                  return { ...session, sharing: sharingData };
                }
                return { ...session, sharing: { enabled: false, shareId: null } };
              } catch (err) {
                return { ...session, sharing: { enabled: false, shareId: null } };
              }
            })
          );
          
          setSessions(sessionsWithSharing);
        } else {
          setError('Failed to load sessions. Please try again.');
          setSessions([]);
        }
      } catch (err) {
        console.error('Failed to fetch sessions:', err);
        setError('Unable to connect to server. Please check your connection and try again.');
        setSessions([]);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchSessions();
    }
  }, [token]);

  // Toggle sharing for a session
  const handleToggleSharing = async (sessionId, currentStatus) => {
    setUpdating(true);
    try {
      const response = await fetch(`${getApiUrl()}/api/sessions/${sessionId}/sharing`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          enabled: !currentStatus
        })
      });

      if (response.ok) {
        const updatedSharing = await response.json();
        setSessions(sessions.map(session => 
          session._id === sessionId 
            ? { ...session, sharing: updatedSharing }
            : session
        ));
      }
    } catch (err) {
      alert('Failed to update sharing settings');
    } finally {
      setUpdating(false);
    }
  };

  // Copy share link to clipboard
  const handleCopyLink = async (shareId) => {
    const shareUrl = `${window.location.origin}/public/altar/${shareId}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert('Share link copied to clipboard!');
    } catch (err) {
      alert('Failed to copy link to clipboard');
    }
  };

  // Delete sharing (disable and remove share ID)
  const handleDeleteSharing = async (sessionId) => {
    if (!confirm('Are you sure you want to stop sharing this altar? The current share link will no longer work.')) {
      return;
    }

    setUpdating(true);
    try {
      const response = await fetch(`${getApiUrl()}/api/sessions/${sessionId}/sharing`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setSessions(sessions.map(session => 
          session._id === sessionId 
            ? { ...session, sharing: { enabled: false, shareId: null } }
            : session
        ));
      }
    } catch (err) {
      alert('Failed to delete sharing settings');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading sharing settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: 'var(--theme-bg)' }}
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="text-blue-600" size={32} />
            <h1 
              className="text-3xl font-bold"
              style={{ color: 'var(--theme-text)' }}
            >
              Sharing Settings
            </h1>
          </div>
          <p 
            className="text-lg opacity-80"
            style={{ color: 'var(--theme-text)' }}
          >
            Manage which of your altars are shared publicly and control access permissions.
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div 
            className="rounded-2xl p-6 text-center shadow-lg mb-6 border-l-4 border-red-500"
            style={{ backgroundColor: 'var(--theme-card-bg)' }}
          >
            <div className="text-red-500 text-4xl mb-3">⚠️</div>
            <h3 className="text-lg font-semibold mb-2 text-red-600">
              Error Loading Sessions
            </h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => {
                setError(null);
                setLoading(true);
                if (token) {
                  // Retry fetching sessions
                  const fetchSessions = async () => {
                    try {
                      const response = await fetch(`${getApiUrl()}/sessions`, {
                        headers: {
                          'Authorization': `Bearer ${token}`
                        }
                      });
                      
                      if (response.ok) {
                        const sessionsData = await response.json();
                        
                        // Fetch sharing settings for each session
                        const sessionsWithSharing = await Promise.all(
                          sessionsData.map(async (session) => {
                            try {
                              const sharingResponse = await fetch(`${getApiUrl()}/api/sessions/${session._id}/sharing`, {
                                headers: {
                                  'Authorization': `Bearer ${token}`
                                }
                              });
                              
                              if (sharingResponse.ok) {
                                const sharingData = await sharingResponse.json();
                                return { ...session, sharing: sharingData };
                              }
                              return { ...session, sharing: { enabled: false, shareId: null } };
                            } catch (err) {
                              return { ...session, sharing: { enabled: false, shareId: null } };
                            }
                          })
                        );
                        
                        setSessions(sessionsWithSharing);
                      } else {
                        setError('Failed to load sessions. Please try again.');
                        setSessions([]);
                      }
                    } catch (err) {
                      console.error('Failed to fetch sessions:', err);
                      setError('Unable to connect to server. Please check your connection and try again.');
                      setSessions([]);
                    } finally {
                      setLoading(false);
                    }
                  };
                  fetchSessions();
                }
              }}
              style={{
                padding: '0.5rem 1.5rem',
                borderRadius: '0.5rem',
                backgroundColor: '#3B82F6',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontSize: '1rem',
                border: 'none',
                fontWeight: '500'
              }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Sessions List */}
        {!error && sessions.length === 0 ? (
          <div 
            className="rounded-2xl p-8 text-center shadow-lg"
            style={{ backgroundColor: 'var(--theme-card-bg)' }}
          >
            <div className="text-gray-400 text-6xl mb-4">📱</div>
            <h3 
              className="text-xl font-semibold mb-2"
              style={{ color: 'var(--theme-text)' }}
            >
              No Saved Altars
            </h3>
            <p 
              className="opacity-70 mb-4"
              style={{ color: 'var(--theme-text)' }}
            >
              Create and save some altars first to enable sharing.
            </p>
            <button
              onClick={() => window.location.href = '/'}
              style={{
                padding: '0.5rem 1.5rem',
                borderRadius: '0.5rem',
                backgroundColor: '#3B82F6',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontSize: '1rem',
                border: 'none',
                fontWeight: '500'
              }}
            >
              Create Altar
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div 
                key={session._id}
                className="rounded-2xl p-6 shadow-lg transition-colors duration-300"
                style={{ backgroundColor: 'var(--theme-card-bg)' }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Session Info */}
                  <div className="flex-1">
                    <h3 
                      className="text-xl font-semibold mb-2"
                      style={{ color: 'var(--theme-text)' }}
                    >
                      {session.name}
                    </h3>
                    <div 
                      className="text-sm opacity-70 space-y-1"
                      style={{ color: 'var(--theme-text)' }}
                    >
                      <p>{session.items?.length || 0} items • {session.altarStyle} style</p>
                      <p>Created: {new Date(session.timestamp).toLocaleDateString()}</p>
                      {session.sharing?.enabled && (
                        <p className="text-green-600 font-medium">
                          ✓ Publicly shared
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Sharing Controls */}
                  <div className="flex flex-col sm:flex-row gap-3 min-w-0">
                    {/* Toggle Sharing */}
                    <button
                      onClick={() => handleToggleSharing(session._id, session.sharing?.enabled)}
                      disabled={updating}
                      className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 min-w-[120px] ${
                        session.sharing?.enabled
                          ? 'bg-green-500 text-white hover:bg-green-600 shadow-lg'
                          : 'bg-gray-500 text-white hover:bg-gray-600 shadow-lg'
                      }`}
                    >
                      {session.sharing?.enabled ? (
                        <>
                          <Eye size={18} />
                          <span>Public</span>
                        </>
                      ) : (
                        <>
                          <EyeOff size={18} />
                          <span>Private</span>
                        </>
                      )}
                    </button>

                    {/* Copy Link (only if sharing is enabled) */}
                    {session.sharing?.enabled && session.sharing?.shareId && (
                      <button
                        onClick={() => handleCopyLink(session.sharing.shareId)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem',
                          padding: '0.75rem 1.5rem',
                          backgroundColor: '#3B82F6',
                          color: 'white',
                          borderRadius: '0.75rem',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          fontWeight: '500',
                          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                          minWidth: '120px',
                          border: 'none'
                        }}
                      >
                        <Copy size={18} />
                        <span>Copy Link</span>
                      </button>
                    )}

                    {/* Delete Sharing (only if sharing is enabled) */}
                    {session.sharing?.enabled && (
                      <button
                        onClick={() => handleDeleteSharing(session._id)}
                        disabled={updating}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-300 disabled:opacity-50 font-medium shadow-lg min-w-[120px]"
                      >
                        <Trash2 size={18} />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Share URL Display (when enabled) */}
                {session.sharing?.enabled && session.sharing?.shareId && (
                  <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--theme-border)' }}>
                    <label 
                      className="block text-sm font-medium mb-2"
                      style={{ color: 'var(--theme-text)' }}
                    >
                      Public Share URL:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={`${window.location.origin}/public/altar/${session.sharing.shareId}`}
                        readOnly
                        className="flex-1 p-2 rounded-lg text-sm"
                        style={{ 
                          backgroundColor: 'var(--theme-input)',
                          border: `1px solid var(--theme-input-border)`,
                          color: 'var(--theme-text)'
                        }}
                      />
                      <button
                        onClick={() => handleCopyLink(session.sharing.shareId)}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: '#3B82F6',
                          color: 'white',
                          borderRadius: '0.5rem',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontWeight: '500',
                          border: 'none'
                        }}
                      >
                        <Copy size={16} />
                        <span className="hidden sm:inline">Copy</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Info Box */}
        <div 
          className="mt-8 rounded-2xl p-6 shadow-lg"
          style={{ backgroundColor: 'var(--theme-card-bg)' }}
        >
          <h4 
            className="text-lg font-semibold mb-3"
            style={{ color: 'var(--theme-text)' }}
          >
            How Sharing Works
          </h4>
          <ul 
            className="space-y-2 text-sm opacity-80"
            style={{ color: 'var(--theme-text)' }}
          >
            <li>• When you enable sharing, a unique link is generated for your altar</li>
            <li>• Anyone with the link can view your altar and add their own stories/memories</li>
            <li>• Your altar remains read-only - visitors cannot modify the arrangement</li>
            <li>• You can disable sharing at any time, which will make the link inactive</li>
            <li>• Stories and memories from visitors are preserved even if you disable sharing</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SharingSettings;