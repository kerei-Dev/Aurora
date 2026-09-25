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
let sunMesh = null
let sunRays = []
let isInitialized = false

export function initUniverseOne({ scene, camera, renderer }) {
  if (isInitialized) return
  isInitialized = true

  // 1. Atmosphere Entry Transition
  const flashOverlay = document.createElement('div')
  flashOverlay.className = 'celestial-flash'
  document.body.appendChild(flashOverlay)

  // Zoom camera deeply into the planet
  gsap.to(camera.position, {
    z: -79.2,
    duration: 2.2,
    ease: 'power2.in',
    onComplete: () => {
      // Flash transition into the world
      flashOverlay.classList.add('flash-active')

      setTimeout(() => {
        buildForgottenFieldScene(scene)

        // Position camera to view Thalia, Varkas, the meadow, and the sunlit palace behind them
        camera.position.set(0, 2.3, -69)
        camera.lookAt(0, 2.5, -82)

        flashOverlay.classList.remove('flash-active')
        setTimeout(() => flashOverlay.remove(), 1200)

        // Begin story dialogue sequence
        startDialogueSequence()
      }, 500)
    }
  })
}

function buildForgottenFieldScene(scene) {
  universeGroup = new THREE.Group()
  universeGroup.position.set(0, 0, -80)

  // 1. Magical Meadow Ground Disc
  const groundGeo = new THREE.CircleGeometry(20, 64)
  const groundMat = new THREE.MeshStandardMaterial({
    color: 0x1f153a,
    roughness: 0.75,
    metalness: 0.1,
    emissive: 0x120b24,
    emissiveIntensity: 0.4,
    side: THREE.DoubleSide
  })
  const ground = new THREE.Mesh(groundGeo, groundMat)
  ground.rotation.x = -Math.PI / 2
  ground.position.y = 0
  universeGroup.add(ground)

  // 2. Glowing Floral Energy Ring
  const ringGeo = new THREE.RingGeometry(8, 16, 48)
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x9333ea,
    transparent: true,
    opacity: 0.28,
    side: THREE.DoubleSide
  })
  const ring = new THREE.Mesh(ringGeo, ringMat)
  ring.rotation.x = -Math.PI / 2
  ring.position.y = 0.05
  universeGroup.add(ring)

  // ========================================
  // 3. BEAUTIFUL ROYAL PALACE SHINING WITH SUN
  // ========================================
  const palaceGroup = new THREE.Group()
  palaceGroup.position.set(0, 0, -10) // Positioned majestically behind Thalia & Varkas

  const marbleMat = new THREE.MeshStandardMaterial({
    color: 0xfdfcf7,
    roughness: 0.3,
    metalness: 0.15,
    emissive: 0xfffae6,
    emissiveIntensity: 0.2
  })

  const goldTrimMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    roughness: 0.2,
    metalness: 0.85,
    emissive: 0xd97706,
    emissiveIntensity: 0.3
  })

  // Palace Base / Grand Terrace
  const terraceGeo = new THREE.BoxGeometry(22, 1.2, 8)
  const terrace = new THREE.Mesh(terraceGeo, marbleMat)
  terrace.position.set(0, 0.6, 0)
  palaceGroup.add(terrace)

  // Grand Colonnade (Royal Columns)
  for (let x = -8; x <= 8; x += 2.6) {
    const colGeo = new THREE.CylinderGeometry(0.35, 0.42, 7.5, 24)
    const col = new THREE.Mesh(colGeo, marbleMat)
    col.position.set(x, 4.8, 0)
    palaceGroup.add(col)

    // Gold capital at top of column
    const capGeo = new THREE.BoxGeometry(0.9, 0.3, 0.9)
    const cap = new THREE.Mesh(capGeo, goldTrimMat)
    cap.position.set(x, 8.6, 0)
    palaceGroup.add(cap)
  }

  // Palace Architrave & Pediment (Roof)
  const architraveGeo = new THREE.BoxGeometry(19, 0.8, 2.5)
  const architrave = new THREE.Mesh(architraveGeo, marbleMat)
  architrave.position.set(0, 9, 0)
  palaceGroup.add(architrave)

  // Triangular Classical Pediment
  const pedimentGeo = new THREE.ConeGeometry(9.5, 3.2, 4)
  const pediment = new THREE.Mesh(pedimentGeo, marbleMat)
  pediment.rotation.y = Math.PI / 4
  pediment.position.set(0, 10.9, 0)
  palaceGroup.add(pediment)

  // Royal Golden Crest in center of pediment
  const crestGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.15, 32)
  const crest = new THREE.Mesh(crestGeo, goldTrimMat)
  crest.rotation.x = Math.PI / 2
  crest.position.set(0, 10.5, 1)
  palaceGroup.add(crest)

  // Towering Palace Domes & Spires on Left and Right
  const domeMat = new THREE.MeshStandardMaterial({
    color: 0x6366f1,
    roughness: 0.2,
    metalness: 0.5,
    emissive: 0x4338ca,
    emissiveIntensity: 0.4
  })

  // Left Tower
  const tower1 = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 2.2, 10, 32), marbleMat)
  tower1.position.set(-10.5, 5, 0)
  const dome1 = new THREE.Mesh(new THREE.SphereGeometry(2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), domeMat)
  dome1.position.set(-10.5, 10, 0)
  const spire1 = new THREE.Mesh(new THREE.ConeGeometry(0.4, 3, 16), goldTrimMat)
  spire1.position.set(-10.5, 13.5, 0)
  palaceGroup.add(tower1, dome1, spire1)

  // Right Tower
  const tower2 = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 2.2, 10, 32), marbleMat)
  tower2.position.set(10.5, 5, 0)
  const dome2 = new THREE.Mesh(new THREE.SphereGeometry(2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), domeMat)
  dome2.position.set(10.5, 10, 0)
  const spire2 = new THREE.Mesh(new THREE.ConeGeometry(0.4, 3, 16), goldTrimMat)
  spire2.position.set(10.5, 13.5, 0)
  palaceGroup.add(tower2, dome2, spire2)

  // Radiant Glowing Sun directly behind and above the Palace
  const sunGeo = new THREE.SphereGeometry(3.2, 32, 32)
  const sunMat = new THREE.MeshBasicMaterial({
    color: 0xfff3cc
  })
  sunMesh = new THREE.Mesh(sunGeo, sunMat)
  sunMesh.position.set(0, 16, -4)
  palaceGroup.add(sunMesh)

  // Sun Corona Glow
  const coronaGeo = new THREE.SphereGeometry(4.5, 32, 32)
  const coronaMat = new THREE.MeshBasicMaterial({
    color: 0xfde047,
    transparent: true,
    opacity: 0.35,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending
  })
  const corona = new THREE.Mesh(coronaGeo, coronaMat)
  sunMesh.add(corona)

  // Golden Sun Rays (God Rays streaming down into the courtyard)
  for (let i = -3; i <= 3; i++) {
    const rayGeo = new THREE.CylinderGeometry(0.3, 2.8, 22, 16)
    const rayMat = new THREE.MeshBasicMaterial({
      color: 0xffedd5,
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    })
    const ray = new THREE.Mesh(rayGeo, rayMat)
    ray.position.set(i * 3.5, 8, -2)
    ray.rotation.z = i * 0.08
    ray.rotation.x = 0.2
    sunRays.push(ray)
    palaceGroup.add(ray)
  }

  // Brilliant Palace Sunlight
  const palaceSunlight = new THREE.DirectionalLight(0xfff7ed, 3.2)
  palaceSunlight.position.set(0, 18, -2)
  palaceSunlight.target.position.set(0, 2, -5)
  palaceGroup.add(palaceSunlight)
  palaceGroup.add(palaceSunlight.target)

  universeGroup.add(palaceGroup)

  // ========================================
  // 4. FLOATING PARTICLES (FIREFLIES & PETALS)
  // ========================================
  const fireflyCount = 200
  const fireflyGeo = new THREE.BufferGeometry()
  const fireflyPos = new Float32Array(fireflyCount * 3)
  for (let i = 0; i < fireflyCount * 3; i += 3) {
    fireflyPos[i] = (Math.random() - 0.5) * 26
    fireflyPos[i + 1] = Math.random() * 8 + 0.5
    fireflyPos[i + 2] = (Math.random() - 0.5) * 26
  }
  fireflyGeo.setAttribute('position', new THREE.BufferAttribute(fireflyPos, 3))
  const fireflyMat = new THREE.PointsMaterial({
    color: 0xffd97d,
    size: 0.16,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending
  })
  fireflies = new THREE.Points(fireflyGeo, fireflyMat)
  universeGroup.add(fireflies)

  // Floating Violet & Rose Petals
  const petalCount = 150
  const petalGeo = new THREE.BufferGeometry()
  const petalPos = new Float32Array(petalCount * 3)
  for (let i = 0; i < petalCount * 3; i += 3) {
    petalPos[i] = (Math.random() - 0.5) * 20
    petalPos[i + 1] = Math.random() * 10
    petalPos[i + 2] = (Math.random() - 0.5) * 20
  }
  petalGeo.setAttribute('position', new THREE.BufferAttribute(petalPos, 3))
  const petalMat = new THREE.PointsMaterial({
    color: 0xf4a6e8,
    size: 0.22,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending
  })
  petals = new THREE.Points(petalGeo, petalMat)
  universeGroup.add(petals)

  // Cozy Lanterns in Courtyard
  const lanternGeo = new THREE.SphereGeometry(0.3, 16, 16)
  const lanternMat = new THREE.MeshBasicMaterial({ color: 0xffeedd })
  const lantern1 = new THREE.Mesh(lanternGeo, lanternMat)
  lantern1.position.set(-2.2, 1.8, -2)
  universeGroup.add(lantern1)

  const lantern2 = new THREE.Mesh(lanternGeo, lanternMat)
  lantern2.position.set(2.2, 1.8, -2)
  universeGroup.add(lantern2)

  const sanctuaryLight = new THREE.PointLight(0xffb366, 2.5, 18)
  sanctuaryLight.position.set(0, 2, -2)
  universeGroup.add(sanctuaryLight)

  const ambientSanctuary = new THREE.AmbientLight(0x52367d, 1.6)
  universeGroup.add(ambientSanctuary)

  // ========================================
  // 5. IN-WORLD 3D STANDEES (THALIA & VARKAS)
  // ========================================
  const textureLoader = new THREE.TextureLoader()

  const thaliaTex = textureLoader.load('/characters/thalia.jpg')
  const thaliaMat = new THREE.MeshBasicMaterial({
    map: thaliaTex,
    transparent: true,
    opacity: 0.95
  })
  const thaliaPlane = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 2.2), thaliaMat)
  thaliaPlane.position.set(-1.1, 1.8, -2)
  universeGroup.add(thaliaPlane)

  const varkasTex = textureLoader.load('/characters/varkas.jpg')
  const varkasMat = new THREE.MeshBasicMaterial({
    map: varkasTex,
    transparent: true,
    opacity: 0.95
  })
  const varkasPlane = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 2.4), varkasMat)
  varkasPlane.position.set(1.1, 1.9, -2)
  universeGroup.add(varkasPlane)

  // Glowing heart aura between them
  const auraGeo = new THREE.TorusGeometry(1.6, 0.06, 16, 64)
  const auraMat = new THREE.MeshStandardMaterial({
    color: 0xffa4d8,
    emissive: 0x992266,
    emissiveIntensity: 0.8
  })
  characterStandee = new THREE.Mesh(auraGeo, auraMat)
  characterStandee.position.set(0, 1.8, -2.1)
  universeGroup.add(characterStandee)

  scene.add(universeGroup)

  // Fade-in animation of the whole sanctuary & palace
  universeGroup.scale.set(0.1, 0.1, 0.1)
  gsap.to(universeGroup.scale, {
    x: 1,
    y: 1,
    z: 1,
    duration: 1.8,
    ease: 'power3.out'
  })
}

export function updateUniverseOne() {
  if (fireflies && fireflies.geometry) {
    const pos = fireflies.geometry.attributes.position.array
    for (let i = 1; i < pos.length; i += 3) {
      pos[i] += 0.008
      if (pos[i] > 8) pos[i] = 0.5
    }
    fireflies.geometry.attributes.position.needsUpdate = true
    fireflies.rotation.y += 0.0006
  }

  if (petals && petals.geometry) {
    const pPos = petals.geometry.attributes.position.array
    for (let i = 1; i < pPos.length; i += 3) {
      pPos[i] -= 0.012
      if (pPos[i] < 0.2) pPos[i] = 10
    }
    petals.geometry.attributes.position.needsUpdate = true
    petals.rotation.y -= 0.0008
  }

  if (characterStandee) {
    characterStandee.rotation.z += 0.005
  }

  if (sunMesh) {
    sunMesh.rotation.y += 0.002
  }

  // Gentle breathing pulse for the god rays
  sunRays.forEach((ray, idx) => {
    ray.material.opacity = 0.1 + Math.sin(Date.now() * 0.0015 + idx) * 0.04
  })
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
          "Hand-stitched in the shining royal palace specially for Tiya's birthday! 
          It radiates cozy, warm vibes so you'll never feel alone on your journey across the cosmos."
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
    { scale: 0.7, opacity: 0, y: 30 },
    { scale: 1, opacity: 1, y: 0, duration: 0.8, ease: 'back.out(1.7)' }
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
      scale: 0.8,
      opacity: 0,
      duration: 0.5,
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
          "You walked through our palace and rested where the flowers bloom,<br>
          Now leap into the city streets where heroes pierce the gloom!<br><br>
          Look for spotted wings of red and claws that leap with flair,<br>
          Where witty jokes and feline puns fill the nighttime air.<br><br>
          Can Tiya help the heroes solve the Lucky Charm in sight,<br>
          And de-evilize the shadows to claim the next star's light?"
        </p>
      </div>

      <div class="riddle-dialogue-signoff">
        <em>"Go crush it, Tiya! We're rooting for you from our palace meadow!"</em>
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
    { scale: 0.8, opacity: 0, y: 40 },
    { scale: 1, opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }
  )

  document.getElementById('next-journey-btn').addEventListener('click', () => {
    gsap.to('.aurora-riddle-card', {
      scale: 0.8,
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        riddleModal.remove()
        gameState.showFloatingNotice("🌌 Planet 1 Completed! First Star Fragment secured, Tiya!")

        // Trigger cosmic transition to Planet 2!
        if (typeof window.startTravelToUniverseTwo === 'function') {
          window.startTravelToUniverseTwo()
        }
      }
    })
  })
}
