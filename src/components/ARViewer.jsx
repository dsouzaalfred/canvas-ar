import React, { useEffect, useRef, useState } from 'react';
import { createCanvasModel } from '../utils/createCanvasModel';
import './ARViewer.css';

function ARViewer({ imageData, realWorldSize, onBack }) {
  const modelViewerRef = useRef(null);
  const [modelUrl, setModelUrl] = useState(null);
  const [modelBlob, setModelBlob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugLog, setDebugLog] = useState([]);
  const [useTestModel, setUseTestModel] = useState(false);

  const addDebugLog = (message) => {
    console.log(message);
    setDebugLog(prev => [...prev.slice(-5), `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  // Detect platform
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);

  useEffect(() => {
    if (!imageData) return;

    addDebugLog('Starting model creation...');
    setIsLoading(true);
    setError(null);

    if (useTestModel) {
      addDebugLog('Using test model (Astronaut GLB)');
      setModelUrl('https://modelviewer.dev/shared-assets/models/Astronaut.glb');
      setIsLoading(false);
      return;
    }

    // Convert real-world size to meters
    const inchesToMeters = 0.0254;
    const widthInMeters = (realWorldSize?.width || 24) * inchesToMeters;
    const heightInMeters = (realWorldSize?.height || 18) * inchesToMeters;

    addDebugLog(`Creating model: ${(realWorldSize?.width || 24)}" × ${(realWorldSize?.height || 18)}"`);
    addDebugLog(`Size in meters: ${widthInMeters.toFixed(2)}m × ${heightInMeters.toFixed(2)}m`);

    // Create 3D model from canvas image
    createCanvasModel(imageData, widthInMeters, heightInMeters)
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

    return () => {
      if (modelUrl) {
        URL.revokeObjectURL(modelUrl);
      }
    };
  }, [imageData, useTestModel, realWorldSize]);

  // Monitor AR status
  useEffect(() => {
    if (!modelViewerRef.current || !modelUrl) return;

    const mv = modelViewerRef.current;

    const checkAR = () => {
      if (mv.canActivateAR) {
        addDebugLog('✅ AR is available');
      } else {
        addDebugLog('❌ AR not available');
      }
    };

    // Check after model loads
    const timer = setTimeout(checkAR, 2000);

    // Listen for AR events
    mv.addEventListener('ar-status', (e) => {
      addDebugLog(`AR Status: ${e.detail.status}`);
    });

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
          <p>📱 View your canvas in augmented reality!</p>
          {isIOS && !useTestModel && (
            <p className="ar-hint" style={{ color: '#ff9800', fontWeight: 'bold' }}>
              ⚠️ iOS AR may have limited support with GLB format. Try the test model or use USDZ format.
            </p>
          )}
        </div>
      </div>

      <div className="model-viewer-container">
        <model-viewer
          ref={modelViewerRef}
          src={modelUrl}
          alt="Canvas artwork in AR"
          ar
          ar-modes="webxr scene-viewer quick-look"
          camera-controls
          shadow-intensity="1"
          environment-image="neutral"
          auto-rotate
          ar-scale="auto"
          style={{
            width: '100%',
            height: '70vh',
            backgroundColor: '#f0f0f0',
            borderRadius: '15px'
          }}
          onLoad={() => addDebugLog('Model loaded successfully')}
          onError={(e) => addDebugLog(`Model error: ${e?.detail?.message || 'unknown'}`)}
        >
          <button slot="ar-button" style={{
            backgroundColor: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '30px',
            padding: '15px 30px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            📱 View in AR
          </button>
        </model-viewer>

        <div className="preview-info">
          <h3>3D Canvas Preview</h3>
          <p>👆 Drag to rotate • 🔍 Pinch to zoom • 📱 Tap AR button to place on wall</p>

          {realWorldSize && !useTestModel && (
            <div style={{
              marginTop: '10px',
              padding: '12px',
              background: '#4caf50',
              color: 'white',
              borderRadius: '8px',
              fontWeight: 'bold'
            }}>
              📏 Real Size: {realWorldSize.width}" × {realWorldSize.height}"
              ({(realWorldSize.width * 2.54).toFixed(0)} × {(realWorldSize.height * 2.54).toFixed(0)} cm)
            </div>
          )}

          <div className="controls-row" style={{
            marginTop: '20px',
            display: 'flex',
            gap: '10px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => {
                setUseTestModel(!useTestModel);
                addDebugLog(`Switched to ${!useTestModel ? 'test' : 'custom'} model`);
              }}
              style={{
                padding: '12px 24px',
                background: useTestModel ? '#2196f3' : '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '25px',
                cursor: 'pointer',
                fontSize: '0.95em',
                fontWeight: '600',
                boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
              }}
            >
              {useTestModel ? '🎨 Use Your Canvas' : '🧪 Test with Sample Model'}
            </button>

            {modelUrl && !useTestModel && (
              <a
                href={modelUrl}
                download="canvas-artwork.glb"
                style={{
                  padding: '12px 24px',
                  background: '#2196f3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontSize: '0.95em',
                  fontWeight: '600',
                  textDecoration: 'none',
                  display: 'inline-block',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
                }}
                onClick={() => addDebugLog('Download clicked')}
              >
                💾 Download GLB Model
              </a>
            )}
          </div>

          <div className="debug-panel" style={{
            marginTop: '20px',
            padding: '15px',
            background: '#f5f5f5',
            borderRadius: '12px',
            fontSize: '0.85em',
            textAlign: 'left'
          }}>
            <strong>Debug Info:</strong>
            <div style={{ marginTop: '8px' }}>
              Platform: {isIOS ? '📱 iOS' : isAndroid ? '🤖 Android' : '💻 Desktop'}
            </div>
            <div style={{ marginTop: '4px' }}>
              Model: {useTestModel ? 'Test (Astronaut)' : 'Your Canvas'}
            </div>
            {modelBlob && (
              <div style={{ marginTop: '4px' }}>
                Size: {(modelBlob.size / 1024).toFixed(1)} KB
              </div>
            )}

            <div style={{
              marginTop: '10px',
              padding: '8px',
              background: 'white',
              borderRadius: '6px',
              maxHeight: '120px',
              overflowY: 'auto'
            }}>
              {debugLog.map((log, i) => (
                <div key={i} style={{ marginTop: '2px', color: '#555', fontSize: '0.9em' }}>
                  {log}
                </div>
              ))}
            </div>

            {isIOS && (
              <div style={{
                marginTop: '10px',
                padding: '10px',
                background: '#fff3cd',
                borderRadius: '6px',
                border: '1px solid #ffc107'
              }}>
                <strong style={{ color: '#856404' }}>⚠️ iOS Limitations:</strong>
                <div style={{ fontSize: '0.9em', marginTop: '4px', color: '#856404' }}>
                  • AR Quick Look works best with USDZ format<br/>
                  • GLB format may have limited support<br/>
                  • Try the test model to verify AR works<br/>
                  • Ensure you're using Safari (not Chrome)
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="ar-footer">
        <div className="ar-tips">
          <p>💡 <strong>AR Tips:</strong></p>
          <ul>
            <li>Point your camera at a wall or flat surface</li>
            <li>Move slowly for better tracking</li>
            <li>Good lighting improves AR quality</li>
            <li>You can move and resize the canvas in AR mode</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ARViewer;
