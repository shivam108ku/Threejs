import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui'; 


const canvas = document.querySelector('.webgl');
const light = new THREE.DirectionalLight("white", 3);
light.position.set(2,2,2);


// Textures
const textureLoader = new THREE.TextureLoader();
const netflix = textureLoader.load('/src/texture/mars.jpg');
netflix.colorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();

// Create material and apply the texture
const material = new THREE.MeshPhysicalMaterial();
material.map = netflix;


// Create a sphere and apply material
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(1, 250, 250),
  material
);

scene.add(sphere,light);

// Size settings
const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Camera setup
const camera = new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 100);
camera.position.z = 3;
scene.add(camera);

// Renderer setup
const renderer = new THREE.WebGLRenderer({
  canvas,
});
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Orbit controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Responsive handling for resizing
window.addEventListener('resize', () => {
  size.width = window.innerWidth;
  size.height = window.innerHeight;

  camera.aspect = size.width / size.height;
  camera.updateProjectionMatrix();
  renderer.setSize(size.width, size.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  controls.update();
});

const gui = new GUI();

const myObject = {
	myBoolean: true,
	myFunction: function() {},
	myString: 'lil-gui',
	myNumber: 1
};

gui.add( myObject, 'myBoolean' );  // Checkbox
gui.add( myObject, 'myFunction' ); // Button
gui.add( myObject, 'myString' );   // Text Field
gui.add( myObject, 'myNumber' );   // Number Field

// Clock and animation loop
const clock = new THREE.Clock();
const tick = () => {
//   const elapsedTime = clock.getElapsedTime();
//   controls.update();
//   sphere.rotation.y = 1 * elapsedTime;
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

// Start animation
tick();
