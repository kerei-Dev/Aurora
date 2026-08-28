import * as THREE from 'three'
import './style.css'

// 1. Create a scene
const scene = new THREE.Scene()

// 2. Create a camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)

// 3. Create a renderer
const renderer = new THREE.WebGLRenderer()

renderer.setSize(window.innerWidth, window.innerHeight)

document.body.appendChild(renderer.domElement)

// 4. Create a cube
const geometry = new THREE.BoxGeometry()
const material = new THREE.MeshBasicMaterial({
  color: 0xffffff
})

const cube = new THREE.Mesh(geometry, material)

scene.add(cube)

// 5. Move camera back
camera.position.z = 5

// 6. Animation loop
function animate() {
  requestAnimationFrame(animate)

  cube.rotation.x += 0.01
  cube.rotation.y += 0.01

  renderer.render(scene, camera)
}

animate()