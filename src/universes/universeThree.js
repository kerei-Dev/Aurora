// ========================================
// PROJECT AURORA - UNIVERSE 3: ANCIENT APOTHECARY GROVE
// Featuring: Maomao & Frieren welcoming TIYA
// ========================================

import * as THREE from 'three'
import gsap from 'gsap'
import { dialogueSystem } from '../systems/dialogue.js'
import { gameState } from '../systems/state.js'

let universeThreeGroup = null
let sporeParticles = null
let steamParticles = null
let isInitialized = false

export function initUniverseThree({ scene, camera, renderer }) {
  if (isInitialized) return
  isInitialized = true

  // Clean transition
  const flashOverlay = document.createElement('div')
  flashOverlay.className = 'celestial-flash'
  document.body.appendChild(flashOverlay)

  // Zoom camera into Planet 3
  gsap.to(camera.position, {
    z: -319.2,
    duration: 2.2,
    ease: 'power2.in',
    onComplete: () => {
      flashOverlay.classList.add('flash-active')

      setTimeout(() => {
        buildApothecaryGroveScene(scene)

        // Position camera to see Maomao, Frieren, their tea table, and the fantasy grove
        camera.position.set(0, 2.3, -309)
        camera.lookAt(0, 2.4, -322)

        flashOverlay.classList.remove('flash-active')
        setTimeout(() => flashOverlay.remove(), 800)

        // Begin dialogue sequence
        startApothecaryDialogue()
      }, 450)
    }
  })
}

function buildApothecaryGroveScene(scene) {
  universeThreeGroup = new THREE.Group()
  universeThreeGroup.position.set(0, 0, -320)

  const textureLoader = new THREE.TextureLoader()

  // 1. Mossy Stone & Meadow Ground
  const groundGeo = new THREE.CircleGeometry(24, 64)
  const groundMat = new THREE.MeshStandardMaterial({
    color: 0x1c3123, // Deep fantasy moss green
    roughness: 0.85,
    metalness: 0.05,
    emissive: 0x0c1910,
    emissiveIntensity: 0.35,
    side: THREE.DoubleSide
  })
  const ground = new THREE.Mesh(groundGeo, groundMat)
  ground.rotation.x = -Math.PI / 2
  ground.position.y = 0
  universeThreeGroup.add(ground)

  // Magical Ancient Runic Circle on Ground
  const runeGeo = new THREE.RingGeometry(8, 16, 64)
  const runeMat = new THREE.MeshBasicMaterial({
    color: 0x34d399,
    transparent: true,
    opacity: 0.22,
    side: THREE.DoubleSide
  })
  const rune = new THREE.Mesh(runeGeo, runeMat)
  rune.rotation.x = -Math.PI / 2
  rune.position.y = 0.04
  universeThreeGroup.add(rune)

  // 2. Physical 3D Tea Table & Props (Grounds the Scene!)
  const woodMat = new THREE.MeshStandardMaterial({
    color: 0x5c3d24,
    roughness: 0.7,
    metalness: 0.1
  })

  // Wooden Tea Table
  const tableTop = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 0.12, 32), woodMat)
  tableTop.position.set(0, 1.1, -1.9)
  const tableLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.25, 1.1, 16), woodMat)
  tableLeg.position.set(0, 0.55, -1.9)
  universeThreeGroup.add(tableTop, tableLeg)

  // Table Contact Shadow on Ground
  const tableShadowGeo = new THREE.CircleGeometry(1.8, 32)
  const shadowMat = new THREE.MeshBasicMaterial({
    color: 0x050d08,
    transparent: true,
    opacity: 0.55,
    side: THREE.DoubleSide
  })
  const tableShadow = new THREE.Mesh(tableShadowGeo, shadowMat)
  tableShadow.rotation.x = -Math.PI / 2
  tableShadow.position.set(0, 0.02, -1.9)
  universeThreeGroup.add(tableShadow)

  // Ceramic Teapot & Frieren's Teacup on Table
  const ceramicMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2 })
  const teapot = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 16), ceramicMat)
  teapot.position.set(-0.35, 1.34, -1.9)
  const teacup = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.08, 0.14, 16), ceramicMat)
  teacup.position.set(0.4, 1.25, -1.8)
  universeThreeGroup.add(teapot, teacup)

  // Ancient Leather Grimoire on Table
  const grimoireMat = new THREE.MeshStandardMaterial({
    color: 0x7c2d12,
    roughness: 0.5,
    emissive: 0x9a3412,
    emissiveIntensity: 0.2
  })
  const grimoireMesh = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.1, 0.5), grimoireMat)
  grimoireMesh.position.set(0.1, 1.22, -2.1)
  grimoireMesh.rotation.y = 0.25
  universeThreeGroup.add(grimoireMesh)

  // Maomao's Glass Herbal Potion Flasks
  const potionMat = new THREE.MeshStandardMaterial({
    color: 0x10b981,
    roughness: 0.1,
    transparent: true,
    opacity: 0.85,
    emissive: 0x059669,
    emissiveIntensity: 0.6
  })
  const potionFlask = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.14, 0.35, 16), potionMat)
  potionFlask.position.set(-0.7, 1.35, -2.0)
  universeThreeGroup.add(potionFlask)

  // 3. Contact Shadows for Characters
  const charShadowGeo = new THREE.CircleGeometry(1.1, 32)

  const leftShadow = new THREE.Mesh(charShadowGeo, shadowMat)
  leftShadow.rotation.x = -Math.PI / 2
  leftShadow.position.set(-1.2, 0.02, -2)
  universeThreeGroup.add(leftShadow)

  const rightShadow = new THREE.Mesh(charShadowGeo, shadowMat)
  rightShadow.rotation.x = -Math.PI / 2
  rightShadow.position.set(1.2, 0.02, -2)
  universeThreeGroup.add(rightShadow)

  // 4. Ancient Herbal Apothecary & Frieren Forest Grove Scenic Backdrop
  const groveBackdropTex = textureLoader.load('/backgrounds/apothecary_grove.jpg')
  groveBackdropTex.colorSpace = THREE.SRGBColorSpace
  const groveBackdropGeo = new THREE.PlaneGeometry(36, 20)
  const groveBackdropMat = new THREE.MeshBasicMaterial({
    map: groveBackdropTex,
    transparent: true,
    opacity: 0.98
  })
  const groveBackdropMesh = new THREE.Mesh(groveBackdropGeo, groveBackdropMat)
  groveBackdropMesh.position.set(0, 8.5, -10.5)
  universeThreeGroup.add(groveBackdropMesh)

  // Character Pedestal Bases
  const pedestalGeo = new THREE.CylinderGeometry(0.85, 0.95, 0.08, 32)
  const maomaoPedMat = new THREE.MeshStandardMaterial({
    color: 0x059669,
    roughness: 0.3,
    metalness: 0.1,
    transparent: true,
    opacity: 0.85,
    emissive: 0x047857,
    emissiveIntensity: 0.3
  })
  const maomaoPedestal = new THREE.Mesh(pedestalGeo, maomaoPedMat)
  maomaoPedestal.position.set(-1.2, 0.04, -2)
  universeThreeGroup.add(maomaoPedestal)

  const frierenPedMat = new THREE.MeshStandardMaterial({
    color: 0x9333ea,
    roughness: 0.3,
    metalness: 0.1,
    transparent: true,
    opacity: 0.85,
    emissive: 0x7e22ce,
    emissiveIntensity: 0.3
  })
  const frierenPedestal = new THREE.Mesh(pedestalGeo, frierenPedMat)
  frierenPedestal.position.set(1.2, 0.04, -2)
  universeThreeGroup.add(frierenPedestal)

  // 5. In-World Character Standees (Maomao on left, Frieren seated on right)
  const maomaoTex = textureLoader.load('/characters/maomao.jpg')
  maomaoTex.colorSpace = THREE.SRGBColorSpace
  const maomaoMat = new THREE.MeshBasicMaterial({ map: maomaoTex, transparent: true, opacity: 0.98 })
  const maomaoPlane = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 2.2), maomaoMat)
  maomaoPlane.position.set(-1.2, 1.8, -2)
  universeThreeGroup.add(maomaoPlane)

  const frierenTex = textureLoader.load('/characters/frieren.jpg')
  frierenTex.colorSpace = THREE.SRGBColorSpace
  const frierenMat = new THREE.MeshBasicMaterial({ map: frierenTex, transparent: true, opacity: 0.98 })
  const frierenPlane = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 2.1), frierenMat)
  frierenPlane.position.set(1.2, 1.75, -2) // Seated slightly lower by table
  universeThreeGroup.add(frierenPlane)

  // 6. Warm Sunlight & Ambient Grove Light
  const groveSun = new THREE.DirectionalLight(0xfef3c7, 3.2)
  groveSun.position.set(8, 20, -10)
  groveSun.target.position.set(0, 2, -2)
  universeThreeGroup.add(groveSun)
  universeThreeGroup.add(groveSun.target)

  const groveAmbient = new THREE.AmbientLight(0x064e3b, 1.3)
  universeThreeGroup.add(groveAmbient)

  const lanternLight = new THREE.PointLight(0xfef08a, 2.8, 16)
  lanternLight.position.set(0, 2.2, -1.9)
  universeThreeGroup.add(lanternLight)

  // 7. Floating Botanical Spores & Gentle Tea Steam
  const sporeCount = 200
  const sporeGeo = new THREE.BufferGeometry()
  const sporePos = new Float32Array(sporeCount * 3)

  for (let i = 0; i < sporeCount * 3; i += 3) {
    sporePos[i] = (Math.random() - 0.5) * 22
    sporePos[i + 1] = Math.random() * 9 + 0.3
    sporePos[i + 2] = (Math.random() - 0.5) * 22
  }

  sporeGeo.setAttribute('position', new THREE.BufferAttribute(sporePos, 3))
  const sporeMat = new THREE.PointsMaterial({
    color: 0x6ee7b7,
    size: 0.18,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending
  })
  sporeParticles = new THREE.Points(sporeGeo, sporeMat)
  universeThreeGroup.add(sporeParticles)

  scene.add(universeThreeGroup)

  universeThreeGroup.scale.set(0.1, 0.1, 0.1)
  gsap.to(universeThreeGroup.scale, {
    x: 1,
    y: 1,
    z: 1,
    duration: 1.6,
    ease: 'power3.out'
  })
}

export function updateUniverseThree() {
  if (sporeParticles && sporeParticles.geometry) {
    const pos = sporeParticles.geometry.attributes.position.array
    for (let i = 1; i < pos.length; i += 3) {
      pos[i] += 0.007
      if (pos[i] > 9) pos[i] = 0.3
    }
    sporeParticles.geometry.attributes.position.needsUpdate = true
    sporeParticles.rotation.y += 0.0005
  }
}

export function cleanupUniverseThree() {
  if (universeThreeGroup) {
    universeThreeGroup.visible = false
  }
}

function startApothecaryDialogue() {
  const script = [
    {
      speaker: 'Frieren',
      universe: 'Ancient Apothecary Grove',
      text: "Mmm... this tea is quite nice. It was brewed using an ancient spell that cleanses evil spirits... or maybe it was the one that makes water slightly bitter. I forgot."
    },
    {
      speaker: 'Maomao',
      universe: 'Ancient Apothecary Grove',
      text: "Wait... this aroma! Frieren-sama, did you brew this with dried Mandrake roots and fermented moon-grass?! If an imperial minister drank this, they would hallucinate for three whole days! ...I LOVE IT. Please give me three jars!"
    },
    {
      speaker: 'Frieren',
      universe: 'Ancient Apothecary Grove',
      text: "I found the recipe in a dungeon chest about eighty years ago. Anyway, look who just walked in through the grove."
    },
    {
      speaker: 'Maomao',
      universe: 'Ancient Apothecary Grove',
      text: "WAIT... is that TIYA?!"
    },
    {
      speaker: 'Frieren',
      universe: 'Ancient Apothecary Grove',
      text: "Tiya! Happy Birthday. In human years, you're another year older. That feels like it happened in the blink of an eye, but Himmel always said birthdays are worth making a big fuss over."
    },
    {
      speaker: 'Maomao',
      universe: 'Ancient Apothecary Grove',
      text: "HAPPY BIRTHDAY TIYA! 🌸 Sit down, have some tea! Forget court manners today—we have the CRAZIEST tea to spill!"
    },
    {
      speaker: 'Maomao',
      universe: 'Ancient Apothecary Grove',
      text: "So at the rear palace, Master Jinshi was literally pacing around his pavilion blushing like crazy because he was trying to figure out what gift to send across dimensions to Tiya without looking desperate!"
    },
    {
      speaker: 'Frieren',
      universe: 'Ancient Apothecary Grove',
      text: "And in our party, Fern got furious at Stark yesterday because he ate her favorite giant hamburger. Stark tried to defend himself with warrior pride, but Fern just gave him that terrifying pout and ignored him for six hours."
    },
    {
      speaker: 'Maomao',
      universe: 'Ancient Apothecary Grove',
      text: "Men are truly hopeless, aren't they?"
    },
    {
      speaker: 'Frieren',
      universe: 'Ancient Apothecary Grove',
      text: "Indeed. Sein ran off to another casino looking for an older woman, too."
    },
    {
      speaker: 'Maomao',
      universe: 'Ancient Apothecary Grove',
      text: "Anyway, Tiya! For your special birthday, I prepared this Special Rare Celestial Herb! It cures all exhaustion and boosts your mental focus! (Warning: It tastes terrifyingly bitter, but it's guaranteed to work!)"
    },
    {
      speaker: 'Frieren',
      universe: 'Ancient Apothecary Grove',
      text: "And from me... an Ancient Grimoire. It contains a spell to create harmless sparkling birthday magic and blooming flowers whenever Tiya smiles."
    },
    {
      speaker: 'Maomao & Frieren',
      universe: 'Ancient Apothecary Grove',
      text: "Claim our gifts and the third Star Fragment, Tiya! All your fragments are almost assembled!"
    }
  ]

  dialogueSystem.start(script, () => {
    showApothecaryGiftModal()
  })
}

function showApothecaryGiftModal() {
  const modal = document.createElement('div')
  modal.className = 'aurora-modal-backdrop'
  modal.innerHTML = `
    <div class="aurora-gift-card">
      <div class="gift-sparkles">🌿 📖 ✨ 🧪 🌸</div>
      <h2 class="gift-title">Gifts From The Ancient Grove!</h2>

      <div class="plushie-showcase">
        <div class="plushie-art">
          <span class="plush-chibi" style="background: rgba(16, 185, 129, 0.15); border: 1px solid #10b981; color: #6ee7b7;">🌿 Maomao</span>
          <span class="plush-heart">🍵</span>
          <span class="plush-chibi" style="background: rgba(192, 132, 252, 0.15); border: 1px solid #c084fc; color: #e9d5ff;">📖 Frieren</span>
        </div>
        <p class="plushie-name">Special Celestial Herb & Ancient Birthday Grimoire</p>
        <p class="plushie-desc">
          Hand-picked by Maomao to boost vitality and ward off fatigue, paired with Frieren's ancient grimoire spell that conjures sparkling birthday light and blooming flowers.
        </p>
      </div>

      <div class="fragment-reward">
        <div class="fragment-icon">✦</div>
        <div class="fragment-info">
          <strong>Star Fragment #3: Fragment of Wonder</strong>
          <span>Infused with ancient magic and herbal blessings! 3 Star Fragments secured!</span>
        </div>
      </div>

      <button id="claim-apothecary-btn" class="aurora-action-btn" style="background: #10b981;">
        Accept Souvenirs & Star Fragment #3
      </button>
    </div>
  `
  document.body.appendChild(modal)

  gsap.fromTo(
    '.aurora-gift-card',
    { scale: 0.8, opacity: 0, y: 20 },
    { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
  )

  document.getElementById('claim-apothecary-btn').addEventListener('click', () => {
    gameState.addInventoryItem({
      id: 'celestial_herb',
      name: 'Special Celestial Herb',
      description: 'Hand-picked by Maomao to cure exhaustion and sharpen focus.'
    })

    gameState.addInventoryItem({
      id: 'ancient_grimoire',
      name: 'Ancient Birthday Grimoire',
      description: "Frieren's spell book that summons sparkling flowers whenever Tiya smiles."
    })

    gameState.addStarFragment({
      id: 'fragment_3',
      name: 'Fragment of Wonder',
      world: 'Ancient Apothecary Grove'
    })

    gsap.to('.aurora-gift-card', {
      scale: 0.85,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.in',
      onComplete: () => {
        modal.remove()
        showPlanetFourRiddleModal()
      }
    })
  })
}

function showPlanetFourRiddleModal() {
  const riddleModal = document.createElement('div')
  riddleModal.className = 'aurora-modal-backdrop'
  riddleModal.innerHTML = `
    <div class="aurora-riddle-card">
      <div class="riddle-header">
        <span class="riddle-tag">✦ Clue For Tiya ✦</span>
        <h2>Riddle of Planet 4</h2>
      </div>

      <div class="riddle-scroll">
        <p class="riddle-verse">
          Three fragments gathered, shining true with ancient grace and wit,<br>
          Now hear a golden melody where purple starlights flit!<br><br>
          An acoustic guitar, friendship beads, and songs that softly chime,<br>
          A superstar awaits to sing across all space and time.<br><br>
          Can Tiya guess whose gentle voice will welcome her tonight,<br>
          And share a birthday lullaby beneath the stage's light?
        </p>
      </div>

      <div class="riddle-dialogue-signoff">
        <span class="signoff-quote">"Listen closely to the melody, Tiya! A musical icon is waiting for you!"</span>
        <span>— Maomao & Frieren</span>
      </div>

      <button id="planet-four-btn" class="aurora-action-btn" style="background: linear-gradient(135deg, #a855f7, #ec4899);">
        Chart Course For Planet 4 ➔
      </button>
    </div>
  `
  document.body.appendChild(riddleModal)

  gsap.fromTo(
    '.aurora-riddle-card',
    { scale: 0.8, opacity: 0, y: 20 },
    { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
  )

  document.getElementById('planet-four-btn').addEventListener('click', () => {
    gsap.to('.aurora-riddle-card', {
      scale: 0.85,
      opacity: 0,
      duration: 0.4,
      onComplete: () => {
        riddleModal.remove()
        gameState.showFloatingNotice("💜 Planet 3 Complete! Setting coordinates for the Eras Melody Realm!")

        if (typeof window.startTravelToUniverseFour === 'function') {
          window.startTravelToUniverseFour()
        }
      }
    })
  })
}
