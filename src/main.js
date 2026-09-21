import * as THREE from 'three'
import gsap from 'gsap'
import './style.css'


// ========================================
// AURORA INTRO OVERLAY
// ========================================

document.body.insertAdjacentHTML(
  'beforeend',
  `
    <div class="aurora-overlay">

      <p class="system-text">
        SYSTEM INITIALIZING...
      </p>

      <div class="aurora-title">
        <h1 class="aurora-heading">
          PROJECT AURORA
        </h1>

        <button id="begin-btn">
          BEGIN JOURNEY
        </button>
      </div>

    </div>
  `
)


// ========================================
// THREE.JS SCENE
// ========================================

// 1. Create the scene
const scene = new THREE.Scene()


// 2. Create the camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)


// 3. Create the renderer
const renderer = new THREE.WebGLRenderer({
  antialias: true
})

renderer.setSize(
  window.innerWidth,
  window.innerHeight
)

document.body.appendChild(renderer.domElement)


// ========================================
// STARFIELD
// ========================================

const starsGeometry = new THREE.BufferGeometry()

const starsCount = 1000

const positions = new Float32Array(
  starsCount * 3
)

for (let i = 0; i < starsCount * 3; i++) {
  positions[i] =
    (Math.random() - 0.5) * 100
}

starsGeometry.setAttribute(
  'position',
  new THREE.BufferAttribute(
    positions,
    3
  )
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


// ========================================
// CAMERA
// ========================================

camera.position.z = 5



function animate() {

  requestAnimationFrame(animate)

  stars.rotation.y += 0.0005

  renderer.render(
    scene,
    camera
  )
}

animate()

// ========================================
// RESPONSIVE WINDOW
// ========================================

window.addEventListener(
  'resize',
  () => {

    camera.aspect =
      window.innerWidth /
      window.innerHeight

    camera.updateProjectionMatrix()

    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    )

  }
)


// ========================================
// CINEMATIC OPENING
// ========================================

const systemText =
  document.querySelector('.system-text')

const auroraTitle =
  document.querySelector('.aurora-title')


const timeline =
  gsap.timeline()


timeline

  // SYSTEM INITIALIZING appears
  .fromTo(
    systemText,
    {
      opacity: 0
    },
    {
      opacity: 1,
      duration: 1
    }
  )

  // Stars slowly appear
  .to(
    starsMaterial,
    {
      opacity: 1,
      duration: 3
    }
  )

  // System text disappears
  .to(
    systemText,
    {
      opacity: 0,
      duration: 1,
      delay: 1
    }
  )

  // Reveal title container
  .to(
    auroraTitle,
    {
      opacity: 1,
      duration: 0.1
    }
  )

  // PROJECT AURORA enters
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

  // Button appears
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



// ========================================
// BEGIN JOURNEY
// ========================================

const beginButton =
  document.querySelector('#begin-btn')


beginButton.addEventListener(
  'click',
  () => {

    // Disable button so it cannot be clicked twice
    beginButton.disabled = true

    // Fade out the title and button
    gsap.to(
      '.aurora-title',
      {
        opacity: 0,
        duration: 1.5,
        ease: 'power2.inOut'
      }
    )

    // Move the camera deeper into space
    gsap.to(
      camera.position,
      {
        z: -15,
        duration: 4,
        ease: 'power2.in'
      }
    )

    // Accelerate the starfield
    gsap.to(
      stars.rotation,
      {
        y: stars.rotation.y + 2,
        duration: 4,
        ease: 'power2.in'
      }
    )

  }
)