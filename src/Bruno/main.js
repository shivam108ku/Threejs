import * as THREE from "three";
const scene = new THREE.Scene();
import gsap from 'gsap'

// const geometry = new THREE.BoxGeometry(1,1,1);
// const material = new THREE.MeshBasicMaterial({color: 'red'});
// const  mesh = new THREE.Mesh(geometry,material);

// mesh.position.set(0.7 , -0.6 , 1);
// mesh.scale.y = 0.5
// mesh.rotation.reorder('XYZ');
// mesh.rotation.set(1,3,5);

 

// Axis Helper
// const axishelper = new THREE.AxesHelper(0);

// const group = new THREE.Group()
// scene.add(group);

const cube1 = new THREE.Mesh(
  new THREE.BoxGeometry(1,1,1),
  new THREE.MeshBasicMaterial({color:'red' })
)

// const cube2 = new THREE.Mesh(
//   new THREE.BoxGeometry(1,1,1),
//   new THREE.MeshBasicMaterial({color:'red'})
// )

// const cube3 = new THREE.Mesh(
//   new THREE.BoxGeometry(1,1,1),
//   new THREE.MeshBasicMaterial({color:'red'})
// )
scene.add(cube1);

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

let time = Date.now()
gsap.to(cube1.position, {
  duration: 1,
  delay: 1,
  x:0,
})

// Animation

const animation = ()=>{

const current = Date.now();
const deltatime = current - time;
time = current;

  console.log("first");

  cube1.rotation.y += 0.01
  // Objects
  renderer.render(scene , camera);

  window.requestAnimationFrame(animation);
}
animation();

  