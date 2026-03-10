import React, { useState } from 'react';
import CanvasEditor from './components/CanvasEditor';
import ARViewer from './components/ARViewer';
import './App.css';

function App() {
  const [view, setView] = useState('editor'); // 'editor' or 'ar'
  const [canvasImage, setCanvasImage] = useState(null);
  const [canvasData, setCanvasData] = useState(null);

  const handleImageUpload = (data) => {
    if (data) {
      setCanvasImage(data.imageData);
      setCanvasData(data);
    } else {
      setCanvasImage(null);
      setCanvasData(null);
    }
  };

  const handleViewAR = () => {
    if (canvasImage) {
      setView('ar');
    }
  };

  const handleBackToEditor = () => {
    setView('editor');
  };

  return (
    <div className="app">
      {view === 'editor' ? (
        <CanvasEditor 
          onImageUpload={handleImageUpload}
          onViewAR={handleViewAR}
          currentImage={canvasImage}
        />
      ) : (
        <ARViewer 
          imageData={canvasImage}
          realWorldSize={canvasData?.realWorldSize}
          onBack={handleBackToEditor}
        />
      )}
    </div>
  );
}

export default App;
