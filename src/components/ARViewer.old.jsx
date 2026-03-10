import React, { useEffect, useRef, useState } from 'react';
import { createCanvasModel } from '../utils/createCanvasModel';
import './ARViewer.css';

function ARViewer({ imageData, onBack }) {
  const modelViewerRef = useRef(null);
  const [modelUrl, setModelUrl] = useState(null);
  const [modelBlob, setModelBlob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugLog, setDebugLog] = useState([]);
  const [arStatus, setArStatus] = useState('');
  const [useTestModel, setUseTestModel] = useState(false);

  const addDebugLog = (message) => {
    console.log(message);
    setDebugLog(prev => [...prev.slice(-4), `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  // Detect if iOS
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  // Handle AR button click manually
  const handleARClick = (e) => {
    addDebugLog('AR link clicked (handler)');
    
    // Check if model URL is valid
    if (!modelUrl || modelUrl === '') {
      e.preventDefault();
      addDebugLog('ERROR: Model URL is empty');
      setError('Model not ready. Please try again.');
      return;
    }
    
    addDebugLog(`Model URL: ${modelUrl.substring(0, 50)}...`);
    addDebugLog('Attempting to launch AR Quick Look...');
    
    // Let the browser handle the rel="ar" naturally
    // Don't prevent default - let iOS process it
  };

  useEffect(() => {
    if (!imageData) return;

    addDebugLog('Starting AR model creation...');
    setIsLoading(true);
    setError(null);

    if (useTestModel) {
      // Use a known working model for testing
      addDebugLog('Using test model');
      setModelUrl('https://modelviewer.dev/shared-assets/models/Astronaut.glb');
      setIsLoading(false);
      return;
    }

    // Create 3D model from the canvas image
    createCanvasModel(imageData, 1.5, 1.0)
      .then((blob) => {
        addDebugLog(`Model created: ${(blob.size / 1024).toFixed(1)} KB`);
        const url = URL.createObjectURL(blob);
        setModelBlob(blob);
        setModelUrl(url);
        setIsLoading(false);
      })
      .catch((err) => {
        addDebugLog(`Error: ${err.message}`);
        setError('Failed to create AR model. Please try again.');
        setIsLoading(false);
      });

    // Cleanup: revoke object URL when component unmounts
    return () => {
      if (modelUrl) {
        URL.revokeObjectURL(modelUrl);
      }
    };
  }, [imageData]);

  // Check AR support periodically
  useEffect(() => {
    if (!modelViewerRef.current) return;
    
    const checkAR = () => {
      const mv = modelViewerRef.current;
      if (mv) {
        const canAR = mv.canActivateAR;
        setArStatus(canAR ? 'AR Ready' : 'AR Not Available');
        addDebugLog(`AR Status: ${canAR ? 'Ready' : 'Not Available'}`);
        
        // Listen for AR events
        mv.addEventListener('ar-status', (event) => {
          addDebugLog(`AR Status Event: ${event.detail.status}`);
        });
        
        mv.addEventListener('ar-tracking', (event) => {
          addDebugLog(`AR Tracking: ${event.detail.status}`);
        });
        
        mv.addEventListener('quick-look-button-tapped', () => {
          addDebugLog('Quick Look button tapped');
        });
      }
    };
    
    // Check after a delay to let model-viewer initialize
    const timer = setTimeout(checkAR, 2000);
    return () => clearTimeout(timer);
  }, [modelUrl]);

  if (isLoading) {
    return (
      <div className="ar-viewer">
        <div className="ar-overlay">
          <div className="ar-header">
            <button className="btn-back-round" onClick={onBack}>
              ← Back
            </button>
            <h2>Preparing AR Model...</h2>
          </div>
        </div>
        <div className="ar-loading">
          <div className="spinner"></div>
          <p>Creating your 3D canvas model...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ar-viewer">
        <div className="ar-overlay">
          <div className="ar-header">
            <button className="btn-back-round" onClick={onBack}>
              ← Back
            </button>
            <h2>Error</h2>
          </div>
        </div>
        <div className="ar-error-message">
          <p>{error}</p>
          <button className="btn-retry" onClick={onBack}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ar-viewer">
      <div className="ar-overlay">
        <div className="ar-header">
          <button className="btn-back-round" onClick={onBack}>
            ← Back
          </button>
          <h2>Canvas AR Preview</h2>
        </div>

        <div className="ar-instructions">
          <p>📱 Tap the AR button below to view your canvas on your wall!</p>
          <p className="ar-hint">iOS: Uses AR Quick Look | Android: Uses Scene Viewer</p>
        </div>
      </div>

      <div className="model-viewer-container">
        {isIOS ? (
          // iOS-specific AR Quick Look implementation
          <div className="ios-ar-container">
            <div className="ios-preview" style={{
              width: '100%',
              height: '70vh',
              backgroundColor: '#f0f0f0',
              borderRadius: '15px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              backgroundImage: `url(${imageData})`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.3)',
                borderRadius: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <a
                  href={modelUrl}
                  rel="ar"
                  download="canvas.glb"
                  className="ar-view-button-ios"
                  onClick={handleARClick}
                >
                  <img 
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" 
                    alt="AR"
                    style={{ display: 'none' }}
                  />
                  📱 View in Your Space
                </a>
                
                <div style={{
                  marginTop: '20px',
                  color: 'white',
                  fontSize: '0.9em',
                  textAlign: 'center'
                }}>
                  <p>If AR doesn't open:</p>
                  <a
                    href={modelUrl}
                    download="canvas-artwork.glb"
                    style={{
                      color: '#ffeb3b',
                      textDecoration: 'underline',
                      fontSize: '1em',
                      fontWeight: 'bold'
                    }}
                    onClick={() => addDebugLog('Download link clicked')}
                  >
                    Download 3D Model
                  </a>
                  <br/>
                  <button
                    onClick={() => {
                      setUseTestModel(!useTestModel);
                      addDebugLog(`Switched to ${!useTestModel ? 'test' : 'custom'} model`);
                    }}
                    style={{
                      marginTop: '10px',
                      padding: '8px 16px',
                      background: '#4caf50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      fontSize: '0.9em'
                    }}
                  >
                    {useTestModel ? 'Use Your Canvas' : 'Test with Sample Model'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Standard model-viewer for Android
          <model-viewer
            ref={modelViewerRef}
            src={modelUrl}
            alt="Canvas artwork in AR"
            ar
            ar-modes="scene-viewer quick-look"
            ar-scale="auto"
            camera-controls
            shadow-intensity="1"
            environment-image="neutral"
            ios-src={modelUrl}
            interaction-prompt="none"
            xr-environment
            style={{
              width: '100%',
              height: '70vh',
              backgroundColor: '#f0f0f0'
            }}
            onLoad={() => addDebugLog('Model loaded')}
            onError={(e) => addDebugLog(`Model error: ${e.detail?.type || 'unknown'}`)}
          >
            <button slot="ar-button" className="ar-view-button">
              📱 View in Your Space
            </button>
            
            <div className="progress-bar" slot="progress-bar">
              <div className="update-bar"></div>
            </div>
          </model-viewer>
        )}
        
        <div className="preview-info">
          <h3>3D Canvas Preview</h3>
          <p>👆 Drag to rotate • 🔍 Pinch to zoom • 📱 Tap AR button to place on wall</p>
          
          <div className="controls-row" style={{ marginTop: '15px', display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                setUseTestModel(!useTestModel);
                addDebugLog(`Switched to ${!useTestModel ? 'test' : 'custom'} model`);
              }}
              style={{
                padding: '10px 20px',
                background: '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '25px',
                cursor: 'pointer',
                fontSize: '0.95em',
                fontWeight: '600'
              }}
            >
              {useTestModel ? '🎨 Use Your Canvas' : '🧪 Test AR'}
            </button>
            
            {modelUrl && (
              <a
                href={modelUrl}
                download="canvas-artwork.glb"
                style={{
                  padding: '10px 20px',
                  background: '#2196f3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontSize: '0.95em',
                  fontWeight: '600',
                  textDecoration: 'none',
                  display: 'inline-block'
                }}
                onClick={() => addDebugLog('Download clicked')}
              >
                💾 Download Model
              </a>
            )}
          </div>
          <h3>Preview Mode</h3>
          <p>👆 Drag to rotate • 🔍 Pinch to zoom</p>
          <p>Tap "View in Your Space" to see it in AR on your wall!</p>
          
          <div className="debug-panel">
            <div className="ar-status-badge" style={{ 
              background: arStatus === 'AR Ready' ? '#4caf50' : '#ff9800',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '20px',
              display: 'inline-block',
              fontWeight: 'bold',
              fontSize: '0.9em',
              marginTop: '10px'
            }}>
              {arStatus || 'Checking AR...'}
            </div>
            
            {modelBlob && (
              <p style={{ fontSize: '0.85em', opacity: 0.7, marginTop: '10px' }}>
                Model Size: {(modelBlob.size / 1024).toFixed(1)} KB
              </p>
            )}
            
            <div className="debug-log" style={{
              marginTop: '15px',
              padding: '10px',
              background: '#f5f5f5',
              borderRadius: '8px',
              fontSize: '0.75em',
              textAlign: 'left',
              maxHeight: '100px',
              overflowY: 'auto'
            }}>
              <strong>Debug Log:</strong>
              <div style={{ marginTop: '4px', color: '#555' }}>
                Device: {isIOS ? 'iOS' : 'Other'}
              </div>
              <div style={{ marginTop: '4px', color: '#555' }}>
                Model URL Valid: {modelUrl ? 'Yes' : 'No'}
              </div>
              {debugLog.map((log, i) => (
                <div key={i} style={{ marginTop: '4px', color: '#555' }}>
                  {log}
                </div>
              ))}
              
              {modelUrl && (
                <div style={{ marginTop: '8px', padding: '8px', background: '#e3f2fd', borderRadius: '4px' }}>
                  <strong style={{ color: '#1976d2' }}>Troubleshooting:</strong>
                  <div style={{ fontSize: '0.85em', marginTop: '4px', color: '#555' }}>
                    • Make sure you're using Safari (not Chrome)<br/>
                    • iOS 12+ required for AR Quick Look<br/>
                    • Try the test model button above<br/>
                    • If AR doesn't work, GLB format may not be supported
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="ar-footer">
        <div className="ar-tips">
          <p>💡 <strong>AR Tips:</strong></p>
          <ul>
            <li>Point your camera at a wall or flat surface</li>
            <li>Move slowly for better detection</li>
            <li>Good lighting improves AR quality</li>
            <li>You can resize and rotate the canvas in AR</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ARViewer;