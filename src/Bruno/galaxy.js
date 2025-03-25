import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base Setup
 */
const gui = new dat.GUI({ width: 350 })
const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x000010)

/**
 * Galaxy Parameters
 */
const parameters = {
    count: 200000,
    size: 0.005,
    radius: 8,
    branches: 5,
    spin: 1.5,
    randomness: 0.4,
    randomnessPower: 3.5,
    insideColor: '#ff7b38',
    outsideColor: '#1b5cff',
    animationSpeed: 0.5,
    blackHoleStrength: 0.2,
    resetAnimation: () => { clock.start() }
}

let geometry = null
let material = null
let points = null
let originalPositions = null

const generateGalaxy = () => {
    // Destroy old galaxy
    if (points !== null) {
        geometry.dispose()
        material.dispose()
        scene.remove(points)
    }

    // Create geometry
    geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(parameters.count * 3)
    const colors = new Float32Array(parameters.count * 3)
    const sizesArray = new Float32Array(parameters.count)

    const colorInside = new THREE.Color(parameters.insideColor)
    const colorOutside = new THREE.Color(parameters.outsideColor)

    for (let i = 0; i < parameters.count; i++) {
        const i3 = i * 3
        
        // Position
        const radius = Math.random() * parameters.radius
        const spinAngle = radius * parameters.spin
        const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2

        // Randomness with power curve
        const randomX = Math.pow(Math.random(), parameters.randomnessPower) * 
                       (Math.random() < 0.5 ? 1 : -1) * 
                       parameters.randomness * radius
        const randomY = Math.pow(Math.random(), parameters.randomnessPower) * 
                       (Math.random() < 0.5 ? 1 : -1) * 
                       parameters.randomness * radius
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * 
                       (Math.random() < 0.5 ? 1 : -1) * 
                       parameters.randomness * radius

        positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX
        positions[i3 + 1] = randomY * 0.5 // Flatten the galaxy slightly
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ

        // Color gradient
        const mixedColor = colorInside.clone()
        mixedColor.lerp(colorOutside, radius / parameters.radius)

        colors[i3] = mixedColor.r
        colors[i3 + 1] = mixedColor.g
        colors[i3 + 2] = mixedColor.b

        // Size variation
        sizesArray[i] = parameters.size * (0.5 + Math.random() * 0.5)
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute('size', new THREE.BufferAttribute(sizesArray, 1))

    // Store original positions for animation
    originalPositions = positions.slice()

    // Material
    material = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
        transparent: true,
        opacity: 0.9
    })

    // Points
    points = new THREE.Points(geometry, material)
    scene.add(points)
}

// GUI Controls
const galaxyFolder = gui.addFolder('Galaxy Parameters')
galaxyFolder.add(parameters, 'count', 1000, 500000, 100).onFinishChange(generateGalaxy)
galaxyFolder.add(parameters, 'size', 0.001, 0.02, 0.001).onFinishChange(generateGalaxy)
galaxyFolder.add(parameters, 'radius', 1, 20, 0.1).onFinishChange(generateGalaxy)
galaxyFolder.add(parameters, 'branches', 1, 20, 1).onFinishChange(generateGalaxy)
galaxyFolder.add(parameters, 'spin', -5, 5, 0.1).onFinishChange(generateGalaxy)
galaxyFolder.add(parameters, 'randomness', 0, 2, 0.01).onFinishChange(generateGalaxy)
galaxyFolder.add(parameters, 'randomnessPower', 1, 10, 0.1).onFinishChange(generateGalaxy)
galaxyFolder.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy)
galaxyFolder.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy)

const animationFolder = gui.addFolder('Animation')
animationFolder.add(parameters, 'animationSpeed', 0.1, 2, 0.1)
animationFolder.add(parameters, 'blackHoleStrength', 0, 1, 0.05)
animationFolder.add(parameters, 'resetAnimation')

// Initial generation
generateGalaxy()

/**
 * Sizes & Camera
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 3, 15)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.dampingFactor = 0.05
controls.autoRotate = true
controls.autoRotateSpeed = 0.5

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(0x000011, 1)

/**
 * Animation System
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime() * parameters.animationSpeed
    const positions = geometry.attributes.position.array

    // Animate each particle
    for (let i = 0; i < parameters.count; i++) {
        const i3 = i * 3
        
        // Get original position
        const origX = originalPositions[i3]
        const origY = originalPositions[i3 + 1]
        const origZ = originalPositions[i3 + 2]
        
        // Calculate distance from center
        const distance = Math.sqrt(origX * origX + origY * origY + origZ * origZ)
        
        // Spiral animation with black hole effect
        const spiralFactor = 1 + parameters.blackHoleStrength * (1 - Math.exp(-elapsedTime * 0.3))
        const angle = Math.atan2(origZ, origX) + elapsedTime * 0.2 * (1 + distance / parameters.radius)
        
        // New position with spiral and inward pull
        const newRadius = distance * (0.95 + 0.05 * Math.sin(elapsedTime * 0.5 + distance * 0.2))
        const blackHolePull = 1 - (parameters.blackHoleStrength * (1 - Math.exp(-elapsedTime * 0.2)))
        
        positions[i3] = Math.cos(angle) * newRadius * blackHolePull
        positions[i3 + 1] = origY * (0.9 + 0.1 * Math.sin(elapsedTime * 0.3)) * blackHolePull
        positions[i3 + 2] = Math.sin(angle) * newRadius * blackHolePull
        
        // Pulsing size effect
        geometry.attributes.size.array[i] = parameters.size * 
            (0.7 + 0.3 * Math.sin(elapsedTime * 2 + distance * 0.5))
    }

    // Update geometry
    geometry.attributes.position.needsUpdate = true
    geometry.attributes.size.needsUpdate = true

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Next frame
    window.requestAnimationFrame(tick)
}

tick()