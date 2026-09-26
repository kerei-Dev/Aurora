// ========================================
// PROJECT AURORA - THE FINAL STAR: CELESTIAL BIRTHDAY FINALE
// For: TIYA
// Featuring: Thalia, Varkas, Ladybug, Cat Noir, Maomao, & Frieren
// ========================================

import * as THREE from 'three'
import gsap from 'gsap'
import { dialogueSystem } from '../systems/dialogue.js'
import { gameState } from '../systems/state.js'

let finaleGroup = null
let confettiParticles = null
let candleFlames = []
let candleLights = []
let isCandleBlown = false
let isInitialized = false

export function initUniverseFinal({ scene, camera, renderer }) {
  if (isInitialized) return
  isInitialized = true

  const flashOverlay = document.createElement('div')
  flashOverlay.className = 'celestial-flash'
  document.body.appendChild(flashOverlay)

  // Zoom camera smoothly into the heart of the Final Star
  gsap.to(camera.position, {
    z: -599.2,
    duration: 2.4,
    ease: 'power2.in',
    onComplete: () => {
      flashOverlay.classList.add('flash-active')

      setTimeout(() => {
        buildFinalBirthdayScene(scene)

        // Set camera angle admiring the birthday cake and all gathered heroes
        camera.position.set(0, 2.8, -588)
        camera.lookAt(0, 2.3, -602)

        flashOverlay.classList.remove('flash-active')
        setTimeout(() => flashOverlay.remove(), 800)

        // Play gentle introductory chime
        playSparkleSound()

        // Start grand celebration dialogue
        startGrandFinaleDialogue()
      }, 500)
    }
  })
}

function buildFinalBirthdayScene(scene) {
  finaleGroup = new THREE.Group()
  finaleGroup.position.set(0, 0, -600)

  // 1. Radiant Birthday Stage Floor (Polished Starlight Marble)
  const floorGeo = new THREE.CircleGeometry(26, 64)
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0x1e1533,
    roughness: 0.35,
    metalness: 0.25,
    emissive: 0x120826,
    emissiveIntensity: 0.5,
    side: THREE.DoubleSide
  })
  const floor = new THREE.Mesh(floorGeo, floorMat)
  floor.rotation.x = -Math.PI / 2
  floor.position.y = 0
  finaleGroup.add(floor)

  // Concentric Golden Cosmic Rings on Floor
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0xfbbf24,
    transparent: true,
    opacity: 0.45,
    side: THREE.DoubleSide
  })
  const innerRing = new THREE.Mesh(new THREE.RingGeometry(4, 4.15, 64), ringMat)
  innerRing.rotation.x = -Math.PI / 2
  innerRing.position.y = 0.02
  const outerRing = new THREE.Mesh(new THREE.RingGeometry(8, 8.2, 64), ringMat)
  outerRing.rotation.x = -Math.PI / 2
  outerRing.position.y = 0.02
  finaleGroup.add(innerRing, outerRing)

  // 2. The Grand Birthday Cake (3 Tiers in Center)
  const cakeGroup = new THREE.Group()
  cakeGroup.position.set(0, 0, -2.5)

  // Cake Table / Pedestal
  const tableMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.2,
    metalness: 0.1
  })
  const cakeTable = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.6, 0.9, 32), tableMat)
  cakeTable.position.y = 0.45
  cakeGroup.add(cakeTable)

  // Gold Trim on Table
  const goldTrimMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3, metalness: 0.8 })
  const goldTrim = new THREE.Mesh(new THREE.TorusGeometry(2.42, 0.06, 16, 64), goldTrimMat)
  goldTrim.rotation.x = Math.PI / 2
  goldTrim.position.y = 0.9
  cakeGroup.add(goldTrim)

  // Tier 1: Base Tier (Pastel Strawberry Cream)
  const tier1Mat = new THREE.MeshStandardMaterial({ color: 0xfecdd3, roughness: 0.4 })
  const tier1 = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 0.55, 32), tier1Mat)
  tier1.position.y = 1.18
  cakeGroup.add(tier1)

  // Tier 1 Frosting Ribbon
  const frostingMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 })
  const ribbon1 = new THREE.Mesh(new THREE.TorusGeometry(1.62, 0.05, 16, 64), frostingMat)
  ribbon1.rotation.x = Math.PI / 2
  ribbon1.position.y = 1.45
  cakeGroup.add(ribbon1)

  // Tier 2: Middle Tier (Soft Vanilla & Mint Cream)
  const tier2Mat = new THREE.MeshStandardMaterial({ color: 0xd1fae5, roughness: 0.4 })
  const tier2 = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.15, 0.5, 32), tier2Mat)
  tier2.position.y = 1.7
  cakeGroup.add(tier2)

  const ribbon2 = new THREE.Mesh(new THREE.TorusGeometry(1.17, 0.05, 16, 64), frostingMat)
  ribbon2.rotation.x = Math.PI / 2
  ribbon2.position.y = 1.95
  cakeGroup.add(ribbon2)

  // Tier 3: Top Tier (Lavender Starlight Cream)
  const tier3Mat = new THREE.MeshStandardMaterial({ color: 0xe9d5ff, roughness: 0.4 })
  const tier3 = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 0.45, 32), tier3Mat)
  tier3.position.y = 2.18
  cakeGroup.add(tier3)

  // Golden Birthday Star on Top of Cake
  const starGeo = new THREE.OctahedronGeometry(0.25, 0)
  const starMat = new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    emissive: 0xf59e0b,
    emissiveIntensity: 0.8,
    roughness: 0.2,
    metalness: 0.7
  })
  const cakeStar = new THREE.Mesh(starGeo, starMat)
  cakeStar.position.y = 2.7
  cakeGroup.add(cakeStar)

  // Birthday Candles on Top Tier
  candleFlames = []
  candleLights = []
  const candleMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.3 })
  const flameGeo = new THREE.ConeGeometry(0.045, 0.14, 16)
  const flameMat = new THREE.MeshBasicMaterial({ color: 0xffedd5 })

  const candleAngles = [0, (Math.PI * 2) / 5, (Math.PI * 4) / 5, (Math.PI * 6) / 5, (Math.PI * 8) / 5]
  candleAngles.forEach((ang) => {
    const cx = Math.cos(ang) * 0.45
    const cz = Math.sin(ang) * 0.45

    // Candle Stick
    const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.25, 16), candleMat)
    stick.position.set(cx, 2.52, cz)
    cakeGroup.add(stick)

    // Glowing Candle Flame
    const flame = new THREE.Mesh(flameGeo, flameMat)
    flame.position.set(cx, 2.7, cz)
    cakeGroup.add(flame)
    candleFlames.push(flame)

    // Candle Point Light for warm glow
    const candleLight = new THREE.PointLight(0xf59e0b, 1.2, 5)
    candleLight.position.set(cx, 2.72, cz)
    cakeGroup.add(candleLight)
    candleLights.push(candleLight)
  })

  finaleGroup.add(cakeGroup)

  // 3. Characters Gathered Around the Birthday Stage
  // Positions along a semi-circle behind and around the cake
  const textureLoader = new THREE.TextureLoader()

  const characters = [
    { name: 'Thalia', file: '/characters/thalia.jpg', x: -4.2, y: 1.85, z: -3.5, h: 2.2, color: 0xf472b6 },
    { name: 'Varkas', file: '/characters/varkas.jpg', x: -2.8, y: 1.95, z: -4.2, h: 2.4, color: 0xfbbf24 },
    { name: 'Ladybug', file: '/characters/ladybug.jpg', x: -1.4, y: 1.85, z: -4.8, h: 2.2, color: 0xef4444 },
    { name: 'Taylor Swift', file: '/characters/taylor_swift.jpg', x: 0, y: 1.9, z: -5.0, h: 2.3, color: 0xc084fc },
    { name: 'Cat Noir', file: '/characters/cat_noir.jpg', x: 1.4, y: 1.9, z: -4.8, h: 2.3, color: 0x22c55e },
    { name: 'Maomao', file: '/characters/maomao.jpg', x: 2.8, y: 1.8, z: -4.2, h: 2.1, color: 0x10b981 },
    { name: 'Frieren', file: '/characters/frieren.jpg', x: 4.2, y: 1.8, z: -3.5, h: 2.1, color: 0xa855f7 }
  ]

  const shadowMat = new THREE.MeshBasicMaterial({
    color: 0x070314,
    transparent: true,
    opacity: 0.5,
    side: THREE.DoubleSide
  })

  characters.forEach(char => {
    // Pedestal base
    const ped = new THREE.Mesh(
      new THREE.CylinderGeometry(0.75, 0.85, 0.08, 32),
      new THREE.MeshStandardMaterial({
        color: char.color,
        roughness: 0.2,
        metalness: 0.2,
        transparent: true,
        opacity: 0.85
      })
    )
    ped.position.set(char.x, 0.04, char.z)
    finaleGroup.add(ped)

    // Contact shadow
    const shadow = new THREE.Mesh(new THREE.CircleGeometry(0.9, 32), shadowMat)
    shadow.rotation.x = -Math.PI / 2
    shadow.position.set(char.x, 0.01, char.z)
    finaleGroup.add(shadow)

    // Standee Plane
    const tex = textureLoader.load(char.file)
    tex.colorSpace = THREE.SRGBColorSpace
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(1.5, char.h),
      new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.98 })
    )
    plane.position.set(char.x, char.y, char.z)
    finaleGroup.add(plane)
  })

  // 4. Grand Golden Starlight & Festival Confetti
  const confettiCount = 350
  const confettiGeo = new THREE.BufferGeometry()
  const confettiPos = new Float32Array(confettiCount * 3)
  const confettiColors = new Float32Array(confettiCount * 3)

  const palette = [
    [0.98, 0.75, 0.14], // Gold
    [0.96, 0.25, 0.37], // Pink / Rose
    [0.23, 0.77, 0.98], // Sky Blue
    [0.67, 0.44, 0.98], // Violet
    [0.13, 0.77, 0.37]  // Emerald
  ]

  for (let i = 0; i < confettiCount * 3; i += 3) {
    confettiPos[i] = (Math.random() - 0.5) * 26
    confettiPos[i + 1] = Math.random() * 12 + 0.5
    confettiPos[i + 2] = (Math.random() - 0.5) * 26 - 2

    const col = palette[Math.floor(Math.random() * palette.length)]
    confettiColors[i] = col[0]
    confettiColors[i + 1] = col[1]
    confettiColors[i + 2] = col[2]
  }

  confettiGeo.setAttribute('position', new THREE.BufferAttribute(confettiPos, 3))
  confettiGeo.setAttribute('color', new THREE.BufferAttribute(confettiColors, 3))

  const confettiMat = new THREE.PointsMaterial({
    size: 0.22,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending
  })

  confettiParticles = new THREE.Points(confettiGeo, confettiMat)
  finaleGroup.add(confettiParticles)

  // 5. Stage Lighting
  const stageSpot = new THREE.SpotLight(0xfff7ed, 4.5, 30, Math.PI / 3, 0.4)
  stageSpot.position.set(0, 14, 0)
  stageSpot.target = cakeTable
  finaleGroup.add(stageSpot)

  const ambientWarm = new THREE.AmbientLight(0x431407, 1.4)
  finaleGroup.add(ambientWarm)

  const cakeHighlight = new THREE.PointLight(0xfef08a, 2.5, 10)
  cakeHighlight.position.set(0, 3.5, -2.5)
  finaleGroup.add(cakeHighlight)

  scene.add(finaleGroup)

  finaleGroup.scale.set(0.1, 0.1, 0.1)
  gsap.to(finaleGroup.scale, {
    x: 1,
    y: 1,
    z: 1,
    duration: 1.8,
    ease: 'power3.out'
  })
}

export function updateUniverseFinal() {
  // Animate celebratory confetti drifting down
  if (confettiParticles && confettiParticles.geometry) {
    const pos = confettiParticles.geometry.attributes.position.array
    for (let i = 1; i < pos.length; i += 3) {
      pos[i] -= 0.02
      if (pos[i] < 0.2) pos[i] = 12
    }
    confettiParticles.geometry.attributes.position.needsUpdate = true
    confettiParticles.rotation.y += 0.0006
  }

  // Candle flame gentle flickering
  if (!isCandleBlown) {
    const time = Date.now() * 0.006
    candleFlames.forEach((flame, idx) => {
      flame.scale.x = 1 + Math.sin(time + idx) * 0.15
      flame.scale.y = 1 + Math.cos(time + idx * 1.5) * 0.18
    })
  }
}

function startGrandFinaleDialogue() {
  const script = [
    {
      speaker: 'All Heroes',
      universe: 'The Final Star',
      text: "SURPRISE!! HAPPY BIRTHDAY TIYA!! 🎂✨🎉"
    },
    {
      speaker: 'Ladybug',
      universe: 'The Final Star',
      text: "Look at you, Tiya! You journeyed across the cosmos, solved our riddles, and brought all four Star Fragments together!"
    },
    {
      speaker: 'Cat Noir',
      universe: 'The Final Star',
      text: "And now you stand at the center of the Final Star! That's what I call a truly paw-some, legendary entrance!"
    },
    {
      speaker: 'Thalia',
      universe: 'The Final Star',
      text: "We wanted to prepare something worthy of your kindness, Tiya. A starlit feast where you could make a wish and know that you are deeply cherished."
    },
    {
      speaker: 'Varkas',
      universe: 'The Final Star',
      text: "You've got strength and spirit, Tiya. Every step you took to reach this star proves it. Happy Birthday."
    },
    {
      speaker: 'Taylor Swift',
      universe: 'The Final Star',
      text: "And may your whole new year sparkle brighter than a stadium of starlight, Tiya! You are truly bejeweled!"
    },
    {
      speaker: 'Maomao',
      universe: 'The Final Star',
      text: "I inspected the birthday cake thoroughly, Tiya! Zero poisons, 100% celestial sweetness! (Master Jinshi even sent royal star-frosting!)"
    },
    {
      speaker: 'Frieren',
      universe: 'The Final Star',
      text: "In the flow of time, celebrating the person you are today is a true blessing. Tiya... the candles are waiting for your wish."
    },
    {
      speaker: 'All Heroes',
      universe: 'The Final Star',
      text: "Make your birthday wish, Tiya, and blow out the candles!"
    }
  ]

  dialogueSystem.start(script, () => {
    showCandleBlowingPrompt()
  })
}

function showCandleBlowingPrompt() {
  const promptModal = document.createElement('div')
  promptModal.className = 'aurora-modal-backdrop'
  promptModal.id = 'blow-candles-backdrop'
  promptModal.innerHTML = `
    <div class="aurora-gift-card">
      <div class="gift-sparkles">🎂 ✨ 🕯️ ✨ 🌟</div>
      <h2 class="gift-title">Make A Wish, Tiya!</h2>
      <p class="plushie-desc" style="margin-bottom: 24px;">
        Close your eyes, think of your deepest wish for this new year of life, and blow out the birthday candles!
      </p>

      <button id="blow-candles-btn" class="aurora-action-btn" style="background: linear-gradient(135deg, #f59e0b, #ef4444); font-size: 1.05rem; padding: 16px 28px;">
        Blow Out The Candles 🎂💨
      </button>
    </div>
  `
  document.body.appendChild(promptModal)

  gsap.fromTo(
    '#blow-candles-backdrop .aurora-gift-card',
    { scale: 0.8, opacity: 0, y: 20 },
    { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
  )

  document.getElementById('blow-candles-btn').addEventListener('click', () => {
    gsap.to('#blow-candles-backdrop .aurora-gift-card', {
      scale: 0.85,
      opacity: 0,
      duration: 0.35,
      onComplete: () => {
        promptModal.remove()
        executeCandleBlowing()
      }
    })
  })
}

function executeCandleBlowing() {
  isCandleBlown = true

  // Extinguish candle flames and lights
  candleFlames.forEach(flame => {
    gsap.to(flame.scale, { x: 0, y: 0, z: 0, duration: 0.4, ease: 'power2.in' })
  })
  candleLights.forEach(light => {
    gsap.to(light, { intensity: 0, duration: 0.5 })
  })

  // Play joyous Birthday Melody
  playBirthdayTune()

  // Full-screen Birthday Cleansing Fireworks Wave
  gameState.showFloatingNotice("🎉 Happy Birthday Tiya!! Wish made into the stars! 🎉")

  // Confetti explosion
  gsap.to(confettiParticles.material, { size: 0.38, duration: 0.8, yoyo: true, repeat: 3 })

  setTimeout(() => {
    showGrandBirthdayCelebrationModal()
  }, 1600)
}

function showGrandBirthdayCelebrationModal() {
  const modal = document.createElement('div')
  modal.className = 'aurora-modal-backdrop'
  modal.innerHTML = `
    <div class="aurora-gift-card finale-card" style="max-width: 620px;">
      <div class="gift-sparkles">👑 💖 🎂 🌸 ✨ 🐾 📖</div>
      <h1 class="gift-title" style="font-size: 1.85rem; color: #fef08a;">Happy Birthday, Tiya!</h1>

      <div class="finale-star-emblem">
        <span class="star-glow-icon">🌟</span>
        <h3>The Star of Tiya is Ignited!</h3>
        <p>All three fragments have fused into an eternal birthday constellation in your honor.</p>
      </div>

      <div class="birthday-letter-box">
        <p class="letter-greeting">Dearest Tiya,</p>
        <p class="letter-body">
          Happy Birthday! May this year bring you endless joy, thrilling adventures, cozy laughter with loved ones, and the quiet peace of knowing how truly special and valued you are. No matter what universe you navigate, remember that you bring warmth and light wherever you go. Keep shining brightly, Tiya!
        </p>
        <p class="letter-signoff">
          With all our love and biggest birthday cheers,<br>
          <strong>Thalia, Varkas, Ladybug, Cat Noir, Maomao, Frieren, & Taylor Swift</strong> 💖
        </p>
      </div>

      <div class="inventory-summary-box">
        <h4>✦ Your Cosmic Keepsakes ✦</h4>
        <div class="inventory-chips">
          <span class="inv-chip">🧸 Thalia & Varkas Plushie</span>
          <span class="inv-chip">🐞 Miraculous Duo Charm</span>
          <span class="inv-chip">🌿 Special Celestial Herb</span>
          <span class="inv-chip">📖 Ancient Birthday Grimoire</span>
          <span class="inv-chip">🎸 Taylor's Birthday Lullaby</span>
          <span class="inv-chip highlight-chip">🌟 The Eternal Star of Tiya</span>
        </div>
      </div>

      <button id="close-celebration-btn" class="aurora-action-btn" style="background: linear-gradient(135deg, #ec4899, #8b5cf6); margin-top: 18px;">
        Cherish The Moment 💖
      </button>
    </div>
  `
  document.body.appendChild(modal)

  gsap.fromTo(
    '.finale-card',
    { scale: 0.8, opacity: 0, y: 24 },
    { scale: 1, opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }
  )

  document.getElementById('close-celebration-btn').addEventListener('click', () => {
    gsap.to('.finale-card', {
      scale: 0.9,
      opacity: 0,
      duration: 0.4,
      onComplete: () => {
        modal.remove()
        gameState.showFloatingNotice("🌟 You have completed Project Aurora! Happy Birthday, Tiya! 💖")
      }
    })
  })
}

// ========================================
// ELEGANT WEB AUDIO MUSIC BOX SYNTHESIZER
// Plays a warm, pure "Happy Birthday" chime
// ========================================

function playSparkleSound() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    const notes = [523.25, 659.25, 783.99, 1046.50] // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const osc = audioCtx.createOscillator()
      const gain = audioCtx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime + i * 0.12)
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime + i * 0.12)
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + i * 0.12 + 0.6)
      osc.connect(gain)
      gain.connect(audioCtx.destination)
      osc.start(audioCtx.currentTime + i * 0.12)
      osc.stop(audioCtx.currentTime + i * 0.12 + 0.6)
    })
  } catch (e) {
    console.log('AudioContext not allowed without user gesture yet:', e)
  }
}

function playBirthdayTune() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    // "Happy Birthday To You" note frequencies & timings
    const melody = [
      { f: 261.63, d: 0.3 }, // Hap-
      { f: 261.63, d: 0.3 }, // py
      { f: 293.66, d: 0.6 }, // Birth-
      { f: 261.63, d: 0.6 }, // day
      { f: 349.23, d: 0.6 }, // to
      { f: 329.63, d: 1.1 }, // you

      { f: 261.63, d: 0.3 }, // Hap-
      { f: 261.63, d: 0.3 }, // py
      { f: 293.66, d: 0.6 }, // Birth-
      { f: 261.63, d: 0.6 }, // day
      { f: 392.00, d: 0.6 }, // to
      { f: 349.23, d: 1.1 }, // you

      { f: 261.63, d: 0.3 }, // Hap-
      { f: 261.63, d: 0.3 }, // py
      { f: 523.25, d: 0.6 }, // day
      { f: 440.00, d: 0.6 }, // dear
      { f: 349.23, d: 0.6 }, // Ti-
      { f: 329.63, d: 0.6 }, // ya!
      { f: 293.66, d: 0.9 },

      { f: 466.16, d: 0.3 }, // Hap-
      { f: 466.16, d: 0.3 }, // py
      { f: 440.00, d: 0.6 }, // Birth-
      { f: 349.23, d: 0.6 }, // day
      { f: 392.00, d: 0.6 }, // to
      { f: 349.23, d: 1.4 }  // you!
    ]

    let currTime = audioCtx.currentTime + 0.1
    melody.forEach(note => {
      const osc = audioCtx.createOscillator()
      const gain = audioCtx.createGain()
      osc.type = 'triangle' // Soft music box / bell chime timbre
      osc.frequency.setValueAtTime(note.f, currTime)

      gain.gain.setValueAtTime(0.12, currTime)
      gain.gain.exponentialRampToValueAtTime(0.0001, currTime + note.d * 0.95)

      osc.connect(gain)
      gain.connect(audioCtx.destination)

      osc.start(currTime)
      osc.stop(currTime + note.d)
      currTime += note.d * 0.75
    })
  } catch (e) {
    console.log('Audio tune error:', e)
  }
}
