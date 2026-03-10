# Canvas AR - Wall Art Visualization App

A React-based web application that allows users to upload artwork images to a canvas and visualize how they would look on their wall using Augmented Reality (AR) on mobile devices.

## Features

- 📤 **Image Upload**: Upload any image to the canvas
- 🎨 **Canvas Editing**: Adjust canvas dimensions with intuitive sliders
- 📱 **AR Preview**: View your artwork on your wall using your mobile device's camera
- 🔄 **Dual AR Modes**: 
  - Markerless AR (point at any wall)
  - Marker-based AR (using Hiro marker)
- 📐 **Responsive Design**: Works seamlessly on desktop and mobile devices
- ⚡ **Frontend Only**: No backend required - everything runs in the browser

## Technologies Used

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **A-Frame** - WebVR/AR framework
- **AR.js** - Augmented reality library
- **Canvas API** - Image manipulation

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A mobile device with a camera for AR features

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

### For Mobile AR Testing

Since AR requires camera access, you'll need to access the app from your mobile device:

1. Make sure your mobile device is on the same network as your development machine
2. Find your local IP address (e.g., `192.168.1.100`)
3. On your mobile device, open: `http://YOUR_IP:3000`
4. Grant camera permissions when prompted

## How to Use

### Desktop/Editor Mode

1. **Upload Image**: Click the "Upload Image" button and select your artwork
2. **Adjust Canvas**: Use the sliders to adjust canvas width and height
3. **Preview**: See your image displayed on the canvas in real-time

### Mobile/AR Mode

1. Click "View in AR" after uploading an image
2. Grant camera permissions if prompted
3. Choose between two AR modes:
   - **Markerless**: Point your camera at any wall - the canvas will appear in 3D space
   - **Marker-based**: Print the [Hiro marker](https://raw.githubusercontent.com/AR-js-org/AR.js/master/data/images/hiro.png) and point your camera at it

### Tips for Best AR Experience

- ✅ Ensure good lighting conditions
- ✅ Move your device slowly for better tracking
- ✅ Keep the camera parallel to the wall
- ✅ For marker mode, print the marker on white paper
- ✅ Keep the marker flat and visible to the camera

## Project Structure

```
canvas-ar/
├── src/
│   ├── components/
│   │   ├── CanvasEditor.jsx      # Main editor component
│   │   ├── CanvasEditor.css      # Editor styles
│   │   ├── ARViewer.jsx          # AR viewer component
│   │   └── ARViewer.css          # AR viewer styles
│   ├── App.jsx                   # Main app component
│   ├── App.css                   # App styles
│   ├── main.jsx                  # Entry point
│   └── index.css                 # Global styles
├── index.html                    # HTML template
├── vite.config.js               # Vite configuration
└── package.json                 # Dependencies
```

## Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist/` directory. You can preview the production build with:

```bash
npm run preview
```

## Browser Compatibility

- **Desktop**: Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile**: Chrome on Android, Safari on iOS (requires HTTPS for camera access in production)

## Known Limitations

- AR features require a device with a camera
- HTTPS is required for camera access in production (development server works with HTTP on localhost)
- Marker-based AR requires printing the Hiro marker
- Performance may vary based on device capabilities

## Future Enhancements

- Multiple canvas placement in AR
- Image filters and effects
- Save/load canvas projects
- Share AR view links
- Custom AR markers
- Room measurement tools

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Troubleshooting

### Camera not working?
- Ensure you've granted camera permissions
- Check if your browser supports WebRTC
- For production, make sure you're using HTTPS

### AR not tracking well?
- Improve lighting conditions
- Move closer/farther from the marker
- Ensure the marker is flat and fully visible
- Try the markerless mode as an alternative

### Image not showing in AR?
- Make sure the image uploaded successfully in editor mode
- Check browser console for errors
- Try a different image format (PNG or JPG recommended)

## Contributing

Feel free to submit issues and enhancement requests!

## Credits

Built with ❤️ using React, A-Frame, and AR.js
