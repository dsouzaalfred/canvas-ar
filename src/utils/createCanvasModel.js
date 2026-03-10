import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

/**
 * Creates a 3D plane model with the canvas image as texture
 * @param {string} imageDataUrl - The image data URL
 * @param {number} width - Width of the canvas in meters (default 1.5)
 * @param {number} height - Height of the canvas in meters (default 1)
 * @returns {Promise<Blob>} GLB blob
 */
export async function createCanvasModel(imageDataUrl, width = 1.5, height = 1) {
  return new Promise((resolve, reject) => {
    try {
      console.log('Creating 3D model with dimensions:', width, 'x', height);

      // Create scene
      const scene = new THREE.Scene();

      // Load texture
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(
        imageDataUrl,
        (texture) => {
          console.log('Texture loaded successfully');

          // Create geometry - Use BoxGeometry for better AR compatibility
          const geometry = new THREE.BoxGeometry(width, height, 0.05);

          // Create material with the image texture
          const material = new THREE.MeshStandardMaterial({
            map: texture,
            metalness: 0.0,
            roughness: 1.0,
          });

          // Create back material (white)
          const backMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            metalness: 0.0,
            roughness: 1.0,
          });

          // Create mesh with multiple materials
          const materials = [
            backMaterial, // right
            backMaterial, // left
            backMaterial, // top
            backMaterial, // bottom
            material,     // front - main image
            backMaterial  // back
          ];

          const mesh = new THREE.Mesh(geometry, materials);
          mesh.name = 'canvas_frame';

          // Rotate to face forward
          mesh.rotation.y = 0;

          // Add to scene
          scene.add(mesh);

          // Add ambient light
          const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
          scene.add(ambientLight);

          console.log('Exporting to GLB...');

          // Export to GLB
          const exporter = new GLTFExporter();
          exporter.parse(
            scene,
            (gltf) => {
              console.log('GLB export successful, size:', gltf.byteLength, 'bytes');
              // Convert to blob
              const blob = new Blob([gltf], { type: 'model/gltf-binary' });
              resolve(blob);
            },
            (error) => {
              console.error('Error exporting GLB:', error);
              reject(error);
            },
            {
              binary: true,
              maxTextureSize: 2048,
              includeCustomExtensions: false
            }
          );
        },
        undefined,
        (error) => {
          console.error('Error loading texture:', error);
          reject(error);
        }
      );
    } catch (error) {
      console.error('Error creating canvas model:', error);
      reject(error);
    }
  });
}
