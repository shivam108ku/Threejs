import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Texture

const textureLoader = new THREE.TextureLoader()
const marsTexture = textureLoader.load('src/texture/mars.jpg')
const net = textureLoader.load('src/texture/net.jpg')
const rubb = textureLoader.load('src/texture/rubb.jpg');


// Select canvas
const canvas = document.querySelector('.webgl');
if (!canvas) {
    console.error('Canvas element not found');
    throw new Error('Canvas element with class "webgl" is required');
}

// Create Scene
const scene = new THREE.Scene();

// Window Size
const size = {
    width: window.innerWidth,
    height: window.innerHeight,
};

// Create Box
 
const material = new THREE.MeshBasicMaterial({ 
     map: marsTexture
}); // Using hex color code


const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5 ,16 , 16),
    material
);
sphere.position.x = -1.5


const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1 ,1),
    material

)
const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.5 ,0.2, 16, 32),
    material

);
torus.position.x = 1.5
scene.add(sphere , plane, torus);

// Create Camera
const camera = new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 100);
camera.position.set(0, 0, 3); // More explicit position setting
scene.add(camera);

// Create Renderer
const renderer = new THREE.WebGLRenderer({ 
    canvas,
    antialias: true // Added for smoother edges
});
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap pixel ratio for performance

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05; // Added damping factor for smoother controls
controls.enableZoom = true; // Explicitly enable zoom

// Handle Window Resize
const handleResize = () => {
    size.width = window.innerWidth;
    size.height = window.innerHeight;
    
    camera.aspect = size.width / size.height;
    camera.updateProjectionMatrix();
    
    renderer.setSize(size.width, size.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
};
window.addEventListener('resize', handleResize);

const clock = new THREE.Clock()
// Animation Loop
const animate = () => {
    
  const elapsedTime = clock.getElapsedTime()
 // Move this to top of function
    
    sphere.rotation.y = 1 * elapsedTime
    plane.rotation.y = 1 * elapsedTime
    // torus.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 1 * elapsedTime

    controls.update();
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    
};

// Initial render and start animation
renderer.render(scene, camera);
animate();

// Cleanup function (good practice)
window.addEventListener('beforeunload', () => {
    window.removeEventListener('resize', handleResize);
    geometry.dispose();
    material.dispose();
    renderer.dispose();
});