// ========================================
// PROJECT AURORA - UNIVERSE 2: MIRACULOUS PARIS
// Featuring: Ladybug & Cat Noir welcoming TIYA
// ========================================

import * as THREE from 'three'
import gsap from 'gsap'
import { dialogueSystem } from '../systems/dialogue.js'
import { gameState } from '../systems/state.js'

let universeTwoGroup = null
let parisSparkles = null
let akumaButterfly = null
let isInitialized = false

export function initUniverseTwo({ scene, camera, renderer }) {
  if (isInitialized) return
  isInitialized = true

  // 1. Atmosphere Flash Transition
  const flashOverlay = document.createElement('div')
  flashOverlay.className = 'celestial-flash miraculous-flash'
  document.body.appendChild(flashOverlay)

  // Zoom camera into Planet 2
  gsap.to(camera.position, {
    z: -79.2,
    duration: 2.2,
    ease: 'power2.in',
    onComplete: () => {
      flashOverlay.classList.add('flash-active')

      setTimeout(() => {
        buildParisRooftopScene(scene)

        // Position camera on the Parisian rooftop facing Ladybug, Cat Noir, and the Eiffel Tower
        camera.position.set(0, 2.4, -69)
        camera.lookAt(0, 2.6, -82)

        flashOverlay.classList.remove('flash-active')
        setTimeout(() => flashOverlay.remove(), 1200)

        // Begin dialogue sequence
        startMiraculousDialogue()
      }, 500)
    }
  })
}

function buildParisRooftopScene(scene) {
  universeTwoGroup = new THREE.Group()
  universeTwoGroup.position.set(0, 0, -80)

  // 1. Parisian Rooftop (Slanted Slate Roof)
  const roofGeo = new THREE.BoxGeometry(24, 1.2, 16)
  const roofMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b, // Zinc blue slate roof
    roughness: 0.65,
    metalness: 0.2
  })
  const roof = new THREE.Mesh(roofGeo, roofMat)
  roof.position.set(0, 0, 0)
  universeTwoGroup.add(roof)

  // Chimney stacks (Classic Parisian Terracotta Chimneys)
  const chimneyMat = new THREE.MeshStandardMaterial({
    color: 0xb45309,
    roughness: 0.8
  })
  for (let x = -7; x <= 7; x += 3.5) {
    const chimney = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.8, 0.7), chimneyMat)
    chimney.position.set(x, 1.4, -4.5)
    universeTwoGroup.add(chimney)

    // Clay pots on top
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.25, 0.6, 12), chimneyMat)
    pot.position.set(x, 2.5, -4.5)
    universeTwoGroup.add(pot)
  }

  // 2. Glowing Eiffel Tower in the Twilight Horizon
  const eiffelGroup = new THREE.Group()
  eiffelGroup.position.set(0, 0, -18)

  const eiffelMat = new THREE.MeshBasicMaterial({
    color: 0xfef08a,
    transparent: true,
    opacity: 0.85
  })

  // Lower Arch & Legs
  const leg1 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.5, 6, 8), eiffelMat)
  leg1.position.set(-2.2, 3, 0)
  leg1.rotation.z = -0.18
  const leg2 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.5, 6, 8), eiffelMat)
  leg2.position.set(2.2, 3, 0)
  leg2.rotation.z = 0.18

  // First & Second Platform
  const plat1 = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.4, 1.5), eiffelMat)
  plat1.position.set(0, 5.8, 0)
  const plat2 = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.35, 1.2), eiffelMat)
  plat2.position.set(0, 9.2, 0)

  // Upper Tower & Spire
  const midTower = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 1.3, 5, 8), eiffelMat)
  midTower.position.set(0, 8.2, 0)
  const spire = new THREE.Mesh(new THREE.ConeGeometry(0.4, 7, 8), eiffelMat)
  spire.position.set(0, 13.5, 0)

  // Beacon Light on Spire Tip
  const beaconGeo = new THREE.SphereGeometry(0.35, 16, 16)
  const beaconMat = new THREE.MeshBasicMaterial({ color: 0xffffff })
  const beacon = new THREE.Mesh(beaconGeo, beaconMat)
  beacon.position.set(0, 17, 0)

  eiffelGroup.add(leg1, leg2, plat1, midTower, plat2, spire, beacon)
  universeTwoGroup.add(eiffelGroup)

  // Eiffel Tower Beacon Rotating Light
  const beaconLight = new THREE.SpotLight(0xfef08a, 4, 30, Math.PI / 6, 0.5)
  beaconLight.position.set(0, 17, -18)
  beaconLight.target.position.set(10, 8, -5)
  universeTwoGroup.add(beaconLight)
  universeTwoGroup.add(beaconLight.target)

  // 3. Magical Sparkles (Pink Ladybug & Green Cat Noir glimmers)
  const sparkleCount = 220
  const sparkleGeo = new THREE.BufferGeometry()
  const sparklePos = new Float32Array(sparkleCount * 3)
  const sparkleColors = new Float32Array(sparkleCount * 3)

  for (let i = 0; i < sparkleCount * 3; i += 3) {
    sparklePos[i] = (Math.random() - 0.5) * 22
    sparklePos[i + 1] = Math.random() * 9 + 0.5
    sparklePos[i + 2] = (Math.random() - 0.5) * 22

    // Alternate pink (#ec4899) and green (#22c55e)
    if (i % 2 === 0) {
      sparkleColors[i] = 0.95
      sparkleColors[i + 1] = 0.28
      sparkleColors[i + 2] = 0.6
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

  // 4. In-World 3D Standees (Ladybug & Cat Noir)
  const textureLoader = new THREE.TextureLoader()

  const ladybugTex = textureLoader.load('/characters/ladybug.jpg')
  const ladybugMat = new THREE.MeshBasicMaterial({ map: ladybugTex, transparent: true, opacity: 0.95 })
  const ladybugPlane = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 2.3), ladybugMat)
  ladybugPlane.position.set(-1.1, 2, -2)
  universeTwoGroup.add(ladybugPlane)

  const catNoirTex = textureLoader.load('/characters/cat_noir.jpg')
  const catNoirMat = new THREE.MeshBasicMaterial({ map: catNoirTex, transparent: true, opacity: 0.95 })
  const catNoirPlane = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 2.3), catNoirMat)
  catNoirPlane.position.set(1.1, 2, -2)
  universeTwoGroup.add(catNoirPlane)

  // Parisian Twilight Ambient & Neon Rim Lights
  const parisAmbient = new THREE.AmbientLight(0x1e1b4b, 1.4)
  universeTwoGroup.add(parisAmbient)

  const ladybugLight = new THREE.PointLight(0xef4444, 2.2, 15)
  ladybugLight.position.set(-2, 2.5, -1)
  universeTwoGroup.add(ladybugLight)

  const catLight = new THREE.PointLight(0x22c55e, 2.2, 15)
  catLight.position.set(2, 2.5, -1)
  universeTwoGroup.add(catLight)

  scene.add(universeTwoGroup)

  universeTwoGroup.scale.set(0.1, 0.1, 0.1)
  gsap.to(universeTwoGroup.scale, {
    x: 1,
    y: 1,
    z: 1,
    duration: 1.8,
    ease: 'power3.out'
  })
}

export function updateUniverseTwo() {
  if (parisSparkles && parisSparkles.geometry) {
    const pos = parisSparkles.geometry.attributes.position.array
    for (let i = 1; i < pos.length; i += 3) {
      pos[i] += 0.009
      if (pos[i] > 9) pos[i] = 0.5
    }
    parisSparkles.geometry.attributes.position.needsUpdate = true
    parisSparkles.rotation.y += 0.0007
  }
}

function startMiraculousDialogue() {
  const script = [
    {
      speaker: 'Cat Noir',
      universe: 'Miraculous Paris',
      text: "Well, well, well! Look what the cat dragged in! Or should I say... who just made a paws-itively miraculous entrance?"
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
    // Launch interactive mini-game!
    showMiraculousChallenge()
  })
}

// ========================================
// INTERACTIVE MINI-GAME: PLAGG SNACK & AKUMA PURIFY
// ========================================

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
            <em>Cat Noir recharged: "Claws Out! Ready to roll, Tiya!"</em>
          </p>
        `
        setTimeout(() => {
          showAkumaCatchStep(challengeModal)
        }, 1800)
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
          <span class="akuma-glow"></span>
        </div>
      </div>
    </div>
  `

  const akuma = document.getElementById('akuma-target')
  let caught = false

  // Animate akuma fluttering around arena
  function flutter() {
    if (caught) return
    const x = (Math.random() - 0.5) * 260
    const y = (Math.random() - 0.5) * 160
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
    akuma.classList.add('purified')
    akuma.querySelector('.akuma-icon').textContent = '✨ 🦋 ✨'

    // Full Miraculous Cleansing wave
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
    }, 50)

    setTimeout(() => {
      cleanseFlash.classList.remove('cleanse-active')
      setTimeout(() => cleanseFlash.remove(), 800)
      modal.remove()

      // Show Victory & Star Fragment #2 Reward Modal!
      showMiraculousRewardModal()
    }, 2800)
  })
}

function showMiraculousRewardModal() {
  const modal = document.createElement('div')
  modal.className = 'aurora-modal-backdrop'
  modal.innerHTML = `
    <div class="aurora-gift-card miraculous-reward-card">
      <div class="gift-sparkles">🐞 🐾 ✨ 🐾 🐞</div>
      <h2 class="gift-title">Pound It! 👊 Happy Birthday Tiya!</h2>

      <div class="plushie-showcase miraculous-showcase">
        <div class="plushie-art">
          <span class="plush-chibi ladybug-tag">🐞 Ladybug</span>
          <span class="plush-heart">❤️</span>
          <span class="plush-chibi catnoir-tag">🐾 Cat Noir</span>
        </div>
        <p class="plushie-name">Miraculous Duo Lucky Charm</p>
        <p class="plushie-desc">
          "A pair of handcrafted Parisian superhero charms with Tikki and Plagg! 
          Infused with endless good luck, heroic courage, and Cat Noir's corniest jokes. 
          Presented with love to Tiya on her special birthday!"
        </p>
      </div>

      <div class="fragment-reward miraculous-fragment">
        <div class="fragment-icon">✦</div>
        <div class="fragment-info">
          <strong>Star Fragment #2: Lucky Spark</strong>
          <span>Purified and charged by the magic of Miraculous Paris! 2 Star Fragments secured!</span>
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
    { scale: 0.7, opacity: 0, y: 30 },
    { scale: 1, opacity: 1, y: 0, duration: 0.8, ease: 'back.out(1.7)' }
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
      scale: 0.8,
      opacity: 0,
      duration: 0.5,
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
    <div class="aurora-riddle-card miraculous-riddle">
      <div class="riddle-header">
        <span class="riddle-tag">✦ Clue For Tiya ✦</span>
        <h2>Riddle of Planet 3</h2>
      </div>

      <div class="riddle-scroll">
        <p class="riddle-verse">
          "Pound it, Tiya! Paris is saved and shining bright with cheer,<br>
          Two star fragments collected as the Final Star draws near!<br><br>
          Where will the celestial currents guide your ship next time?<br>
          What legendary heroes will await your birthday climb?<br><br>
          Keep your courage burning, Tiya, your journey is pure art—<br>
          Every fragment gathered brings you closer to the heart!"
        </p>
      </div>

      <div class="riddle-dialogue-signoff">
        <em>"Stay miraculous, Tiya! Pound it! 👊"</em>
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
    { scale: 0.8, opacity: 0, y: 40 },
    { scale: 1, opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }
  )

  document.getElementById('next-realm-btn').addEventListener('click', () => {
    gsap.to('.aurora-riddle-card', {
      scale: 0.8,
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        riddleModal.remove()
        gameState.showFloatingNotice("🌟 Planet 2 Complete! 2/X Star Fragments collected by Tiya!")
      }
    })
  })
}
