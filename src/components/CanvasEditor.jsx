import React, { useRef, useEffect, useState } from 'react';
import './CanvasEditor.css';

function CanvasEditor({ onImageUpload, onViewAR, currentImage }) {
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [image, setImage] = useState(null);
  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 400 });
  const [realWorldSize, setRealWorldSize] = useState({ width: 24, height: 18, unit: 'inches' });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw image if exists
    if (image) {
      const img = new Image();
      img.onload = () => {
        // Calculate scaling to fit canvas while maintaining aspect ratio
        const scale = Math.min(
          canvas.width / img.width,
          canvas.height / img.height
        );
        const x = (canvas.width - img.width * scale) / 2;
        const y = (canvas.height - img.height * scale) / 2;
        
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        
        // Save image data with real-world size
        onImageUpload({
          imageData: canvas.toDataURL('image/png'),
          realWorldSize: realWorldSize
        });
      };
      img.src = image;
    } else {
      // Draw placeholder text
      ctx.fillStyle = '#cccccc';
      ctx.font = '24px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Upload an image to get started', canvas.width / 2, canvas.height / 2);
    }
  }, [image, canvasSize, realWorldSize, onImageUpload]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleClear = () => {
    setImage(null);
    onImageUpload(null);
  };

  const convertToInches = (value, unit) => {
    return unit === 'cm' ? value / 2.54 : value;
  };

  const displayValue = (value, unit) => {
    return unit === 'cm' ? Math.round(value * 2.54) : value;
  };

  return (
    <div className="canvas-editor">
      <div className="editor-container">
        <h1>Canvas AR Studio</h1>
        <p className="subtitle">Upload your artwork and visualize it on your wall</p>
        
        <div className="canvas-wrapper">
          <canvas
            ref={canvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            className="main-canvas"
          />
        </div>

        <div className="controls">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            style={{ display: 'none' }}
          />
          
          <button className="btn btn-primary" onClick={handleUploadClick}>
            📤 Upload Image
          </button>
          
          {image && (
            <>
              <button className="btn btn-secondary" onClick={handleClear}>
                🗑️ Clear Canvas
              </button>
              <button className="btn btn-ar" onClick={onViewAR}>
                📱 View in AR
              </button>
            </>
          )}
        </div>

        <div className="size-controls">
          <h3>Display Size (pixels)</h3>
          <label>Canvas Width:
            <input
              type="range"
              min="400"
              max="800"
              value={canvasSize.width}
              onChange={(e) => setCanvasSize({ ...canvasSize, width: parseInt(e.target.value) })}
            />
            <span>{canvasSize.width}px</span>
          </label>
          
          <label>Canvas Height:
            <input
              type="range"
              min="300"
              max="600"
              value={canvasSize.height}
              onChange={(e) => setCanvasSize({ ...canvasSize, height: parseInt(e.target.value) })}
            />
            <span>{canvasSize.height}px</span>
          </label>
        </div>

        <div className="size-controls" style={{ marginTop: '20px', borderTop: '2px solid #e0e0e0', paddingTop: '20px' }}>
          <h3>📏 Real-World Size (for AR)</h3>
          <p style={{ fontSize: '0.9em', color: '#666', marginBottom: '15px' }}>Set the actual size for 1:1 scale in AR</p>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginRight: '20px' }}>
              <input
                type="radio"
                checked={realWorldSize.unit === 'inches'}
                onChange={() => setRealWorldSize({ ...realWorldSize, unit: 'inches' })}
              />
              Inches
            </label>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="radio"
                checked={realWorldSize.unit === 'cm'}
                onChange={() => setRealWorldSize({ ...realWorldSize, unit: 'cm' })}
              />
              Centimeters
            </label>
          </div>
          
          <label>Width:
            <input
              type="range"
              min={realWorldSize.unit === 'inches' ? '8' : '20'}
              max={realWorldSize.unit === 'inches' ? '60' : '150'}
              value={displayValue(realWorldSize.width, realWorldSize.unit)}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                const inches = realWorldSize.unit === 'cm' ? value / 2.54 : value;
                setRealWorldSize({ ...realWorldSize, width: inches });
              }}
            />
            <span>{displayValue(realWorldSize.width, realWorldSize.unit)} {realWorldSize.unit}</span>
          </label>
          
          <label>Height:
            <input
              type="range"
              min={realWorldSize.unit === 'inches' ? '6' : '15'}
              max={realWorldSize.unit === 'inches' ? '48' : '120'}
              value={displayValue(realWorldSize.height, realWorldSize.unit)}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                const inches = realWorldSize.unit === 'cm' ? value / 2.54 : value;
                setRealWorldSize({ ...realWorldSize, height: inches });
              }}
            />
            <span>{displayValue(realWorldSize.height, realWorldSize.unit)} {realWorldSize.unit}</span>
          </label>
          
          <div style={{ 
            marginTop: '10px', 
            padding: '10px', 
            background: '#e3f2fd', 
            borderRadius: '8px',
            fontSize: '0.9em',
            color: '#1976d2'
          }}>
            ✨ AR will display at <strong>{displayValue(realWorldSize.width, realWorldSize.unit)} × {displayValue(realWorldSize.height, realWorldSize.unit)} {realWorldSize.unit}</strong> (actual size)
          </div>
        </div>

        <div className="info-box">
          <h3>📝 How to use:</h3>
          <ol>
            <li>Click "Upload Image" to select your artwork</li>
            <li>Adjust canvas size using the sliders</li>
            <li>Click "View in AR" to see it on your wall using your mobile device</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default CanvasEditor;
