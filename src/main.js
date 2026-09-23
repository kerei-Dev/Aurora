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

// Create the scene
const scene = new THREE.Scene()


// Create the camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)


// Create the renderer
const renderer = new THREE.WebGLRenderer({
  antialias: true
})

renderer.setSize(
  window.innerWidth,
  window.innerHeight
)

document.body.appendChild(
  renderer.domElement
)


// ========================================
// NORMAL STARFIELD
// ========================================

const starsGeometry =
  new THREE.BufferGeometry()

const starsCount = 1000

const positions =
  new Float32Array(
    starsCount * 3
  )


for (
  let i = 0;
  i < starsCount * 3;
  i++
) {

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


const starsMaterial =
  new THREE.PointsMaterial({

    color: 0xffffff,

    size: 0.1,

    transparent: true,

    opacity: 0

  })


const stars =
  new THREE.Points(
    starsGeometry,
    starsMaterial
  )


scene.add(stars)


// ========================================
// HYPERSPACE STREAKS
// ========================================

const streakGeometry =
  new THREE.BufferGeometry()


const streakCount = 500


const streakPositions =
  new Float32Array(
    streakCount * 3
  )


for (
  let i = 0;
  i < streakCount * 3;
  i += 3
) {

  // X position
  streakPositions[i] =
    (Math.random() - 0.5) * 100

  // Y position
  streakPositions[i + 1] =
    (Math.random() - 0.5) * 100

  // Z position
  streakPositions[i + 2] =
    (Math.random() - 0.5) * 100

}


streakGeometry.setAttribute(
  'position',
  new THREE.BufferAttribute(
    streakPositions,
    3
  )
)


const streakMaterial =
  new THREE.PointsMaterial({

    color: 0xffffff,

    size: 0.12,

    transparent: true,

    opacity: 0

  })


const streaks =
  new THREE.Points(
    streakGeometry,
    streakMaterial
  )


scene.add(streaks)

scene.add(streaks)
// ========================================
// FIRST UNIVERSE
// ========================================

const planetGeometry =
  new THREE.SphereGeometry(
    4,
    64,
    64
  )

const planetMaterial =
  new THREE.MeshBasicMaterial({
    color: 0x332266,
    transparent: true,
    opacity: 0
  })

const planet =
  new THREE.Mesh(
    planetGeometry,
    planetMaterial
  )

planet.position.set(
  0,
  0,
  -80
)

scene.add(planet)
// ========================================
// CAMERA
// ========================================

camera.position.z = 5


// Speed of hyperspace streaks
let streakSpeed = 0.5


// ========================================
// ANIMATION LOOP
// ========================================

function animate() {

  requestAnimationFrame(
    animate
  )


  // Slowly rotate normal starfield
  stars.rotation.y += 0.0005


  // Get streak positions
  const streakPositions =
    streakGeometry
      .attributes
      .position
      .array


  // Move each streak forward
  for (
    let i = 2;
    i < streakPositions.length;
    i += 3
  ) {

    streakPositions[i] +=
      streakSpeed


    // Reset streak when it goes too far
    if (
      streakPositions[i] > 50
    ) {

      streakPositions[i] = -50

    }

  }
// Reveal the first universe
gsap.to(
  planetMaterial,
  {
    opacity: 1,
    duration: 3,
    delay: 2,
    ease: 'power2.out'
  }
)

  // Tell Three.js the positions changed
  streakGeometry
    .attributes
    .position
    .needsUpdate = true


  // Render the scene
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
  document.querySelector(
    '.system-text'
  )


const auroraTitle =
  document.querySelector(
    '.aurora-title'
  )


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


  // BEGIN JOURNEY button appears
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
  document.querySelector(
    '#begin-btn'
  )


beginButton.addEventListener(
  'click',
  () => {

    // Prevent multiple clicks
    beginButton.disabled = true


    // ------------------------------------
    // Activate hyperspace
    // ------------------------------------

    gsap.to(
      streakMaterial,

      {
        opacity: 1,

        duration: 1
      }
    )


    // ------------------------------------
    // Accelerate hyperspace
    // ------------------------------------

    gsap.to(
      { speed: 0.5 },

      {
        speed: 3,

        duration: 3,

        onUpdate: function () {

          streakSpeed =
            this.targets()[0].speed

        }

      }
    )


    // ------------------------------------
    // Fade out title
    // ------------------------------------

    gsap.to(
      '.aurora-title',

      {
        opacity: 0,

        duration: 1.5,

        ease: 'power2.inOut'
      }
    )


    // ------------------------------------
    // Move camera
    // ------------------------------------

    gsap.to(
      camera.position,

      {
        z: -65,

        duration: 7,

        ease: 'power2.in'
      }
    )
    gsap.to(
  streakMaterial,
      {
    opacity: 0,
    duration: 2,
    delay: 4,
    ease: 'power2.out'
      }
)

    // ------------------------------------
    // Accelerate starfield rotation
    // ------------------------------------

    gsap.to(
      stars.rotation,

      {
        y:
          stars.rotation.y + 2,

        duration: 4,

        ease: 'power2.in'
      }
    )

  }
)