import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


const canvas = document.querySelector('.webgl');

const count = 500;
const positionArray = new Float32Array(count * 3 *3)
for(let i=0; i < count * 3 * 3; i++){
    positionArray[i] = (Math.random() - 0.5) * 40
}

const positionAttribute = new THREE.BufferAttribute(positionArray, 3)
const geometry = new THREE.BufferGeometry();

const scene = new THREE.Scene()
const mesh = new THREE.Mesh(
    geometry.setAttribute('position', positionAttribute),
    new THREE.MeshBasicMaterial({
        color: 'yellow',
        wireframe:true
    })
)

scene.add(mesh);

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

const tick = () =>{
    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}
tick();
