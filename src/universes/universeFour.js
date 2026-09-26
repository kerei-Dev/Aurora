// ========================================
// PROJECT AURORA - UNIVERSE 4: THE ERAS MELODY REALM
// Featuring: Taylor Swift welcoming TIYA with a Birthday Lullaby
// ========================================

import * as THREE from 'three'
import gsap from 'gsap'
import { dialogueSystem } from '../systems/dialogue.js'
import { gameState } from '../systems/state.js'

let universeFourGroup = null
let stageSparkles = null
let isInitialized = false
let currentLullabyAudio = null
let isLullabyPlaying = false

export function initUniverseFour({ scene, camera, renderer }) {
  if (isInitialized) return
  isInitialized = true

  // Clean starlight transition
  const flashOverlay = document.createElement('div')
  flashOverlay.className = 'celestial-flash'
  document.body.appendChild(flashOverlay)

  // Zoom camera smoothly into Planet 4
  gsap.to(camera.position, {
    z: -459.2,
    duration: 2.2,
    ease: 'power2.in',
    onComplete: () => {
      flashOverlay.classList.add('flash-active')

      setTimeout(() => {
        buildErasConcertScene(scene)

        // Position camera to see Taylor Swift on stage with the concert backdrop
        camera.position.set(0, 2.2, -449)
        camera.lookAt(0, 2.3, -462)

        flashOverlay.classList.remove('flash-active')
        setTimeout(() => flashOverlay.remove(), 800)

        // Begin Taylor Swift singing & dialogue sequence
        startTaylorDialogue()
      }, 450)
    }
  })
}

function buildErasConcertScene(scene) {
  universeFourGroup = new THREE.Group()
  universeFourGroup.position.set(0, 0, -460)

  const textureLoader = new THREE.TextureLoader()

  // 1. High-Resolution Eras Stadium Stage Backdrop
  const stageTex = textureLoader.load('/backgrounds/eras_stage.jpg')
  stageTex.colorSpace = THREE.SRGBColorSpace
  stageTex.generateMipmaps = true
  stageTex.minFilter = THREE.LinearMipmapLinearFilter

  const stageGeo = new THREE.PlaneGeometry(36, 20)
  const stageMat = new THREE.MeshBasicMaterial({
    map: stageTex,
    transparent: true,
    opacity: 0.98
  })
  const stageBackdrop = new THREE.Mesh(stageGeo, stageMat)
  stageBackdrop.position.set(0, 8.5, -10.5)
  universeFourGroup.add(stageBackdrop)

  // 2. Glossy Black Concert Runway / Stage Ground
  const floorGeo = new THREE.CircleGeometry(24, 64)
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0x110e1b,
    roughness: 0.25,
    metalness: 0.35,
    emissive: 0x0a0614,
    emissiveIntensity: 0.4,
    side: THREE.DoubleSide
  })
  const floor = new THREE.Mesh(floorGeo, floorMat)
  floor.rotation.x = -Math.PI / 2
  floor.position.y = 0
  universeFourGroup.add(floor)

  // Sparkling Runway LED Catwalk Strips
  const catwalkGeo = new THREE.RingGeometry(6, 12, 64)
  const catwalkMat = new THREE.MeshBasicMaterial({
    color: 0xa855f7,
    transparent: true,
    opacity: 0.35,
    side: THREE.DoubleSide
  })
  const catwalk = new THREE.Mesh(catwalkGeo, catwalkMat)
  catwalk.rotation.x = -Math.PI / 2
  catwalk.position.y = 0.02
  universeFourGroup.add(catwalk)

  // Golden Catwalk Edge Ring
  const goldBorderMat = new THREE.MeshBasicMaterial({
    color: 0xfbbf24,
    transparent: true,
    opacity: 0.45,
    side: THREE.DoubleSide
  })
  const goldBorder = new THREE.Mesh(new THREE.RingGeometry(11.9, 12.1, 64), goldBorderMat)
  goldBorder.rotation.x = -Math.PI / 2
  goldBorder.position.y = 0.03
  universeFourGroup.add(goldBorder)

  // 3. Physical 3D Microphone Stand & Acoustic Guitar on Stage
  const chromeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.2, metalness: 0.85 })

  // Microphone Stand
  const micBase = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.4, 0.05, 16), chromeMat)
  micBase.position.set(-1.1, 0.03, -1.8)
  const micPole = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.8, 16), chromeMat)
  micPole.position.set(-1.1, 0.9, -1.8)
  const micHead = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 16), chromeMat)
  micHead.position.set(-1.1, 1.8, -1.8)
  universeFourGroup.add(micBase, micPole, micHead)

  // 4. Taylor Swift Standee (Center Stage)
  // Display Pedestal
  const pedGeo = new THREE.CylinderGeometry(0.9, 1.05, 0.08, 32)
  const pedMat = new THREE.MeshStandardMaterial({
    color: 0xc084fc,
    roughness: 0.2,
    metalness: 0.2,
    transparent: true,
    opacity: 0.9,
    emissive: 0x9333ea,
    emissiveIntensity: 0.4
  })
  const taylorPedestal = new THREE.Mesh(pedGeo, pedMat)
  taylorPedestal.position.set(0, 0.04, -2)
  universeFourGroup.add(taylorPedestal)

  // Ground Contact Shadow
  const shadowMat = new THREE.MeshBasicMaterial({
    color: 0x05020a,
    transparent: true,
    opacity: 0.6,
    side: THREE.DoubleSide
  })
  const shadow = new THREE.Mesh(new THREE.CircleGeometry(1.0, 32), shadowMat)
  shadow.rotation.x = -Math.PI / 2
  shadow.position.set(0, 0.01, -2)
  universeFourGroup.add(shadow)

  // Taylor Standee Plane
  const taylorTex = textureLoader.load('/characters/taylor_swift.jpg')
  taylorTex.colorSpace = THREE.SRGBColorSpace
  taylorTex.generateMipmaps = true
  taylorTex.minFilter = THREE.LinearMipmapLinearFilter

  const taylorMat = new THREE.MeshBasicMaterial({
    map: taylorTex,
    transparent: true,
    opacity: 0.98
  })
  const taylorPlane = new THREE.Mesh(new THREE.PlaneGeometry(1.85, 2.35), taylorMat)
  taylorPlane.position.set(0, 1.9, -2)
  universeFourGroup.add(taylorPlane)

  // 5. Stage Concert Lighting (Spotlights & Golden Stardust)
  const mainSpot = new THREE.SpotLight(0xffedd5, 4.5, 30, Math.PI / 3.5, 0.35)
  mainSpot.position.set(0, 15, -1)
  mainSpot.target = taylorPlane
  universeFourGroup.add(mainSpot)
  universeFourGroup.add(mainSpot.target)

  const purpleFill = new THREE.AmbientLight(0x581c87, 1.4)
  universeFourGroup.add(purpleFill)

  const stageEdgeLight = new THREE.PointLight(0xf472b6, 2.5, 12)
  stageEdgeLight.position.set(0, 0.5, -0.5)
  universeFourGroup.add(stageEdgeLight)

  // 6. Floating Lavender & Gold Stardust Sparkles
  const sparkleCount = 220
  const sparkleGeo = new THREE.BufferGeometry()
  const sparklePos = new Float32Array(sparkleCount * 3)
  const sparkleColors = new Float32Array(sparkleCount * 3)

  for (let i = 0; i < sparkleCount * 3; i += 3) {
    sparklePos[i] = (Math.random() - 0.5) * 24
    sparklePos[i + 1] = Math.random() * 10 + 0.3
    sparklePos[i + 2] = (Math.random() - 0.5) * 24

    if (Math.random() > 0.5) {
      sparkleColors[i] = 0.98
      sparkleColors[i + 1] = 0.85
      sparkleColors[i + 2] = 0.38 // Gold
    } else {
      sparkleColors[i] = 0.85
      sparkleColors[i + 1] = 0.55
      sparkleColors[i + 2] = 0.98 // Lavender
    }
  }

  sparkleGeo.setAttribute('position', new THREE.BufferAttribute(sparklePos, 3))
  sparkleGeo.setAttribute('color', new THREE.BufferAttribute(sparkleColors, 3))

  const sparkleMat = new THREE.PointsMaterial({
    size: 0.18,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending
  })
  stageSparkles = new THREE.Points(sparkleGeo, sparkleMat)
  universeFourGroup.add(stageSparkles)

  scene.add(universeFourGroup)

  universeFourGroup.scale.set(0.1, 0.1, 0.1)
  gsap.to(universeFourGroup.scale, {
    x: 1,
    y: 1,
    z: 1,
    duration: 1.6,
    ease: 'power3.out'
  })
}

export function updateUniverseFour() {
  if (stageSparkles && stageSparkles.geometry) {
    const pos = stageSparkles.geometry.attributes.position.array
    for (let i = 1; i < pos.length; i += 3) {
      pos[i] += 0.008
      if (pos[i] > 10) pos[i] = 0.3
    }
    stageSparkles.geometry.attributes.position.needsUpdate = true
    stageSparkles.rotation.y += 0.0006
  }
}

export function cleanupUniverseFour() {
  if (universeFourGroup) {
    universeFourGroup.visible = false
  }
  if (currentLullabyAudio) {
    currentLullabyAudio.pause()
    currentLullabyAudio = null
    isLullabyPlaying = false
  }
}

function startTaylorDialogue() {
  const script = [
    {
      speaker: 'Taylor Swift',
      universe: 'The Eras Melody Realm',
      text: "Can I go where you go? Can we always be this close forever and ever... 🎶"
    },
    {
      speaker: 'Taylor Swift',
      universe: 'The Eras Melody Realm',
      text: "And ah, take me out, and take me home... you're my, my, my, my... 🎶"
    },
    {
      speaker: 'Taylor Swift',
      universe: 'The Eras Melody Realm',
      text: "Wait... look at the starlight on the runway! Is that... TIYA?!"
    },
    {
      speaker: 'Taylor Swift',
      universe: 'The Eras Melody Realm',
      text: "TIYA!! HAPPY BIRTHDAY! 🎉✨ Oh my goodness, welcome to the Eras Realm! I spotted your starship the second you crossed the galaxy!"
    },
    {
      speaker: 'Taylor Swift',
      universe: 'The Eras Melody Realm',
      text: "I was just doing an acoustic rehearsal, but celebrating your special day is a billion times more important! Look how far you've traveled!"
    },
    {
      speaker: 'Taylor Swift',
      universe: 'The Eras Melody Realm',
      text: "You've gathered the flowers from Thalia & Varkas, the courage from Ladybug & Cat Noir, and the magic from Maomao & Frieren..."
    },
    {
      speaker: 'Taylor Swift',
      universe: 'The Eras Melody Realm',
      text: "For your birthday gift, Tiya, I recorded a special acoustic music box lullaby version of our song just for you! It's peaceful, warm, and filled with love."
    },
    {
      speaker: 'Taylor Swift',
      universe: 'The Eras Melody Realm',
      text: "You can listen to it right now, and even download the audio file directly to your device so you can keep it forever! Here is your lullaby and the fourth Star Fragment, Tiya!"
    }
  ]

  dialogueSystem.start(script, () => {
    showTaylorGiftModal()
  })
}

function showTaylorGiftModal() {
  // Pre-generate the WAV Blob
  const lullabyBlob = generateLullabyWavBlob()
  const lullabyUrl = URL.createObjectURL(lullabyBlob)

  const modal = document.createElement('div')
  modal.className = 'aurora-modal-backdrop'
  modal.innerHTML = `
    <div class="aurora-gift-card" style="max-width: 540px;">
      <div class="gift-sparkles">🎸 💜 ✨ 🎵 🌟</div>
      <h2 class="gift-title">Taylor's Birthday Gift For Tiya</h2>

      <div class="plushie-showcase" style="background: rgba(88, 28, 135, 0.25); border-color: rgba(192, 132, 252, 0.4);">
        <div class="plushie-art">
          <span class="plush-chibi" style="background: rgba(192, 132, 252, 0.2); border: 1px solid #c084fc; color: #fbcfe8;">
            🎤 Taylor Swift
          </span>
          <span class="plush-heart">💖</span>
          <span class="plush-chibi" style="background: rgba(251, 191, 36, 0.2); border: 1px solid #fbbf24; color: #fef08a;">
            🌟 For Tiya
          </span>
        </div>
        <p class="plushie-name">"Lover" Acoustic Birthday Lullaby</p>
        <p class="plushie-desc">
          An intimate, sparkling music box lullaby arrangement created with love by Taylor Swift. 
          Infused with peaceful warmth, cozy starlight, and endless birthday wishes for Tiya.
        </p>

        <!-- Interactive Audio Player -->
        <div class="lullaby-player-box" style="margin-top: 16px; padding: 14px; background: rgba(15, 23, 42, 0.7); border-radius: 14px; border: 1px solid rgba(255, 255, 255, 0.15);">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px;">
            <button id="lullaby-play-btn" class="aurora-action-btn" style="width: auto; padding: 9px 18px; background: #a855f7; font-size: 0.88rem;">
              ▶ Play Lullaby
            </button>
            <span id="lullaby-status" style="font-size: 0.82rem; color: #cbd5e1;">Acoustic Music Box Melody</span>
            <a id="download-lullaby-link" href="${lullabyUrl}" download="Tiya_Birthday_Lullaby_Taylor_Swift.wav" class="aurora-action-btn" style="width: auto; padding: 9px 16px; background: #10b981; font-size: 0.85rem; text-decoration: none; display: inline-flex; align-items: center; gap: 6px;">
              ⬇ Download .wav
            </a>
          </div>
        </div>
      </div>

      <div class="fragment-reward" style="border-color: rgba(192, 132, 252, 0.5);">
        <div class="fragment-icon" style="color: #c084fc;">✦</div>
        <div class="fragment-info">
          <strong>Star Fragment #4: The Harmonic Starlight</strong>
          <span>Resonating with music and celestial joy! All 4 Star Fragments secured!</span>
        </div>
      </div>

      <button id="claim-taylor-btn" class="aurora-action-btn" style="background: linear-gradient(135deg, #a855f7, #ec4899);">
        Accept Gift & Proceed To The Final Star ➔
      </button>
    </div>
  `
  document.body.appendChild(modal)

  gsap.fromTo(
    '.aurora-gift-card',
    { scale: 0.8, opacity: 0, y: 20 },
    { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
  )

  // Audio Play/Pause Handling
  const playBtn = document.getElementById('lullaby-play-btn')
  const statusLabel = document.getElementById('lullaby-status')
  currentLullabyAudio = new Audio(lullabyUrl)

  playBtn.addEventListener('click', () => {
    if (isLullabyPlaying) {
      currentLullabyAudio.pause()
      isLullabyPlaying = false
      playBtn.textContent = '▶ Play Lullaby'
      statusLabel.textContent = 'Paused'
    } else {
      currentLullabyAudio.currentTime = 0
      currentLullabyAudio.play()
      isLullabyPlaying = true
      playBtn.textContent = '⏸ Pause'
      statusLabel.textContent = 'Playing for Tiya... 🎶'
    }
  })

  currentLullabyAudio.addEventListener('ended', () => {
    isLullabyPlaying = false
    playBtn.textContent = '▶ Play Lullaby'
    statusLabel.textContent = 'Melody complete 💖'
  })

  // Claim Gift and advance
  document.getElementById('claim-taylor-btn').addEventListener('click', () => {
    if (currentLullabyAudio) {
      currentLullabyAudio.pause()
      isLullabyPlaying = false
    }

    gameState.addInventoryItem({
      id: 'taylor_lullaby',
      name: "Taylor's Acoustic Birthday Lullaby",
      description: 'A custom music box arrangement of "Lover" gifted to Tiya by Taylor Swift.'
    })

    gameState.addStarFragment({
      id: 'fragment_4',
      name: 'Harmonic Starlight',
      world: 'The Eras Melody Realm'
    })

    gsap.to('.aurora-gift-card', {
      scale: 0.85,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.in',
      onComplete: () => {
        modal.remove()
        showFinalStarSummonsModal()
      }
    })
  })
}

function showFinalStarSummonsModal() {
  const riddleModal = document.createElement('div')
  riddleModal.className = 'aurora-modal-backdrop'
  riddleModal.innerHTML = `
    <div class="aurora-riddle-card">
      <div class="riddle-header">
        <span class="riddle-tag">✦ Final Destiny For Tiya ✦</span>
        <h2>The Path to the Final Star</h2>
      </div>

      <div class="riddle-scroll">
        <p class="riddle-verse">
          Four star fragments burn with warmth, their light begins to chime,<br>
          Weaving every laugh, each gift, and song through space and time.<br><br>
          The final constellation calls, where all your friends await,<br>
          A golden cake, glowing candles, and a grand cosmic fete.<br><br>
          Are you ready, Tiya, to ignite the Final Star,<br>
          And celebrate the brilliant, wonderful soul you are?
        </p>
      </div>

      <div class="riddle-dialogue-signoff">
        <span class="signoff-quote">"You belong in the starlight, Tiya! Let's go make a wish!"</span>
        <span>— Taylor Swift</span>
      </div>

      <button id="ignite-star-btn" class="aurora-action-btn" style="background: linear-gradient(135deg, #f59e0b, #ec4899);">
        Ignite The Final Star ➔
      </button>
    </div>
  `
  document.body.appendChild(riddleModal)

  gsap.fromTo(
    '.aurora-riddle-card',
    { scale: 0.8, opacity: 0, y: 20 },
    { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
  )

  document.getElementById('ignite-star-btn').addEventListener('click', () => {
    gsap.to('.aurora-riddle-card', {
      scale: 0.85,
      opacity: 0,
      duration: 0.4,
      onComplete: () => {
        riddleModal.remove()
        gameState.showFloatingNotice("✨ All 4 Star Fragments collected! The Final Star is ignited for Tiya!")

        if (typeof window.startTravelToFinalStar === 'function') {
          window.startTravelToFinalStar()
        }
      }
    })
  })
}

// ========================================
// REAL WAV PCM AUDIO SYNTHESIS
// Synthesizes Taylor Swift's "Lover" Lullaby
// Generates a valid .wav file for listening and download
// ========================================

function generateLullabyWavBlob() {
  const sampleRate = 44100

  // "Lover" chorus melodic progression (Key of G major)
  // "Can I go where you go? Can we always be this close forever and ever..."
  const notes = [
    // G4, A4, B4, D5, B4, A4, G4 (Can I go where you go?)
    { f: 392.00, d: 0.45 },
    { f: 440.00, d: 0.45 },
    { f: 493.88, d: 0.65 },
    { f: 587.33, d: 0.95 },
    { f: 493.88, d: 0.65 },
    { f: 440.00, d: 0.65 },
    { f: 392.00, d: 1.10 },

    // E4, G4, A4, B4, A4, G4, E4 (Can we always be this close...)
    { f: 329.63, d: 0.45 },
    { f: 392.00, d: 0.45 },
    { f: 440.00, d: 0.55 },
    { f: 493.88, d: 0.75 },
    { f: 440.00, d: 0.55 },
    { f: 392.00, d: 0.75 },
    { f: 329.63, d: 1.20 },

    // E4, G4, A4, B4, D5, E5, D5 (Forever and ever...)
    { f: 329.63, d: 0.45 },
    { f: 392.00, d: 0.55 },
    { f: 440.00, d: 0.55 },
    { f: 493.88, d: 0.65 },
    { f: 587.33, d: 0.85 },
    { f: 659.25, d: 0.95 },
    { f: 587.33, d: 1.30 },

    // D5, B4, A4, G4, A4, G4 (You're my, my, my, my... lover)
    { f: 587.33, d: 0.45 },
    { f: 493.88, d: 0.45 },
    { f: 440.00, d: 0.45 },
    { f: 392.00, d: 0.55 },
    { f: 440.00, d: 0.85 },
    { f: 392.00, d: 2.20 }
  ]

  let totalDuration = 0.5 // Initial lead-in
  notes.forEach(n => { totalDuration += n.d * 0.85 })
  totalDuration += 2.0 // Outro ring

  const numSamples = Math.floor(sampleRate * totalDuration)
  const samples = new Float32Array(numSamples)

  let currentTime = 0.5
  notes.forEach(note => {
    const noteStart = Math.floor(currentTime * sampleRate)
    const noteDurationSamples = Math.floor(note.d * 1.8 * sampleRate) // Bell resonance tail

    for (let i = 0; i < noteDurationSamples; i++) {
      const idx = noteStart + i
      if (idx >= numSamples) break

      const t = i / sampleRate
      // Bell / Celesta synthesis (Fundamental + 2nd harmonic + 3rd harmonic + gentle decay)
      const envelope = Math.exp(-t * 3.2)
      const tone1 = Math.sin(2 * Math.PI * note.f * t)
      const tone2 = 0.35 * Math.sin(2 * Math.PI * note.f * 2 * t) * Math.exp(-t * 4.5)
      const tone3 = 0.15 * Math.sin(2 * Math.PI * note.f * 3 * t) * Math.exp(-t * 6.0)

      samples[idx] += (tone1 + tone2 + tone3) * envelope * 0.28
    }

    currentTime += note.d * 0.85
  })

  // Encode to 16-bit PCM WAV
  const buffer = new ArrayBuffer(44 + numSamples * 2)
  const view = new DataView(buffer)

  function writeString(offset, string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i))
    }
  }

  // RIFF Chunk
  writeString(0, 'RIFF')
  view.setUint32(4, 36 + numSamples * 2, true)
  writeString(8, 'WAVE')

  // fmt sub-chunk
  writeString(12, 'fmt ')
  view.setUint32(16, 16, true) // PCM chunk size
  view.setUint16(20, 1, true)  // AudioFormat = PCM (1)
  view.setUint16(22, 1, true)  // NumChannels = 1 (Mono)
  view.setUint32(24, sampleRate, true) // SampleRate
  view.setUint32(28, sampleRate * 2, true) // ByteRate
  view.setUint16(32, 2, true)  // BlockAlign
  view.setUint16(34, 16, true) // BitsPerSample = 16

  // data sub-chunk
  writeString(36, 'data')
  view.setUint32(40, numSamples * 2, true)

  // Write PCM samples (clamped to [-32768, 32767])
  let offset = 44
  for (let i = 0; i < numSamples; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]))
    const val = s < 0 ? s * 0x8000 : s * 0x7FFF
    view.setInt16(offset, val, true)
    offset += 2
  }

  return new Blob([buffer], { type: 'audio/wav' })
}
