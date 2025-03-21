import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

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

// Particles Setup
const particlesGeometry = new THREE.BufferGeometry();
const count = 5000;
const positions = new Float32Array(count * 3);
const velocities = new Float32Array(count * 3); // Velocity array for movement

for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10; // Spread particles between -5 and 5
    velocities[i] = (Math.random() - 0.5) * 0.02; // Random velocity for movement
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

// Material
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.02,
    sizeAttenuation: true,
    color: "white",
});

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

// Create Camera
const camera = new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 100);
camera.position.set(0, 0, 5);
scene.add(camera);

// Create Renderer
const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
});
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

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

// Animation Variables
const clock = new THREE.Clock();

// Animation Loop
const animate = () => {
    const elapsedTime = clock.getElapsedTime();
    const positionsArray = particlesGeometry.attributes.position.array;

    // Move each particle based on velocity
    for (let i = 0; i < count * 3; i++) {
        positionsArray[i] += velocities[i]; // Update position with velocity

        // If particle goes too far, reset it
        if (positionsArray[i] > 5 || positionsArray[i] < -5) {
            positionsArray[i] = (Math.random() - 0.5) * 10;
        }
    }

    particlesGeometry.attributes.position.needsUpdate = true; // Tell Three.js to update positions

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
};

// Start Animation
animate();

// Cleanup function
window.addEventListener('beforeunload', () => {
    window.removeEventListener('resize', handleResize);
    particlesGeometry.dispose();
    particlesMaterial.dispose();
    renderer.dispose();
});
