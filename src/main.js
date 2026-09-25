import * as THREE from 'three'
import gsap from 'gsap'
import './style.css'
import { initUniverseOne, updateUniverseOne } from './universes/universeOne.js'
import { initUniverseTwo, updateUniverseTwo } from './universes/universeTwo.js'
import { gameState } from './systems/state.js'


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
// ========================================
// ========================================
// FIRST UNIVERSE - FORGOTTEN FIELD PLANET
// ========================================

const textureLoader = new THREE.TextureLoader()
const planetTexture = textureLoader.load('/textures/forgotten_planet.jpg')
planetTexture.colorSpace = THREE.SRGBColorSpace

const planetGeometry = new THREE.SphereGeometry(4, 64, 64)

const planetMaterial = new THREE.MeshStandardMaterial({
  map: planetTexture,
  roughness: 0.65,
  metalness: 0.08,
  transparent: true,
  opacity: 0
})

const planet = new THREE.Mesh(planetGeometry, planetMaterial)
planet.position.set(0, 0, -80)
scene.add(planet)

// Atmosphere Glow Shell
const atmosphereGeo = new THREE.SphereGeometry(4.16, 64, 64)
const atmosphereMat = new THREE.MeshBasicMaterial({
  color: 0x9333ea,
  transparent: true,
  opacity: 0,
  side: THREE.BackSide,
  blending: THREE.AdditiveBlending
})
const atmosphere = new THREE.Mesh(atmosphereGeo, atmosphereMat)
planet.add(atmosphere)

// Realistic Celestial Lighting
const sunlight = new THREE.DirectionalLight(0xfff6e5, 2.8)
sunlight.position.set(20, 12, -40)
sunlight.target = planet
scene.add(sunlight)

const cosmicAmbient = new THREE.AmbientLight(0x381f66, 1.1)
scene.add(cosmicAmbient)

const rimLight = new THREE.PointLight(0xc084fc, 3.5, 60)
rimLight.position.set(-15, 8, -90)
scene.add(rimLight)

// ========================================
// SECOND UNIVERSE - MIRACULOUS PLANET (LADYBUG & CAT NOIR)
// ========================================

function createMiraculousTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 512
  const ctx = canvas.getContext('2d')

  // Red gradient base
  const grad = ctx.createLinearGradient(0, 0, 1024, 512)
  grad.addColorStop(0, '#f43f5e')
  grad.addColorStop(0.5, '#e11d48')
  grad.addColorStop(1, '#9f1239')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 1024, 512)

  // Ladybug Polka Dots
  ctx.fillStyle = '#0f172a'
  const dotCoords = [
    [120, 100, 36], [320, 180, 42], [540, 110, 38], [760, 200, 44], [940, 120, 35],
    [200, 340, 42], [420, 400, 45], [640, 330, 40], [860, 390, 42], [80, 420, 35],
    [480, 240, 48], [980, 270, 38], [30, 260, 38], [300, 20, 32], [700, 20, 34]
  ]
  dotCoords.forEach(([x, y, r]) => {
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()

    // Dot gloss highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.18)'
    ctx.beginPath()
    ctx.arc(x - r * 0.25, y - r * 0.25, r * 0.38, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#0f172a'
  })

  // Cat Noir Emerald Aurora Swirl
  ctx.strokeStyle = '#22c55e'
  ctx.lineWidth = 14
  ctx.shadowColor = '#4ade80'
  ctx.shadowBlur = 25
  ctx.beginPath()
  ctx.moveTo(0, 280)
  ctx.bezierCurveTo(300, 150, 700, 400, 1024, 260)
  ctx.stroke()

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

const planetTwoTexture = createMiraculousTexture()
const planetTwoGeo = new THREE.SphereGeometry(4, 64, 64)
const planetTwoMaterial = new THREE.MeshStandardMaterial({
  map: planetTwoTexture,
  roughness: 0.58,
  metalness: 0.1,
  transparent: true,
  opacity: 0
})

const planetTwo = new THREE.Mesh(planetTwoGeo, planetTwoMaterial)
planetTwo.position.set(0, 0, -200)
scene.add(planetTwo)

// Cat Noir Emerald Ring around Planet 2
const catRingGeo = new THREE.TorusGeometry(5.4, 0.08, 16, 64)
const catRingMat = new THREE.MeshBasicMaterial({
  color: 0x22c55e,
  transparent: true,
  opacity: 0,
  blending: THREE.AdditiveBlending
})
const catRing = new THREE.Mesh(catRingGeo, catRingMat)
catRing.rotation.x = Math.PI / 2.5
planetTwo.add(catRing)
// ========================================
// CAMERA
// ========================================

camera.position.z = 5

// ========================================
// PLANET INTERACTION
// ========================================

const raycaster = new THREE.Raycaster()

const mouse = new THREE.Vector2()
// Speed of hyperspace streaks
let streakSpeed = 0.5

let universeStarted = false 

let currentUniverse = 0
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

    streakPositions[i] += streakSpeed


    // Reset streak when it goes too far
    if (
      streakPositions[i] > 50
    ) {

      streakPositions[i] = -50

    }

  }

  // Rotate planets realistically
  planet.rotation.y += 0.0012
  planet.rotation.x += 0.0003

  planetTwo.rotation.y += 0.0015
  planetTwo.rotation.x -= 0.0004
  catRing.rotation.z += 0.003

  // Update active universe elements
  updateUniverseOne()
  updateUniverseTwo()

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

// ========================================
// UNIVERSE 1
// ========================================

function enterUniverseOne() {
  console.log('Universe 1 activated')
  initUniverseOne({ scene, camera, renderer })
}

// ========================================
// UNIVERSE 2
// ========================================

function enterUniverseTwo() {
  console.log('Universe 2 (Miraculous Paris) activated')
  initUniverseTwo({ scene, camera, renderer })
}

window.startTravelToUniverseTwo = () => {
  console.log('Initiating Hyperspace Travel to Planet 2 (Miraculous Paris)...')

  // Activate hyperspace warp forward
  gsap.to(streakMaterial, { opacity: 1, duration: 1 })
  gsap.to({ speed: streakSpeed }, {
    speed: 3.5,
    duration: 2.5,
    onUpdate: function () {
      streakSpeed = this.targets()[0].speed
    }
  })

  // Accelerate starfield rotation
  gsap.to(stars.rotation, {
    y: stars.rotation.y + 3,
    duration: 5,
    ease: 'power2.in'
  })

  // Fly camera forward from Planet 1 to Planet 2
  gsap.to(camera.position, {
    z: -185,
    duration: 6,
    ease: 'power2.inOut',
    onComplete: () => {
      gsap.to(streakMaterial, { opacity: 0, duration: 1.5 })
      streakSpeed = 0.5
      gameState.showFloatingNotice("🐞 Arrived at Miraculous Paris! Click the planet to enter, Tiya!")
    }
  })

  // Reveal Planet 2
  gsap.to(planetTwoMaterial, {
    opacity: 1,
    duration: 3,
    delay: 2.5,
    ease: 'power2.out'
  })

  gsap.to(catRingMat, {
    opacity: 0.8,
    duration: 3,
    delay: 2.5,
    ease: 'power2.out'
  })
}

beginButton.addEventListener(
  'click',
  () => {
    // Reveal the first universe planet & glowing atmosphere
    gsap.to(
      planetMaterial,
      {
        opacity: 1,
        duration: 3,
        delay: 3.5,
        ease: 'power2.out'
      }
    )
    gsap.to(
      atmosphereMat,
      {
        opacity: 0.5,
        duration: 3,
        delay: 3.5,
        ease: 'power2.out'
      }
    )

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
window.addEventListener(
  'click',
  (event) => {

    // Convert mouse position to Three.js coordinates
    mouse.x =
      (event.clientX / window.innerWidth) * 2 - 1

    mouse.y =
      -(event.clientY / window.innerHeight) * 2 + 1

    // Shoot a ray from the camera
    raycaster.setFromCamera(
      mouse,
      camera
    )

    // Check what the ray hits
    const intersects =
      raycaster.intersectObject(
        planet
      )

    if (intersects.length > 0) {

  console.log(
    'FIRST UNIVERSE SELECTED'
  )

  // Make the planet grow slightly
  if (
  intersects.length > 0 &&
  !universeStarted
) {

  universeStarted = true
  currentUniverse = 1
  enterUniverseOne()

  console.log(
  'ENTERING UNIVERSE',
  currentUniverse
  )
  console.log(
    'FIRST UNIVERSE SELECTED'
  )

  gsap.to(
    planet.scale,
    {
      x: 1.15,
      y: 1.15,
      z: 1.15,
      duration: 0.8,
      ease: 'power2.out'
    }
  )

}

}

  }
)