import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";

/**
 * Creates different 3D shapes with the canvas image as texture
 */

// Canvas frame (existing functionality)
export async function createCanvasFrame(imageDataUrl, width = 1.5, height = 1) {
  return new Promise((resolve, reject) => {
    try {
      console.log("Creating canvas frame with dimensions:", width, "x", height);

      const scene = new THREE.Scene();
      const textureLoader = new THREE.TextureLoader();

      textureLoader.load(
        imageDataUrl,
        (texture) => {
          const geometry = new THREE.BoxGeometry(width, height, 0.05);
          const material = new THREE.MeshStandardMaterial({
            map: texture,
            metalness: 0.0,
            roughness: 1.0,
          });

          const backMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            metalness: 0.0,
            roughness: 1.0,
          });

          const materials = [
            backMaterial,
            backMaterial,
            backMaterial,
            backMaterial,
            material,
            backMaterial,
          ];

          const mesh = new THREE.Mesh(geometry, materials);
          mesh.name = "canvas_frame";
          scene.add(mesh);

          const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
          scene.add(ambientLight);

          exportToGLB(scene, resolve, reject);
        },
        undefined,
        reject,
      );
    } catch (error) {
      reject(error);
    }
  });
}

// Coffee mug/cup
export async function createCoffeeMug(imageDataUrl, scale = 1) {
  return new Promise((resolve, reject) => {
    try {
      console.log("Creating coffee mug with scale:", scale);

      const scene = new THREE.Scene();
      const textureLoader = new THREE.TextureLoader();

      textureLoader.load(
        imageDataUrl,
        (texture) => {
          // Create mug body - separate side and caps for precise material control

          // Side cylinder (open top and bottom)
          const sideGeometry = new THREE.CylinderGeometry(
            0.4 * scale,
            0.35 * scale,
            0.8 * scale,
            32,
            1,
            true,
          );

          // Rotate texture to align properly with opposite side from handle
          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.RepeatWrapping;
          // Force flip the texture to correct orientation
          texture.flipY = true;
          texture.center.set(0.5, 0.5);

          const sideMaterial = new THREE.MeshStandardMaterial({
            map: texture,
            metalness: 0.1,
            roughness: 0.8,
          });
          const mugSide = new THREE.Mesh(sideGeometry, sideMaterial);
          mugSide.position.y = 0.4 * scale;
          // Additional geometry rotation to ensure proper alignment
          mugSide.rotation.y = Math.PI / 2;

          // Top cap
          const topGeometry = new THREE.CircleGeometry(0.4 * scale, 32);
          const ceramicMaterial = new THREE.MeshStandardMaterial({
            color: 0xf5f5dc, // Beige ceramic color
            metalness: 0.1,
            roughness: 0.9,
          });
          const topCap = new THREE.Mesh(topGeometry, ceramicMaterial);
          topCap.position.y = 0.8 * scale;
          topCap.rotation.x = -Math.PI / 2;

          // Bottom cap
          const bottomGeometry = new THREE.CircleGeometry(0.35 * scale, 32);
          const bottomCap = new THREE.Mesh(bottomGeometry, ceramicMaterial);
          bottomCap.position.y = 0;
          bottomCap.rotation.x = Math.PI / 2;

          // Create handle
          const handleGeometry = new THREE.TorusGeometry(
            0.15 * scale,
            0.03 * scale,
            8,
            16,
          );
          const handleMaterial = new THREE.MeshStandardMaterial({
            color: 0x8b4513,
            metalness: 0.1,
            roughness: 0.9,
          });

          const handle = new THREE.Mesh(handleGeometry, handleMaterial);
          handle.position.set(0.45 * scale, 0.4 * scale, 0);
          handle.rotation.z = Math.PI / 2;

          // Group everything
          const mugGroup = new THREE.Group();
          mugGroup.add(mugSide);
          mugGroup.add(topCap);
          mugGroup.add(bottomCap);
          mugGroup.add(handle);
          mugGroup.name = "coffee_mug";

          scene.add(mugGroup);

          const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
          scene.add(ambientLight);

          exportToGLB(scene, resolve, reject);
        },
        undefined,
        reject,
      );
    } catch (error) {
      reject(error);
    }
  });
}

// Cylindrical vase/container
export async function createCylinder(imageDataUrl, scale = 1) {
  return new Promise((resolve, reject) => {
    try {
      console.log("Creating cylinder with scale:", scale);

      const scene = new THREE.Scene();
      const textureLoader = new THREE.TextureLoader();

      textureLoader.load(
        imageDataUrl,
        (texture) => {
          // Create cylinder vase - separate side and caps for precise material control

          // Side cylinder (open top and bottom)
          const sideGeometry = new THREE.CylinderGeometry(
            0.3 * scale,
            0.3 * scale,
            1.2 * scale,
            32,
            1,
            true,
          );
          const sideMaterial = new THREE.MeshStandardMaterial({
            map: texture,
            metalness: 0.2,
            roughness: 0.7,
          });
          const cylinderSide = new THREE.Mesh(sideGeometry, sideMaterial);
          cylinderSide.position.y = 0.6 * scale;

          const ceramicMaterial = new THREE.MeshStandardMaterial({
            color: 0xe8e8e8, // Light gray ceramic
            metalness: 0.2,
            roughness: 0.8,
          });

          // Top cap
          const topGeometry = new THREE.CircleGeometry(0.3 * scale, 32);
          const topCap = new THREE.Mesh(topGeometry, ceramicMaterial);
          topCap.position.y = 1.2 * scale;
          topCap.rotation.x = -Math.PI / 2;

          // Bottom cap
          const bottomGeometry = new THREE.CircleGeometry(0.3 * scale, 32);
          const bottomCap = new THREE.Mesh(bottomGeometry, ceramicMaterial);
          bottomCap.position.y = 0;
          bottomCap.rotation.x = Math.PI / 2;

          // Group everything
          const cylinderGroup = new THREE.Group();
          cylinderGroup.add(cylinderSide);
          cylinderGroup.add(topCap);
          cylinderGroup.add(bottomCap);
          cylinderGroup.name = "cylinder_vase";

          scene.add(cylinderGroup);

          const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
          scene.add(ambientLight);

          exportToGLB(scene, resolve, reject);
        },
        undefined,
        reject,
      );
    } catch (error) {
      reject(error);
    }
  });
}

// Soccer ball/football
export async function createSphere(imageDataUrl, scale = 1) {
  return new Promise((resolve, reject) => {
    try {
      console.log("Creating soccer ball with scale:", scale);

      const scene = new THREE.Scene();
      const textureLoader = new THREE.TextureLoader();

      textureLoader.load(
        imageDataUrl,
        (texture) => {
          // Create main soccer ball sphere
          const geometry = new THREE.SphereGeometry(0.5 * scale, 32, 16);

          // Base white material for the soccer ball
          const whiteMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            metalness: 0.1,
            roughness: 0.9,
          });

          const soccerBall = new THREE.Mesh(geometry, whiteMaterial);
          soccerBall.position.y = 0.5 * scale;

          // Create a larger panel with the user's image on the front of the ball
          const panelGeometry = new THREE.CircleGeometry(0.25 * scale, 8);
          const panelMaterial = new THREE.MeshStandardMaterial({
            map: texture,
            metalness: 0.1,
            roughness: 0.8,
          });

          const imagePanel = new THREE.Mesh(panelGeometry, panelMaterial);
          // Position the image panel exactly on the front surface of the sphere
          imagePanel.position.set(0, 0.5 * scale, 0.5 * scale);

          // Create black pentagon panels positioned above the sphere surface
          const blackMaterial = new THREE.MeshStandardMaterial({
            color: 0x000000,
            metalness: 0.1,
            roughness: 0.9,
          });

          const pentagonGeometry = new THREE.CircleGeometry(0.1 * scale, 5);

          // Pentagon positions (will be normalized to sphere surface)
          const pentagonPositions = [
            { x: 1, y: 1, z: 1 },
            { x: -1, y: 1, z: 1 },
            { x: 1, y: -1, z: 1 },
            { x: -1, y: -1, z: 1 },
            { x: 1, y: 0, z: -1 },
            { x: -1, y: 0, z: -1 },
            { x: 0, y: 1, z: -1 },
            { x: 0, y: -1, z: -1 },
          ];

          const soccerGroup = new THREE.Group();
          soccerGroup.add(soccerBall);
          soccerGroup.add(imagePanel);

          // Add black pentagons positioned exactly on the sphere surface
          pentagonPositions.forEach((pos, index) => {
            const pentagon = new THREE.Mesh(pentagonGeometry, blackMaterial);

            // Normalize position to place exactly on sphere surface (radius = 0.5)
            const direction = new THREE.Vector3(
              pos.x,
              pos.y,
              pos.z,
            ).normalize();
            const surfacePosition = direction.multiplyScalar(0.5 * scale);

            pentagon.position.set(
              surfacePosition.x,
              surfacePosition.y + 0.5 * scale,
              surfacePosition.z,
            );

            // Orient pentagon to face outward from sphere center
            pentagon.lookAt(
              pentagon.position.x * 2,
              pentagon.position.y,
              pentagon.position.z * 2,
            );

            soccerGroup.add(pentagon);
          });

          soccerGroup.name = "soccer_ball";
          scene.add(soccerGroup);

          const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
          scene.add(ambientLight);

          exportToGLB(scene, resolve, reject);
        },
        undefined,
        reject,
      );
    } catch (error) {
      reject(error);
    }
  });
}

// Rubik's cube
export async function createCube(imageDataUrl, scale = 1) {
  return new Promise((resolve, reject) => {
    try {
      console.log("Creating Rubik's cube with scale:", scale);

      const scene = new THREE.Scene();
      const textureLoader = new THREE.TextureLoader();

      textureLoader.load(
        imageDataUrl,
        (texture) => {
          const cubeGroup = new THREE.Group();
          const cubeSize = 0.8 * scale;
          const smallCubeSize = cubeSize / 3;
          const gap = 0.02 * scale;

          // Rubik's cube colors (traditional)
          const colors = [
            0xff0000, // Red
            0x00ff00, // Green
            0x0000ff, // Blue
            0xffff00, // Yellow
            0xff8800, // Orange
            0xffffff, // White
          ];

          // Create 3x3x3 grid of small cubes
          for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
              for (let z = 0; z < 3; z++) {
                const geometry = new THREE.BoxGeometry(
                  smallCubeSize - gap,
                  smallCubeSize - gap,
                  smallCubeSize - gap,
                );

                // Materials for each face of the small cube
                const materials = [];

                // Create materials for each face (right, left, top, bottom, front, back)
                for (let i = 0; i < 6; i++) {
                  let material;

                  // Front face gets a portion of the canvas texture to create one continuous image
                  if (z === 2 && i === 4) {
                    // Calculate UV coordinates to map only this tile's portion of the full image
                    const clonedTexture = texture.clone();

                    // Each tile shows 1/3 of the image in each dimension
                    clonedTexture.repeat.set(1 / 3, 1 / 3);

                    // Offset to show the correct portion for this tile
                    clonedTexture.offset.set(x / 3, y / 3); // Removed the (2-y) inversion

                    clonedTexture.wrapS = THREE.ClampToEdgeWrapping;
                    clonedTexture.wrapT = THREE.ClampToEdgeWrapping;
                    clonedTexture.needsUpdate = true;

                    material = new THREE.MeshStandardMaterial({
                      map: clonedTexture,
                      metalness: 0.1,
                      roughness: 0.8,
                    });
                  } else {
                    // Other faces get traditional Rubik's cube colors
                    let colorIndex;
                    if (i === 0 && x === 2)
                      colorIndex = 0; // Right face - Red
                    else if (i === 1 && x === 0)
                      colorIndex = 1; // Left face - Green
                    else if (i === 2 && y === 2)
                      colorIndex = 3; // Top face - Yellow
                    else if (i === 3 && y === 0)
                      colorIndex = 5; // Bottom face - White
                    else if (i === 4 && z === 2)
                      colorIndex = 2; // Front face - Blue
                    else if (i === 5 && z === 0)
                      colorIndex = 4; // Back face - Orange
                    else colorIndex = Math.floor(Math.random() * colors.length);

                    material = new THREE.MeshStandardMaterial({
                      color: colors[colorIndex],
                      metalness: 0.1,
                      roughness: 0.8,
                    });
                  }
                  materials.push(material);
                }

                const cube = new THREE.Mesh(geometry, materials);
                cube.position.set(
                  (x - 1) * smallCubeSize,
                  (y - 1) * smallCubeSize + cubeSize / 2,
                  (z - 1) * smallCubeSize,
                );

                cubeGroup.add(cube);
              }
            }
          }

          cubeGroup.name = "rubiks_cube";
          scene.add(cubeGroup);

          const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
          scene.add(ambientLight);

          exportToGLB(scene, resolve, reject);
        },
        undefined,
        reject,
      );
    } catch (error) {
      reject(error);
    }
  });
}

// Helper function to export to GLB
function exportToGLB(scene, resolve, reject) {
  const exporter = new GLTFExporter();
  exporter.parse(
    scene,
    (gltf) => {
      console.log("GLB export successful, size:", gltf.byteLength, "bytes");
      const blob = new Blob([gltf], { type: "model/gltf-binary" });
      resolve(blob);
    },
    (error) => {
      console.error("Error exporting GLB:", error);
      reject(error);
    },
    {
      binary: true,
      maxTextureSize: 2048,
      includeCustomExtensions: false,
    },
  );
}

// Shape definitions for UI
export const SHAPE_OPTIONS = [
  {
    id: "canvas",
    name: "Canvas Frame",
    icon: "🖼️",
    description: "Traditional framed artwork",
    createFunction: createCanvasFrame,
  },
  {
    id: "mug",
    name: "Coffee Mug",
    icon: "☕",
    description: "Your art on a coffee mug",
    createFunction: createCoffeeMug,
  },
  {
    id: "cylinder",
    name: "Cylinder Vase",
    icon: "🏺",
    description: "Cylindrical container",
    createFunction: createCylinder,
  },
  {
    id: "sphere",
    name: "Soccer Ball",
    icon: "⚽",
    description: "Classic soccer ball",
    createFunction: createSphere,
  },
  {
    id: "cube",
    name: "Rubik's Cube",
    icon: "🧩",
    description: "Classic puzzle cube",
    createFunction: createCube,
  },
];
