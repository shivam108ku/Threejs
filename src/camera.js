import * as THREE from "three";

const size = {
  width: 700,
  height: 800
};

const cursor = { x: 0, y: 0 };

window.addEventListener("mousemove", (event) => {
  cursor.x = event.clientX / size.width - 0.5;
  cursor.y = -(event.clientY / size.height - 0.5);
});

const scene = new THREE.Scene();

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: "red" })
);

scene.add(cube);

const camera = new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 100);
scene.add(camera);
camera.position.z = 5; // Move it further away

const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(size.width, size.height);

// Animation
const animation = () => {
  const radius = 5; // Keep distance from the cube

  camera.position.x = Math.sin(cursor.x * Math.PI * 2) * radius;
  camera.position.z = Math.cos(cursor.x * Math.PI * 2) * radius;
  camera.position.y = cursor.y * 3; // Make movement smooth

  camera.lookAt(cube.position);
  renderer.render(scene, camera);

  window.requestAnimationFrame(animation);
};

animation();
