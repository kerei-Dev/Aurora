// ========================================
// PROJECT AURORA - UNIVERSE 1: FORGOTTEN FIELD & ROYAL PALACE
// Featuring: Thalia & Varkas welcoming TIYA
// ========================================

import * as THREE from 'three'
import gsap from 'gsap'
import { dialogueSystem } from '../systems/dialogue.js'
import { gameState } from '../systems/state.js'

let universeGroup = null
let fireflies = null
let petals = null
let characterStandee = null
let isInitialized = false

export function initUniverseOne({ scene, camera, renderer }) {
  if (isInitialized) return
  isInitialized = true

  // 1. Clean Starlight Transition
  const flashOverlay = document.createElement('div')
  flashOverlay.className = 'celestial-flash'
  document.body.appendChild(flashOverlay)

  // Zoom camera deeply into Planet 1
  gsap.to(camera.position, {
    z: -79.2,
    duration: 2.2,
    ease: 'power2.in',
    onComplete: () => {
      flashOverlay.classList.add('flash-active')

      setTimeout(() => {
        buildForgottenFieldScene(scene)

        // Position camera to see Thalia, Varkas, and the majestic royal palace behind them
        camera.position.set(0, 2.3, -69)
        camera.lookAt(0, 2.4, -82)

        flashOverlay.classList.remove('flash-active')
        setTimeout(() => flashOverlay.remove(), 800)

        // Begin story dialogue sequence
        startDialogueSequence()
      }, 450)
    }
  })
}

function buildForgottenFieldScene(scene) {
  universeGroup = new THREE.Group()
  universeGroup.position.set(0, 0, -80)

  const textureLoader = new THREE.TextureLoader()

  // 1. Grand Royal Palace Manhwa Backdrop
  const palaceTex = textureLoader.load('/backgrounds/royal_palace.jpg')
  palaceTex.colorSpace = THREE.SRGBColorSpace

  const palaceGeo = new THREE.PlaneGeometry(36, 30)
  const palaceMat = new THREE.MeshBasicMaterial({
    map: palaceTex,
    transparent: true,
    opacity: 0.98
  })
  const palaceMesh = new THREE.Mesh(palaceGeo, palaceMat)
  palaceMesh.position.set(0, 11, -12)
  universeGroup.add(palaceMesh)

  // 2. Palace Terrace Ground Courtyard
  const groundGeo = new THREE.CircleGeometry(22, 64)
  const groundMat = new THREE.MeshStandardMaterial({
    color: 0x1e1533,
    roughness: 0.7,
    metalness: 0.15,
    emissive: 0x110b1f,
    emissiveIntensity: 0.35,
    side: THREE.DoubleSide
  })
  const ground = new THREE.Mesh(groundGeo, groundMat)
  ground.rotation.x = -Math.PI / 2
  ground.position.y = 0
  universeGroup.add(ground)

  // Palace courtyard decorative glowing ring
  const ringGeo = new THREE.RingGeometry(8, 16, 64)
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x818cf8,
    transparent: true,
    opacity: 0.22,
    side: THREE.DoubleSide
  })
  const ring = new THREE.Mesh(ringGeo, ringMat)
  ring.rotation.x = -Math.PI / 2
  ring.position.y = 0.05
  universeGroup.add(ring)

  // 3. Radiant Palace Sunlight & Ambient Warmth
  const sunLight = new THREE.DirectionalLight(0xfff7ed, 3.2)
  sunLight.position.set(5, 18, -6)
  sunLight.target.position.set(0, 2, -2)
  universeGroup.add(sunLight)
  universeGroup.add(sunLight.target)

  const ambientLight = new THREE.AmbientLight(0x6366f1, 1.3)
  universeGroup.add(ambientLight)

  const courtyardLight = new THREE.PointLight(0xfef08a, 2.5, 18)
  courtyardLight.position.set(0, 2.5, -2)
  universeGroup.add(courtyardLight)

  // 4. Floating Petals & Golden Sun Glimmers
  const petalCount = 180
  const petalGeo = new THREE.BufferGeometry()
  const petalPos = new Float32Array(petalCount * 3)

  for (let i = 0; i < petalCount * 3; i += 3) {
    petalPos[i] = (Math.random() - 0.5) * 22
    petalPos[i + 1] = Math.random() * 11 + 0.2
    petalPos[i + 2] = (Math.random() - 0.5) * 22
  }

  petalGeo.setAttribute('position', new THREE.BufferAttribute(petalPos, 3))
  const petalMat = new THREE.PointsMaterial({
    color: 0xfbcfe8,
    size: 0.22,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  })
  petals = new THREE.Points(petalGeo, petalMat)
  universeGroup.add(petals)

  const fireflyCount = 140
  const fireflyGeo = new THREE.BufferGeometry()
  const fireflyPos = new Float32Array(fireflyCount * 3)
  for (let i = 0; i < fireflyCount * 3; i += 3) {
    fireflyPos[i] = (Math.random() - 0.5) * 24
    fireflyPos[i + 1] = Math.random() * 9 + 0.5
    fireflyPos[i + 2] = (Math.random() - 0.5) * 24
  }
  fireflyGeo.setAttribute('position', new THREE.BufferAttribute(fireflyPos, 3))
  const fireflyMat = new THREE.PointsMaterial({
    color: 0xfef08a,
    size: 0.16,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending
  })
  fireflies = new THREE.Points(fireflyGeo, fireflyMat)
  universeGroup.add(fireflies)

  // 5. In-World Character Standees (Thalia & Varkas on Palace Terrace)
  const thaliaTex = textureLoader.load('/characters/thalia.jpg')
  const thaliaMat = new THREE.MeshBasicMaterial({ map: thaliaTex, transparent: true, opacity: 0.98 })
  const thaliaPlane = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 2.2), thaliaMat)
  thaliaPlane.position.set(-1.1, 1.8, -2)
  universeGroup.add(thaliaPlane)

  const varkasTex = textureLoader.load('/characters/varkas.jpg')
  const varkasMat = new THREE.MeshBasicMaterial({ map: varkasTex, transparent: true, opacity: 0.98 })
  const varkasPlane = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 2.4), varkasMat)
  varkasPlane.position.set(1.1, 1.9, -2)
  universeGroup.add(varkasPlane)

  // Romantic glowing aura between them
  const auraGeo = new THREE.TorusGeometry(1.6, 0.05, 16, 64)
  const auraMat = new THREE.MeshStandardMaterial({
    color: 0xf472b6,
    emissive: 0xdb2777,
    emissiveIntensity: 0.8
  })
  characterStandee = new THREE.Mesh(auraGeo, auraMat)
  characterStandee.position.set(0, 1.8, -2.1)
  universeGroup.add(characterStandee)

  scene.add(universeGroup)

  universeGroup.scale.set(0.1, 0.1, 0.1)
  gsap.to(universeGroup.scale, {
    x: 1,
    y: 1,
    z: 1,
    duration: 1.6,
    ease: 'power3.out'
  })
}

export function updateUniverseOne() {
  if (fireflies && fireflies.geometry) {
    const pos = fireflies.geometry.attributes.position.array
    for (let i = 1; i < pos.length; i += 3) {
      pos[i] += 0.007
      if (pos[i] > 9) pos[i] = 0.5
    }
    fireflies.geometry.attributes.position.needsUpdate = true
    fireflies.rotation.y += 0.0005
  }

  if (petals && petals.geometry) {
    const pPos = petals.geometry.attributes.position.array
    for (let i = 1; i < pPos.length; i += 3) {
      pPos[i] -= 0.012
      if (pPos[i] < 0.2) pPos[i] = 11
    }
    petals.geometry.attributes.position.needsUpdate = true
    petals.rotation.y -= 0.0006
  }

  if (characterStandee) {
    characterStandee.rotation.z += 0.004
  }
}

export function cleanupUniverseOne() {
  if (universeGroup) {
    universeGroup.visible = false
  }
}

function startDialogueSequence() {
  const script = [
    {
      speaker: 'Thalia',
      universe: 'Forgotten Field & Royal Palace',
      text: "See, Varkas? I told you! Standing here by the royal palace with the warm sun shining down... you owe me that dessert!"
    },
    {
      speaker: 'Varkas',
      universe: 'Forgotten Field & Royal Palace',
      text: "I never agreed to that bet. And besides... wait. Look toward the upper palace gates. Something fast just broke through orbit."
    },
    {
      speaker: 'Thalia',
      universe: 'Forgotten Field & Royal Palace',
      text: "HOLD ON! Wait wait wait... no way..."
    },
    {
      speaker: 'Varkas',
      universe: 'Forgotten Field & Royal Palace',
      text: "...Is that who I think it is? Is that TIYA?!"
    },
    {
      speaker: 'Thalia',
      universe: 'Forgotten Field & Royal Palace',
      text: "YOOOO TIYAAA!! YOU ACTUALLY MADE IT HERE! Hehe! Look at you flying through outer space to come visit us at the palace!"
    },
    {
      speaker: 'Varkas',
      universe: 'Forgotten Field & Royal Palace',
      text: "TIYA! Look at you! Honestly didn't think anyone could navigate that hyper-warp. Welcome to our haven."
    },
    {
      speaker: 'Thalia',
      universe: 'Forgotten Field & Royal Palace',
      text: "HAPPY BIRTHDAY TIYA!! 🎉 Did you really think we'd forget your special day?! We've been hyping this up for weeks!"
    },
    {
      speaker: 'Varkas',
      universe: 'Forgotten Field & Royal Palace',
      text: "Seriously, Happy Birthday, Tiya. You've been handling everything like an absolute champ this year. Big respect."
    },
    {
      speaker: 'Thalia',
      universe: 'Forgotten Field & Royal Palace',
      text: "Hehe! Varkas was trying to act all cool and unbothered, but he kept looking through the palace telescope every 2 minutes asking 'Is Tiya here yet?!'"
    },
    {
      speaker: 'Varkas',
      universe: 'Forgotten Field & Royal Palace',
      text: "...Alright, you really didn't need to snitch on me like that. But yeah, today is all about you, Tiya. Time to kick back and enjoy the ride."
    },
    {
      speaker: 'Thalia',
      universe: 'Forgotten Field & Royal Palace',
      text: "Of course! And we couldn't let you leave without a special gift! Look what we made for you—"
    },
    {
      speaker: 'Varkas',
      universe: 'Forgotten Field & Royal Palace',
      text: "She dragged me into helping sew the tiny cape, so you better appreciate it! Take our plushie with you across the galaxies."
    },
    {
      speaker: 'Thalia & Varkas',
      universe: 'Forgotten Field & Royal Palace',
      text: "Claim our plushie and the first Star Fragment, Tiya! Then we've got a riddle for your next universe!"
    }
  ]

  dialogueSystem.start(script, () => {
    showPlushieGiftModal()
  })
}

function showPlushieGiftModal() {
  const modal = document.createElement('div')
  modal.className = 'aurora-modal-backdrop'
  modal.innerHTML = `
    <div class="aurora-gift-card">
      <div class="gift-sparkles">✨ 🌸 ⚔️ ✨</div>
      <h2 class="gift-title">A Gift For Tiya!</h2>
      
      <div class="plushie-showcase">
        <div class="plushie-art">
          <span class="plush-chibi thalia-plush">🌸 Thalia</span>
          <span class="plush-heart">🤍</span>
          <span class="plush-chibi varkas-plush">⚔️ Varkas</span>
        </div>
        <p class="plushie-name">Handcrafted Thalia & Varkas Plushie</p>
        <p class="plushie-desc">
          Hand-stitched in the shining royal palace specially for Tiya's birthday! 
          It radiates cozy, warm vibes so you will never feel alone on your journey across the cosmos.
        </p>
      </div>

      <div class="fragment-reward">
        <div class="fragment-icon">✦</div>
        <div class="fragment-info">
          <strong>Star Fragment #1: Serenity's Bloom</strong>
          <span>Secured from the Forgotten Field! Only a few more to reach the Final Star.</span>
        </div>
      </div>

      <button id="claim-gift-btn" class="aurora-action-btn">
        Accept Souvenir & Star Fragment
      </button>
    </div>
  `
  document.body.appendChild(modal)

  gsap.fromTo(
    '.aurora-gift-card',
    { scale: 0.8, opacity: 0, y: 20 },
    { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
  )

  document.getElementById('claim-gift-btn').addEventListener('click', () => {
    gameState.addInventoryItem({
      id: 'thalia_varkas_plushie',
      name: 'Thalia & Varkas Plushie',
      description: 'Handcrafted duo plushie celebrating Tiya.'
    })

    gameState.addStarFragment({
      id: 'fragment_1',
      name: "Serenity's Bloom",
      world: 'Forgotten Field'
    })

    gsap.to('.aurora-gift-card', {
      scale: 0.85,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.in',
      onComplete: () => {
        modal.remove()
        showRiddleModal()
      }
    })
  })
}

function showRiddleModal() {
  const riddleModal = document.createElement('div')
  riddleModal.className = 'aurora-modal-backdrop'
  riddleModal.innerHTML = `
    <div class="aurora-riddle-card">
      <div class="riddle-header">
        <span class="riddle-tag">✦ Clue For Tiya ✦</span>
        <h2>Riddle of the Next Realm</h2>
      </div>

      <div class="riddle-scroll">
        <p class="riddle-verse">
          You walked through our palace and rested where the flowers bloom,<br>
          Now leap into the city streets where heroes pierce the gloom!<br><br>
          Look for spotted wings of red and claws that leap with flair,<br>
          Where witty jokes and feline puns fill the Parisian air.<br><br>
          Can Tiya help the heroes solve the Lucky Charm in sight,<br>
          And de-evilize the shadows to claim the next star's light?
        </p>
      </div>

      <div class="riddle-dialogue-signoff">
        <span class="signoff-quote">"Go crush it, Tiya! We're rooting for you from our palace courtyard!"</span>
        <span>— Thalia & Varkas</span>
      </div>

      <button id="next-journey-btn" class="aurora-action-btn">
        Chart Course for Miraculous Paris ➔
      </button>
    </div>
  `
  document.body.appendChild(riddleModal)

  gsap.fromTo(
    '.aurora-riddle-card',
    { scale: 0.8, opacity: 0, y: 20 },
    { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
  )

  document.getElementById('next-journey-btn').addEventListener('click', () => {
    gsap.to('.aurora-riddle-card', {
      scale: 0.85,
      opacity: 0,
      duration: 0.4,
      onComplete: () => {
        riddleModal.remove()
        gameState.showFloatingNotice("🌌 Planet 1 Completed! First Star Fragment secured, Tiya!")

        if (typeof window.startTravelToUniverseTwo === 'function') {
          window.startTravelToUniverseTwo()
        }
      }
    })
  })
}
