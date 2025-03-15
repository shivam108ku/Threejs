import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


const canvas = document.querySelector('.webgl');
// Textures
const textureLoader = new THREE.TextureLoader()
const netflix = textureLoader.load('/src/texture/net.jpg')

const scene = new THREE.Scene()
 
 const material = new THREE.MeshBasicMaterial()
 material.map = netflix
 material.metalnessMap = 
 material.color = new THREE.Color('red')

 

 const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5,16,16),
    material
 )
sphere.position.x = -1.5
 const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1,1),
    material
 )

 const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3 , 0.2, 16 , 32),
    material
 )
torus.position.x = 1.5
 scene.add(sphere , plane, torus)

const size = {
    width: window.innerWidth,
    height:window.innerHeight
}
const camera = new THREE.PerspectiveCamera(75 , size.width / size.height , 0.1 , 100)
camera.position.z = 3;
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Responsive part 
window.addEventListener('resize', ()=>{
    size.width = window.innerWidth,
    size.height = window.innerHeight

    controls.update()

    camera.aspect = size.width / size.height;
    camera.updateProjectionMatrix();

    renderer.setSize(size.width, size.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
})

const renderer = new THREE.WebGLRenderer({
    canvas
})
renderer.setSize(size.width , size.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
const clock = new THREE.Clock();  

const tick = () =>{

    const elapsedTime = clock.getElapsedTime() 
    controls.update();
    sphere.rotation.y = 1 * elapsedTime
    plane.rotation.y = 1 * elapsedTime
    torus.rotation.y = 1 * elapsedTime

     
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}
tick();
