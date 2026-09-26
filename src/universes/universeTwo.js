// ========================================
// PROJECT AURORA - UNIVERSE 2: MIRACULOUS PARIS
// Featuring: Ladybug & Cat Noir in Paris welcoming TIYA
// ========================================

import * as THREE from 'three'
import gsap from 'gsap'
import { dialogueSystem } from '../systems/dialogue.js'
import { gameState } from '../systems/state.js'

let universeTwoGroup = null
let parisSparkles = null
let isInitialized = false

export function initUniverseTwo({ scene, camera, renderer }) {
  if (isInitialized) return
  isInitialized = true

  // Clean transition
  const flashOverlay = document.createElement('div')
  flashOverlay.className = 'celestial-flash'
  document.body.appendChild(flashOverlay)

  // Zoom camera into Planet 2
  gsap.to(camera.position, {
    z: -199.2,
    duration: 2.2,
    ease: 'power2.in',
    onComplete: () => {
      flashOverlay.classList.add('flash-active')

      setTimeout(() => {
        buildParisScene(scene)

        // Position camera to see Paris, the Eiffel Tower, Ladybug, and Cat Noir
        camera.position.set(0, 2.3, -189)
        camera.lookAt(0, 2.4, -202)

        flashOverlay.classList.remove('flash-active')
        setTimeout(() => flashOverlay.remove(), 800)

        // Begin dialogue sequence
        startMiraculousDialogue()
      }, 450)
    }
  })
}

function buildParisScene(scene) {
  universeTwoGroup = new THREE.Group()
  universeTwoGroup.position.set(0, 0, -200)

  const textureLoader = new THREE.TextureLoader()

  // 1. Authentic Paris Scenic Backdrop (Eiffel Tower & Seine River)
  const parisTex = textureLoader.load('/backgrounds/paris_scene.jpg')
  parisTex.colorSpace = THREE.SRGBColorSpace

  const parisGeo = new THREE.PlaneGeometry(36, 28)
  const parisMat = new THREE.MeshBasicMaterial({
    map: parisTex,
    transparent: true,
    opacity: 0.98
  })
  const parisBackdrop = new THREE.Mesh(parisGeo, parisMat)
  parisBackdrop.position.set(0, 10, -12)
  universeTwoGroup.add(parisBackdrop)

  // 2. Parisian Promenade Ground (Cobblestone / Stone Terrace)
  const groundGeo = new THREE.CircleGeometry(22, 64)
  const groundMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.8,
    metalness: 0.1,
    emissive: 0x0f172a,
    emissiveIntensity: 0.3,
    side: THREE.DoubleSide
  })
  const ground = new THREE.Mesh(groundGeo, groundMat)
  ground.rotation.x = -Math.PI / 2
  ground.position.y = 0
  universeTwoGroup.add(ground)

  // Decorative Paris Miraculous Ring
  const ringGeo = new THREE.RingGeometry(8, 16, 64)
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0xef4444,
    transparent: true,
    opacity: 0.2,
    side: THREE.DoubleSide
  })
  const ring = new THREE.Mesh(ringGeo, ringMat)
  ring.rotation.x = -Math.PI / 2
  ring.position.y = 0.05
  universeTwoGroup.add(ring)

  // 3. Bright Parisian Daytime Sunlight
  const parisSun = new THREE.DirectionalLight(0xfffbeb, 3.2)
  parisSun.position.set(6, 18, -4)
  parisSun.target.position.set(0, 2, -2)
  universeTwoGroup.add(parisSun)
  universeTwoGroup.add(parisSun.target)

  const parisSkyAmbient = new THREE.AmbientLight(0x60a5fa, 1.4)
  universeTwoGroup.add(parisSkyAmbient)

  // 4. Floating Magical Sparkles (Pink Ladybug & Green Cat Noir)
  const sparkleCount = 180
  const sparkleGeo = new THREE.BufferGeometry()
  const sparklePos = new Float32Array(sparkleCount * 3)
  const sparkleColors = new Float32Array(sparkleCount * 3)

  for (let i = 0; i < sparkleCount * 3; i += 3) {
    sparklePos[i] = (Math.random() - 0.5) * 22
    sparklePos[i + 1] = Math.random() * 10 + 0.5
    sparklePos[i + 2] = (Math.random() - 0.5) * 22

    if (i % 2 === 0) {
      sparkleColors[i] = 0.95
      sparkleColors[i + 1] = 0.25
      sparkleColors[i + 2] = 0.4
    } else {
      sparkleColors[i] = 0.15
      sparkleColors[i + 1] = 0.85
      sparkleColors[i + 2] = 0.35
    }
  }

  sparkleGeo.setAttribute('position', new THREE.BufferAttribute(sparklePos, 3))
  sparkleGeo.setAttribute('color', new THREE.BufferAttribute(sparkleColors, 3))

  const sparkleMat = new THREE.PointsMaterial({
    size: 0.18,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending
  })
  parisSparkles = new THREE.Points(sparkleGeo, sparkleMat)
  universeTwoGroup.add(parisSparkles)

  // 5. In-World Character Standees (Ladybug & Cat Noir in Paris)
  const ladybugTex = textureLoader.load('/characters/ladybug.jpg')
  const ladybugMat = new THREE.MeshBasicMaterial({ map: ladybugTex, transparent: true, opacity: 0.98 })
  const ladybugPlane = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 2.2), ladybugMat)
  ladybugPlane.position.set(-1.1, 1.8, -2)
  universeTwoGroup.add(ladybugPlane)

  const catNoirTex = textureLoader.load('/characters/cat_noir.jpg')
  const catNoirMat = new THREE.MeshBasicMaterial({ map: catNoirTex, transparent: true, opacity: 0.98 })
  const catNoirPlane = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 2.3), catNoirMat)
  catNoirPlane.position.set(1.1, 1.9, -2)
  universeTwoGroup.add(catNoirPlane)

  scene.add(universeTwoGroup)

  universeTwoGroup.scale.set(0.1, 0.1, 0.1)
  gsap.to(universeTwoGroup.scale, {
    x: 1,
    y: 1,
    z: 1,
    duration: 1.6,
    ease: 'power3.out'
  })
}

export function updateUniverseTwo() {
  if (parisSparkles && parisSparkles.geometry) {
    const pos = parisSparkles.geometry.attributes.position.array
    for (let i = 1; i < pos.length; i += 3) {
      pos[i] += 0.008
      if (pos[i] > 10) pos[i] = 0.5
    }
    parisSparkles.geometry.attributes.position.needsUpdate = true
    parisSparkles.rotation.y += 0.0006
  }
}

export function cleanupUniverseTwo() {
  if (universeTwoGroup) {
    universeTwoGroup.visible = false
  }
}

function startMiraculousDialogue() {
  const script = [
    {
      speaker: 'Cat Noir',
      universe: 'Miraculous Paris',
      text: "Well, well, well! Look who just made a paws-itively miraculous entrance in Paris!"
    },
    {
      speaker: 'Ladybug',
      universe: 'Miraculous Paris',
      text: "Cat Noir, please, give the cat puns a rest for five seconds... wait, is that TIYA?!"
    },
    {
      speaker: 'Cat Noir',
      universe: 'Miraculous Paris',
      text: "In the flesh, M'Lady! Happy Purr-thday, Tiya! Hope you're ready for a claw-some celebration across Paris!"
    },
    {
      speaker: 'Ladybug',
      universe: 'Miraculous Paris',
      text: "Don't mind him, Tiya! HAPPY BIRTHDAY!! 🎉 We got the alert all the way from the stars that it's your special day!"
    },
    {
      speaker: 'Cat Noir',
      universe: 'Miraculous Paris',
      text: "Hey, my puns are top tier! But seriously, Tiya, look at you cruising through space like a pro superhero. Total respect!"
    },
    {
      speaker: 'Ladybug',
      universe: 'Miraculous Paris',
      text: "We wanted to celebrate with you peacefully, but Hawk Moth just sent a mischievous Akuma right as you arrived!"
    },
    {
      speaker: 'Cat Noir',
      universe: 'Miraculous Paris',
      text: "And worse... my ring is beeping! Plagg is completely exhausted and whining for his favorite food. Tiya, you know what he needs, right?!"
    },
    {
      speaker: 'Ladybug',
      universe: 'Miraculous Paris',
      text: "Help us feed Plagg and de-evilize this Akuma, Tiya! We know you've watched our adventures—show us how it's done!"
    }
  ]

  dialogueSystem.start(script, () => {
    showMiraculousChallenge()
  })
}

function showMiraculousChallenge() {
  const challengeModal = document.createElement('div')
  challengeModal.className = 'aurora-modal-backdrop'
  challengeModal.innerHTML = `
    <div class="aurora-challenge-card" id="challenge-step-1">
      <div class="challenge-header">
        <span class="challenge-badge">🐾 Cat Noir Emergency! 🐾</span>
        <h2>What does Plagg need to recharge?</h2>
        <p class="challenge-prompt">Cat Noir is about to detransform! Pick the only snack that will power Plagg up:</p>
      </div>

      <div class="snack-options">
        <button class="snack-btn" data-correct="false">
          <span class="snack-emoji">🥐</span>
          <span class="snack-name">Butter Croissant</span>
        </button>
        <button class="snack-btn" data-correct="true">
          <span class="snack-emoji">🧀</span>
          <span class="snack-name">Stinky Camembert Cheese</span>
        </button>
        <button class="snack-btn" data-correct="false">
          <span class="snack-emoji">🥖</span>
          <span class="snack-name">French Baguette</span>
        </button>
        <button class="snack-btn" data-correct="false">
          <span class="snack-emoji">🥗</span>
          <span class="snack-name">Healthy Green Salad</span>
        </button>
      </div>

      <div class="challenge-feedback" id="snack-feedback"></div>
    </div>
  `
  document.body.appendChild(challengeModal)

  const buttons = challengeModal.querySelectorAll('.snack-btn')
  const feedback = document.getElementById('snack-feedback')

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const isCorrect = btn.getAttribute('data-correct') === 'true'
      if (isCorrect) {
        btn.classList.add('btn-correct')
        feedback.innerHTML = `
          <p class="feedback-success">
            <strong>"CAMEMBERT!! MY DELICIOUS LOVE!"</strong> — Plagg<br>
            Cat Noir recharged: "Claws Out! Ready to roll, Tiya!"
          </p>
        `
        setTimeout(() => {
          showAkumaCatchStep(challengeModal)
        }, 1600)
      } else {
        btn.classList.add('btn-wrong')
        feedback.innerHTML = `<p class="feedback-error">Plagg: "Ew, gross! That's not Camembert! Try again, Tiya!"</p>`
      }
    })
  })
}

function showAkumaCatchStep(modal) {
  modal.innerHTML = `
    <div class="aurora-challenge-card" id="challenge-step-2">
      <div class="challenge-header">
        <span class="challenge-badge ladybug-badge">🐞 Lucky Charm Purify! 🐞</span>
        <h2>Catch the Akuma with Ladybug's Yo-Yo!</h2>
        <p class="challenge-prompt">Click the fluttering shadow butterfly to de-evilize it!</p>
      </div>

      <div class="akuma-arena" id="akuma-arena">
        <div class="akuma-target" id="akuma-target">
          <span class="akuma-icon">🦋</span>
        </div>
      </div>
    </div>
  `

  const akuma = document.getElementById('akuma-target')
  let caught = false

  function flutter() {
    if (caught) return
    const x = (Math.random() - 0.5) * 260
    const y = (Math.random() - 0.5) * 150
    gsap.to(akuma, {
      x: x,
      y: y,
      duration: 1.1,
      ease: 'power1.inOut',
      onComplete: flutter
    })
  }
  flutter()

  akuma.addEventListener('click', () => {
    if (caught) return
    caught = true
    akuma.querySelector('.akuma-icon').textContent = '✨ 🦋 ✨'

    const cleanseFlash = document.createElement('div')
    cleanseFlash.className = 'miraculous-cleanse-wave'
    cleanseFlash.innerHTML = `
      <div class="cleanse-text">
        <h1>MIRACULOUS LADYBUG!</h1>
        <p>🐞 "Bye-bye, little butterfly!" 🐞</p>
      </div>
    `
    document.body.appendChild(cleanseFlash)

    setTimeout(() => {
      cleanseFlash.classList.add('cleanse-active')
    }, 40)

    setTimeout(() => {
      cleanseFlash.classList.remove('cleanse-active')
      setTimeout(() => cleanseFlash.remove(), 700)
      modal.remove()

      showMiraculousRewardModal()
    }, 2600)
  })
}

function showMiraculousRewardModal() {
  const modal = document.createElement('div')
  modal.className = 'aurora-modal-backdrop'
  modal.innerHTML = `
    <div class="aurora-gift-card">
      <div class="gift-sparkles">🐞 🐾 ✨ 🐾 🐞</div>
      <h2 class="gift-title">Pound It! 👊 Happy Birthday Tiya!</h2>

      <div class="plushie-showcase">
        <div class="plushie-art">
          <span class="plush-chibi ladybug-tag">🐞 Ladybug</span>
          <span class="plush-heart">❤️</span>
          <span class="plush-chibi catnoir-tag">🐾 Cat Noir</span>
        </div>
        <p class="plushie-name">Miraculous Duo Lucky Charm</p>
        <p class="plushie-desc">
          A pair of handcrafted Parisian superhero charms with Tikki and Plagg! 
          Infused with endless good luck, heroic courage, and Cat Noir's corniest jokes. 
          Presented with love to Tiya on her special birthday!
        </p>
      </div>

      <div class="fragment-reward">
        <div class="fragment-icon">✦</div>
        <div class="fragment-info">
          <strong>Star Fragment #2: Lucky Spark</strong>
          <span>Purified and charged by the magic of Paris! 2 Star Fragments secured!</span>
        </div>
      </div>

      <button id="claim-miraculous-btn" class="aurora-action-btn miraculous-btn">
        Accept Souvenir & Star Fragment #2
      </button>
    </div>
  `
  document.body.appendChild(modal)

  gsap.fromTo(
    '.aurora-gift-card',
    { scale: 0.8, opacity: 0, y: 20 },
    { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
  )

  document.getElementById('claim-miraculous-btn').addEventListener('click', () => {
    gameState.addInventoryItem({
      id: 'miraculous_duo_charm',
      name: 'Miraculous Duo Lucky Charm',
      description: 'Tikki & Plagg lucky superhero charms celebrating Tiya.'
    })

    gameState.addStarFragment({
      id: 'fragment_2',
      name: 'Lucky Spark',
      world: 'Miraculous Paris'
    })

    gsap.to('.aurora-gift-card', {
      scale: 0.85,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.in',
      onComplete: () => {
        modal.remove()
        showPlanetThreeRiddleModal()
      }
    })
  })
}

function showPlanetThreeRiddleModal() {
  const riddleModal = document.createElement('div')
  riddleModal.className = 'aurora-modal-backdrop'
  riddleModal.innerHTML = `
    <div class="aurora-riddle-card">
      <div class="riddle-header">
        <span class="riddle-tag">✦ Clue For Tiya ✦</span>
        <h2>Riddle of Planet 3</h2>
      </div>

      <div class="riddle-scroll">
        <p class="riddle-verse">
          Pound it, Tiya! Paris is saved and shining bright with cheer,<br>
          Two star fragments collected as the Final Star draws near!<br><br>
          Where will the celestial currents guide your ship next time?<br>
          What legendary heroes will await your birthday climb?<br><br>
          Keep your courage burning, Tiya, your journey is pure art—<br>
          Every fragment gathered brings you closer to the heart!
        </p>
      </div>

      <div class="riddle-dialogue-signoff">
        <span class="signoff-quote">"Stay miraculous, Tiya! Pound it! 👊"</span>
        <span>— Ladybug & Cat Noir</span>
      </div>

      <button id="next-realm-btn" class="aurora-action-btn miraculous-btn">
        Set Course For Planet 3 ➔
      </button>
    </div>
  `
  document.body.appendChild(riddleModal)

  gsap.fromTo(
    '.aurora-riddle-card',
    { scale: 0.8, opacity: 0, y: 20 },
    { scale: 1, opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
  )

  document.getElementById('next-realm-btn').addEventListener('click', () => {
    gsap.to('.aurora-riddle-card', {
      scale: 0.85,
      opacity: 0,
      duration: 0.4,
      onComplete: () => {
        riddleModal.remove()
        gameState.showFloatingNotice("🌟 Planet 2 Complete! 2 Star Fragments collected by Tiya!")

        if (typeof window.startTravelToUniverseThree === 'function') {
          window.startTravelToUniverseThree()
        }
      }
    })
  })
}
