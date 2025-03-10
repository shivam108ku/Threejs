import * as THREE from "three";
const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry(1,1,1);
const material = new THREE.MeshBasicMaterial({color: 'red'});
const  mesh = new THREE.Mesh(geometry,material);

scene.add(mesh);

// Sizes

const sizes = {
  width:800,
  height:600
}

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
scene.add(camera);
camera.position.z = 3;

// Renderer
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({
  canvas
})
renderer.setSize(sizes.width , sizes.height);
renderer.render(scene , camera);

  