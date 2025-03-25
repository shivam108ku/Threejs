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
 
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('src/texture/particles/2.png')
// particleTexture.colorSpace = THREE.SRGBColorSpace;

// Particles Area 

// First is geometry
const particlesGeometry = new THREE.BufferGeometry()
const  count = 20000;

const positions = new  Float32Array(count * 3)
const colors = new Float32Array(count * 3)

for(let i=0; i<count * 3; i++){
    positions[i] = (Math.random() - 0.5) * 10
    colors[i] = Math.random()
}

 
particlesGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3)
)
particlesGeometry.setAttribute(
    'color',
    new THREE.BufferAttribute(colors, 3)
)

// Material
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.1,
    sizeAttenuation:true,
     map:particleTexture,
     transparent: true,
     alphaMap: particleTexture,
    //  alphaTest: 0.001,
    // depthTest: false
    depthWrite: false,
    blending:THREE.AdditiveBlending,
    vertexColors: true,
})

// Points
const particles = new THREE.Points(particlesGeometry , particlesMaterial)
scene.add(particles)



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
   // particles.rotation.y = elapsedTime * 0.02
   // particles.position.y = -elapsedTime * 0.02

   for(let i=0; i< count; i++){
         const i3 = i * 3

         const x = particlesGeometry.attributes.position.array[i3]
         particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x)
   }
   
    particlesGeometry.attributes.position.needsUpdate = true;
    controls.update();
    window.requestAnimationFrame(animate);
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