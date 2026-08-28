import * as THREE from 'three'
import './style.css'

// 1. Scene
const scene = new THREE.Scene()

// 2. Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)

camera.position.z = 5

// 3. Renderer
const renderer = new THREE.WebGLRenderer()

renderer.setSize(window.innerWidth, window.innerHeight)

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(
    window.innerWidth,
    window.innerHeight
  )
})

document.body.appendChild(renderer.domElement)


// 4. Create stars
const starsGeometry = new THREE.BufferGeometry()

const starsCount = 1000

const positions = new Float32Array(starsCount * 3)

for (let i = 0; i < starsCount * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 100
}

starsGeometry.setAttribute(
  'position',
  new THREE.BufferAttribute(positions, 3)
)

const starsMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.1
})

const stars = new THREE.Points(
  starsGeometry,
  starsMaterial
)

scene.add(stars)


// 5. Animation loop
function animate() {
  requestAnimationFrame(animate)

  stars.rotation.y += 0.0005

  renderer.render(scene, camera)
}

animate()