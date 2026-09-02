import * as THREE from 'three'
import gsap from 'gsap'
import './style.css'

document.body.insertAdjacentHTML(
  'beforeend',
  `
    <div class="aurora-overlay">
      <p class="system-text">SYSTEM INITIALIZING...</p>

     <div class="aurora-title">
      <h1 class="aurora-heading">PROJECT AURORA</h1>
      <button id="begin-btn">BEGIN JOURNEY</button>
     </div>
    </div>
  `
)

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
  size: 0.1,
  transparent: true,
  opacity: 0
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

// Aurora opening sequence

const systemText = document.querySelector('.system-text')
const auroraTitle = document.querySelector('.aurora-title')

const timeline = gsap.timeline()

timeline
  .fromTo(
    systemText,
    { opacity: 0 },
    { opacity: 1, duration: 1 }
  )
  .to(
    starsMaterial,
    {
      opacity: 1,
      duration: 3
    }
  )
  .to(
    systemText,
    {
      opacity: 0,
      duration: 1,
      delay: 1
    }
  )
  .to(auroraTitle, {
  opacity: 1,
  duration: 0.1
})
.fromTo(
  '.aurora-heading',
  {
    opacity: 0,
    y: 30,
    letterSpacing: '30px'
  },
  {
    opacity: 1,
    y: 0,
    letterSpacing: '12px',
    duration: 2,
    ease: 'power3.out'
  }
)
.fromTo(
  '#begin-btn',
  {
    opacity: 0,
    y: 20
  },
  {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: 'power2.out'
  },
  '-=0.5'
)