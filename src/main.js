import * as THREE from 'three'
import gsap from 'gsap'
import './style.css'
import { StorybookEngine } from './systems/storybook.js'

// ========================================
// THREE.JS COSMIC BACKGROUND ENGINE
// Living 3D starfield, hyperspace warp streaks,
// and dynamic realm nebulae.
// ========================================

const scene = new THREE.Scene()
scene.fog = new THREE.FogExp2(0x030208, 0.008)

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
camera.position.z = 15

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  powerPreference: 'high-performance'
})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputColorSpace = THREE.SRGBColorSpace
document.body.appendChild(renderer.domElement)

// ========================================
// COSMIC STARFIELD
// ========================================

const starsCount = 1800
const starsGeo = new THREE.BufferGeometry()
const starPositions = new Float32Array(starsCount * 3)
const starColors = new Float32Array(starsCount * 3)

for (let i = 0; i < starsCount; i++) {
  const i3 = i * 3
  starPositions[i3] = (Math.random() - 0.5) * 160
  starPositions[i3 + 1] = (Math.random() - 0.5) * 160
  starPositions[i3 + 2] = (Math.random() - 0.5) * 160

  // Slight color variations (white, soft violet, warm gold, pink)
  const colorChoice = Math.random()
  if (colorChoice > 0.8) {
    starColors[i3] = 0.98; starColors[i3 + 1] = 0.85; starColors[i3 + 2] = 0.45 // Gold
  } else if (colorChoice > 0.6) {
    starColors[i3] = 0.85; starColors[i3 + 1] = 0.65; starColors[i3 + 2] = 0.98 // Violet
  } else {
    starColors[i3] = 1.0; starColors[i3 + 1] = 1.0; starColors[i3 + 2] = 1.0 // Crisp White
  }
}

starsGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
starsGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3))

const starsMat = new THREE.PointsMaterial({
  size: 0.18,
  vertexColors: true,
  transparent: true,
  opacity: 0.85
})
const starfield = new THREE.Points(starsGeo, starsMat)
scene.add(starfield)

// ========================================
// HYPERSPACE WARP STREAKS
// ========================================

const streakCount = 500
const streakGeo = new THREE.BufferGeometry()
const streakPositions = new Float32Array(streakCount * 6)

for (let i = 0; i < streakCount; i++) {
  const i6 = i * 6
  const x = (Math.random() - 0.5) * 70
  const y = (Math.random() - 0.5) * 70
  const z = -Math.random() * 120

  streakPositions[i6] = x
  streakPositions[i6 + 1] = y
  streakPositions[i6 + 2] = z

  streakPositions[i6 + 3] = x
  streakPositions[i6 + 4] = y
  streakPositions[i6 + 5] = z - 2.5
}

streakGeo.setAttribute('position', new THREE.BufferAttribute(streakPositions, 3))

const streakMat = new THREE.LineBasicMaterial({
  color: 0xffffff,
  transparent: true,
  opacity: 0,
  blending: THREE.AdditiveBlending
})
const hyperspaceStreaks = new THREE.LineSegments(streakGeo, streakMat)
scene.add(hyperspaceStreaks)

// ========================================
// DYNAMIC REALM NEBULA LIGHTS
// ========================================

const ambientLight = new THREE.AmbientLight(0xec4899, 1.2)
scene.add(ambientLight)

const cosmicSun = new THREE.DirectionalLight(0xffffff, 2.0)
cosmicSun.position.set(10, 20, 15)
scene.add(cosmicSun)

// Floating Cosmic Dust Sprite
const dustCount = 80
const dustGeo = new THREE.BufferGeometry()
const dustPositions = new Float32Array(dustCount * 3)

for (let i = 0; i < dustCount * 3; i += 3) {
  dustPositions[i] = (Math.random() - 0.5) * 40
  dustPositions[i + 1] = (Math.random() - 0.5) * 30
  dustPositions[i + 2] = Math.random() * 20 - 5
}
dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3))

const dustMat = new THREE.PointsMaterial({
  size: 0.35,
  color: 0xfbcfe8,
  transparent: true,
  opacity: 0.45,
  blending: THREE.AdditiveBlending
})
const cosmicDust = new THREE.Points(dustGeo, dustMat)
scene.add(cosmicDust)

// ========================================
// WARP CONTROLLER
// ========================================

let streakSpeed = 0.5
let isWarping = false

function triggerHyperspaceWarp(chapter) {
  if (isWarping) return
  isWarping = true

  // Accelerate warp streaks
  gsap.to(streakMat, { opacity: 0.9, duration: 0.35 })
  gsap.to({ speed: streakSpeed }, {
    speed: 4.8,
    duration: 0.6,
    onUpdate: function () {
      streakSpeed = this.targets()[0].speed
    }
  })

  // Accelerate starfield rotation
  gsap.to(starfield.rotation, {
    y: starfield.rotation.y + 1.2,
    duration: 1.2,
    ease: 'power2.inOut'
  })

  // Adapt nebula light color
  if (chapter.warpColor) {
    const targetColor = new THREE.Color(chapter.warpColor)
    gsap.to(ambientLight.color, {
      r: targetColor.r,
      g: targetColor.g,
      b: targetColor.b,
      duration: 1.2,
      ease: 'power2.out'
    })
    streakMat.color.set(targetColor)
  }

  // Decelerate & fade out streaks
  setTimeout(() => {
    gsap.to(streakMat, { opacity: 0, duration: 0.6 })
    gsap.to({ speed: streakSpeed }, {
      speed: 0.5,
      duration: 0.6,
      onUpdate: function () {
        streakSpeed = this.targets()[0].speed
      },
      onComplete: () => {
        isWarping = false
      }
    })
  }, 650)
}

// ========================================
// INITIALIZE STORYBOOK ENGINE
// ========================================

const storybook = new StorybookEngine((chapter) => {
  triggerHyperspaceWarp(chapter)
})

// ========================================
// ANIMATION LOOP
// ========================================

let clock = new THREE.Clock()

function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()

  // Gentle drift of starfield
  starfield.rotation.y += 0.0004
  cosmicDust.rotation.y -= 0.0006

  // Animate hyperspace streaks
  const pos = streakGeo.attributes.position.array
  for (let i = 0; i < streakCount; i++) {
    const i6 = i * 6
    pos[i6 + 2] += streakSpeed
    pos[i6 + 5] += streakSpeed

    // Reset when streak passes camera
    if (pos[i6 + 2] > 20) {
      pos[i6 + 2] = -120
      pos[i6 + 5] = -122.5
    }
  }
  streakGeo.attributes.position.needsUpdate = true

  renderer.render(scene, camera)
}
animate()

// ========================================
// RESIZE LISTENER
// ========================================

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})