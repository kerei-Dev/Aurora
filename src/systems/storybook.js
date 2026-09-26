// ========================================
// PROJECT AURORA - EXPANDED FLUID STORYBOOK ENGINE
// 8 Epic Fandom Realms, Authentic Character Inside Jokes,
// Real Downloadable Keepsakes, and the 3D Aurora Heart Prism Finale.
// ========================================

import { gameState } from './state.js'
import { audioEngine } from './audio.js'

export class StorybookEngine {
  constructor(onChapterChange = null) {
    this.currentChapterIndex = 0
    this.onChapterChange = onChapterChange
    this.isWarping = false
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 }
    this.akumaPurified = false
    this.candlesBlown = false

    this.chapters = [
      {
        id: 'prologue',
        number: 0,
        shortTitle: 'Aurora',
        icon: '✨',
        title: 'Project Aurora',
        subtitle: 'A Celestial Birthday Odyssey for Tiya',
        realmColor: '#ec4899',
        warpColor: 0xec4899
      },
      {
        id: 'palace',
        number: 1,
        shortTitle: 'Palace',
        icon: '🏰',
        title: 'The Sunlit Imperial Terrace',
        subtitle: 'Realm of Thalia & Varkas',
        realmColor: '#f59e0b',
        warpColor: 0xf59e0b,
        background: '/backgrounds/royal_palace.jpg',
        characters: [
          { name: 'Thalia', img: '/characters/thalia.jpg', side: 'left' },
          { name: 'Varkas', img: '/characters/varkas.jpg', side: 'right' }
        ],
        keepsake: {
          id: 'moonstone',
          name: 'The Celestial Moonstone',
          type: 'Gemstone',
          img: '/keepsakes/moonstone.jpg',
          downloadName: 'Tiya_Celestial_Moonstone.jpg',
          tag: 'Imperial Celestial Treasure',
          desc: 'A luminescent moonstone carrying the light of two moons and the protection of the imperial crown. Shimmers with iridescent violet, silver, and azure starlight.'
        },
        dialogues: [
          {
            speaker: 'Thalia',
            avatar: '/characters/thalia.jpg',
            text: 'Tiya! Welcome to the imperial terrace! Varkas insisted we follow formal palace etiquette, but I told him birthdays belong to laughter, not stiff bows!'
          },
          {
            speaker: 'Varkas',
            avatar: '/characters/varkas.jpg',
            text: "She means I tried to stop her from raiding the imperial vault. Happy Birthday, Tiya. You've earned the highest honor of our kingdom today."
          },
          {
            speaker: 'Thalia',
            avatar: '/characters/thalia.jpg',
            text: "Behold: the Imperial Moonstone! It absorbs starlight and wards away doubt. Keep it with you always—you can download its digital essence right now!"
          }
        ]
      },
      {
        id: 'paris',
        number: 2,
        shortTitle: 'Paris',
        icon: '🐞',
        title: 'Twilight Over Paris',
        subtitle: 'Realm of Ladybug & Cat Noir',
        realmColor: '#ef4444',
        warpColor: 0xef4444,
        background: '/backgrounds/paris_scene.jpg',
        characters: [
          { name: 'Ladybug', img: '/characters/ladybug.jpg', side: 'left' },
          { name: 'Cat Noir', img: '/characters/cat_noir.jpg', side: 'right' }
        ],
        keepsake: {
          id: 'ladybug_memory',
          name: "Ladybug's Cherished Paris Memory",
          type: 'Polaroid Photograph',
          img: '/keepsakes/ladybug_memory.jpg',
          downloadName: 'Ladybug_Paris_Memory_For_Tiya.jpg',
          tag: 'Most Beautiful Memory',
          desc: "A vintage Polaroid capturing the iconic rainy twilight in Paris under the umbrella outside school. Inscribed: 'For Tiya — May you always have someone to hold an umbrella over you.'"
        },
        dialogues: [
          {
            speaker: 'Cat Noir',
            avatar: '/characters/cat_noir.jpg',
            text: "Paws and reflect, everyone! Tiya has arrived in Paris! Honestly, Tiya, you're the true superhero today—no cat-astrophes allowed on your birthday!"
          },
          {
            speaker: 'Ladybug',
            avatar: '/characters/ladybug.jpg',
            text: 'Ignore his silly puns, Tiya! Happy Birthday! Hawk Moth took one look at our celebration and decided to take the entire day off.'
          },
          {
            speaker: 'Ladybug',
            avatar: '/characters/ladybug.jpg',
            text: "I wanted to give you my most cherished memory in all of Paris—the day kindness turned into something unforgettable under the rain. Here is the Polaroid for you to keep forever!"
          }
        ]
      },
      {
        id: 'maomao',
        number: 3,
        shortTitle: 'Apothecary',
        icon: '🌿',
        title: 'The Imperial Herbal Pavilion',
        subtitle: 'Realm of Maomao',
        realmColor: '#10b981',
        warpColor: 0x10b981,
        background: '/backgrounds/apothecary_grove.jpg',
        characters: [
          { name: 'Maomao', img: '/characters/maomao.jpg', side: 'center' }
        ],
        keepsake: {
          id: 'qinghao',
          name: 'Handcrafted Qinghao (青蒿) Bundle',
          type: 'Apothecary Medicine & Notes',
          img: '/keepsakes/qinghao_herb.jpg',
          downloadName: 'Maomao_Qinghao_Apothecary_Gift.jpg',
          tag: 'Prepared by Maomao',
          desc: 'Authentic Sweet Wormwood (Artemisia annua) personally gathered, dried, and tied with imperial silk. Revered for centuries for cooling heat, clearing fatigue, and restoring vigor.'
        },
        dialogues: [
          {
            speaker: 'Maomao',
            avatar: '/characters/maomao.jpg',
            text: "Tiya! Most people give gold or shiny trinkets that collect dust, but true care lies in pharmacology! I dried and tied this Qinghao (青蒿 / Artemisia annua) specifically for you."
          },
          {
            speaker: 'Maomao',
            avatar: '/characters/maomao.jpg',
            text: "Sweet wormwood has an ancient medicinal history—it calms inner heat, strengthens immunity, and keeps your mind clear during hard studies! I included my handwritten apothecary dosage note."
          },
          {
            speaker: 'Maomao',
            avatar: '/characters/maomao.jpg',
            text: "(Also... Master Jinshi was literally pacing his courtyard blushing for an hour trying to write you a birthday greeting, but I told him I'd deliver my herbs first!)"
          }
        ]
      },
      {
        id: 'frieren',
        number: 4,
        shortTitle: 'Frieren',
        icon: '📖',
        title: 'The Elven Archives',
        subtitle: 'Realm of Frieren the Mage',
        realmColor: '#38bdf8',
        warpColor: 0x38bdf8,
        background: '/backgrounds/apothecary_grove.jpg',
        characters: [
          { name: 'Frieren', img: '/characters/frieren.jpg', side: 'center' }
        ],
        keepsake: {
          id: 'frieren_grimoire',
          name: "Frieren's Grimoire of Odd Spells",
          type: 'Ancient Spellbook',
          img: '/keepsakes/frieren_grimoire.jpg',
          downloadName: 'Frieren_Grimoire_Of_Odd_Spells.jpg',
          tag: 'Legendary Elven Magic',
          desc: "Contains 4 hyper-specific spells Frieren searched dungeons for: 1. Curatio Tonsilla (cures tonsils/cold in 1 sec); 2. Pluma Cadere (phone slips onto feather pouch); 3. Tacita Reiectio (people know you said 'no' without speaking); 4. Portatio Duplex (teleportation, max 2x/day)."
        },
        dialogues: [
          {
            speaker: 'Frieren',
            avatar: '/characters/frieren.jpg',
            text: '“I found this spell and thought of you.”'
          },
          {
            speaker: 'Frieren',
            avatar: '/characters/frieren.jpg',
            text: "Himmel always said that magic is most wonderful when it solves everyday troubles. So I spent two decades searching ancient dungeons for spells you'd actually use."
          },
          {
            speaker: 'Frieren',
            avatar: '/characters/frieren.jpg',
            text: "Inside this grimoire: how to remove tonsils or a cold in 1 second; a spell so if your phone slips it lands on a feather cushion; how people know you're saying 'no' without saying a word; and yes... a teleportation spell, though the guild limits it to twice a day. Happy birthday, Tiya."
          }
        ]
      },
      {
        id: 'demonslayer',
        number: 5,
        shortTitle: 'Demon Slayer',
        icon: '⚔️',
        title: 'Mount Wisteria Haven',
        subtitle: 'Tanjiro, Nezuko & Giyu',
        realmColor: '#06b6d4',
        warpColor: 0x06b6d4,
        background: '/backgrounds/wisteria_forest.jpg',
        characters: [
          { name: 'Tanjiro & Nezuko & Giyu', img: '/characters/demon_slayer_trio.jpg', side: 'center' }
        ],
        keepsake: {
          id: 'demon_slayer_charm',
          name: 'The Kamado Warding Cedar Charm',
          type: 'Handcarved Talisman',
          img: '/keepsakes/demon_slayer_charm.jpg',
          downloadName: 'Kamado_Warding_Wooden_Charm.jpg',
          tag: 'Handmade by Tanjiro & Giyu',
          desc: 'A hand-carved cedar wood omamori talisman engraved with flowing water breathing ripples and wisteria blossoms, tied with a braided scarlet silk cord. Blessed for safety and joy.'
        },
        dialogues: [
          {
            speaker: 'Tanjiro',
            avatar: '/characters/demon_slayer_trio.jpg',
            text: "Tiya-san! Happy Birthday!! Nezuko hasn't stopped jumping around since this morning because she was so excited to meet you!"
          },
          {
            speaker: 'Nezuko',
            avatar: '/characters/demon_slayer_trio.jpg',
            text: "Mmh-mmh! *claps hands excitedly and hands Tiya a bunch of fresh wisteria flowers*"
          },
          {
            speaker: 'Giyu',
            avatar: '/characters/demon_slayer_trio.jpg',
            text: "...I carved this wooden talisman myself. Tanjiro insisted on adding the water ripples. And before anyone asks... I am not being anti-social today. Happy birthday, Tiya."
          }
        ]
      },
      {
        id: 'forgers',
        number: 6,
        shortTitle: 'Forgers',
        icon: '🥜',
        title: 'The Forger Residence',
        subtitle: 'Loid, Yor & Anya',
        realmColor: '#f97316',
        warpColor: 0xf97316,
        background: '/backgrounds/forger_home.jpg',
        characters: [
          { name: 'The Forger Family', img: '/characters/forger_family.jpg', side: 'center' }
        ],
        keepsake: {
          id: 'forger_family_photo',
          name: 'The Chaotic Forger Family Photo',
          type: 'Framed Family Portrait',
          img: '/keepsakes/forger_family_photo.jpg',
          downloadName: 'Forger_Family_Chaotic_Birthday_Photo.jpg',
          tag: 'Operation Birthday Joy',
          desc: "The authentic photograph of the Forgers' attempt at a dignified birthday present: Loid facepalming with tea, Yor nervously snapping the arm of the chair, Anya making her legendary smug face, and Bond snoozing peacefully."
        },
        dialogues: [
          {
            speaker: 'Loid',
            avatar: '/characters/forger_family.jpg',
            text: "(Code Name Twilight: Mission objective is to deliver a perfectly dignified, heartfelt family birthday present without blowing our cover...)"
          },
          {
            speaker: 'Yor',
            avatar: '/characters/forger_family.jpg',
            text: "Tiya-san, Happy Birthday! I tried to adjust the chair for the family portrait so it looked formal, and... oh dear, I accidentally snapped the wooden leg in half!"
          },
          {
            speaker: 'Anya',
            avatar: '/characters/forger_family.jpg',
            text: "Heh. Anya's gift is this super cool family photo! Father said to look serious, but Anya did the best face! Happy Birthday, Tiya! Peanuts for you!"
          }
        ]
      },
      {
        id: 'koyuki',
        number: 7,
        shortTitle: 'Koyuki',
        icon: '❄️',
        title: 'Rampart of Ice',
        subtitle: 'Realm of Koyuki (Koori no Jouheki)',
        realmColor: '#93c5fd',
        warpColor: 0x93c5fd,
        background: '/backgrounds/koyuki_winter.jpg',
        characters: [
          { name: 'Koyuki', img: '/characters/koyuki.jpg', side: 'center' }
        ],
        keepsake: {
          id: 'koyuki_letter',
          name: "Koyuki's Letter & Knitted Penguin Charm",
          type: 'Handwritten Letter & Charm',
          img: '/keepsakes/koyuki_letter.jpg',
          downloadName: 'Koyuki_Handwritten_Letter_And_Charm.jpg',
          tag: 'Quiet Sincerity',
          desc: "A warm handwritten letter on textured Japanese stationery beside a tiny hand-knitted wool penguin keychain. Pure comfort for the quiet moments."
        },
        dialogues: [
          {
            speaker: 'Koyuki',
            avatar: '/characters/koyuki.jpg',
            text: "“I’m not very good at saying things like this… But I’m glad you’re here.”"
          },
          {
            speaker: 'Koyuki',
            avatar: '/characters/koyuki.jpg',
            text: "“So, for today, you’re allowed to forget about everything else and just enjoy yourself. Happy birthday.”"
          },
          {
            speaker: 'Koyuki',
            avatar: '/characters/koyuki.jpg',
            text: "“And… don’t get the wrong idea. I’m only saying this because it’s your birthday.” *looks away shyly* “I knitted this little penguin keychain for your bag. You can keep this letter too.”"
          }
        ]
      },
      {
        id: 'eras',
        number: 8,
        shortTitle: 'Eras Tour',
        icon: '💜',
        title: 'The Eras Melody Realm',
        subtitle: 'Realm of Taylor Swift',
        realmColor: '#c084fc',
        warpColor: 0xc084fc,
        background: '/backgrounds/eras_stage.jpg',
        characters: [
          { name: 'Taylor Swift', img: '/characters/taylor_swift.jpg', side: 'center' }
        ],
        keepsake: {
          id: 'taylor_note',
          name: "Taylor's 21st Birthday & Semester Note",
          type: 'Handwritten Songwriting Page',
          img: '/keepsakes/taylor_note.jpg',
          downloadName: 'Taylor_Swift_21st_Birthday_Semester_Note.jpg',
          tag: 'Turning 21 & Semester Exam Triumph',
          desc: "An authentic songwriting journal page handwritten for Tiya: 'To Tiya on turning 21 — May your year sparkle with wild magic and your semester exams be filled with triumph! Long live the starlight in your eyes. With love ♡' with a star guitar pick and acoustic lullaby."
        },
        dialogues: [
          {
            speaker: 'Taylor Swift',
            avatar: '/characters/taylor_swift.jpg',
            text: "♪ 'Can I go where you go? Can we always be this close forever and ever...' ♪"
          },
          {
            speaker: 'Taylor Swift',
            avatar: '/characters/taylor_swift.jpg',
            text: "Happy 21st Birthday, Tiya!! 21 is such a monumental, golden milestone year. You're growing into someone so brilliant and strong!"
          },
          {
            speaker: 'Taylor Swift',
            avatar: '/characters/taylor_swift.jpg',
            text: "I wrote you this handwritten journal page right on my guitar with wishes for your 21st year and good luck for your semester exams! Plus, you can play and download my acoustic 'Lover' lullaby anytime! 💖"
          }
        ]
      },
      {
        id: 'finale',
        number: 9,
        shortTitle: 'Birthday Star',
        icon: '⭐',
        title: 'The Celestial Birthday Star',
        subtitle: 'All 11 Heroes Reunited for Tiya',
        realmColor: '#fbbf24',
        warpColor: 0xfbbf24
      }
    ]

    this.initDOM()
    this.initParallax()
  }

  initDOM() {
    let container = document.getElementById('storybook-container')
    if (!container) {
      container = document.createElement('div')
      container.id = 'storybook-container'
      container.className = 'storybook-viewport'
      document.body.appendChild(container)
    }
    this.container = container

    this.renderNavigationRibbon()
    this.goToChapter(0, false)
  }

  renderNavigationRibbon() {
    let ribbon = document.getElementById('cosmic-ribbon')
    if (!ribbon) {
      ribbon = document.createElement('header')
      ribbon.id = 'cosmic-ribbon'
      ribbon.className = 'cosmic-ribbon'
      document.body.appendChild(ribbon)
    }

    const collectedCount = gameState.inventory.length

    ribbon.innerHTML = `
      <div class="ribbon-brand">
        <span class="ribbon-sparkle">✦</span>
        <span class="ribbon-title">Project Aurora</span>
      </div>

      <nav class="ribbon-chapters" id="ribbon-tabs">
        ${this.chapters.map((ch, idx) => `
          <button class="ribbon-tab ${idx === this.currentChapterIndex ? 'active' : ''}" data-index="${idx}" title="${ch.title}">
            <span class="tab-icon">${ch.icon}</span>
            <span class="tab-label">${ch.shortTitle}</span>
          </button>
        `).join('')}
      </nav>

      <div class="ribbon-constellation">
        <div class="constellation-counter" title="Souvenirs Collected">
          <span class="counter-icon">🎁</span>
          <span class="counter-text" id="ribbon-keepsake-count">${collectedCount}/8</span>
        </div>
        <button id="sound-toggle-btn" class="ribbon-sound-btn" title="Toggle Sound">🔊</button>
      </div>
    `

    // Tab click listeners
    ribbon.querySelectorAll('.ribbon-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-index'), 10)
        audioEngine.playChime(659.25, 0.4)
        this.goToChapter(idx)
      })
    })

    // Sound toggle
    const soundBtn = document.getElementById('sound-toggle-btn')
    soundBtn.addEventListener('click', () => {
      const isMuted = audioEngine.toggleMute()
      soundBtn.textContent = isMuted ? '🔇' : '🔊'
      soundBtn.classList.toggle('muted', isMuted)
    })
  }

  updateRibbonActive() {
    const tabs = document.querySelectorAll('.ribbon-tab')
    tabs.forEach((tab, idx) => {
      tab.classList.toggle('active', idx === this.currentChapterIndex)
    })

    const countEl = document.getElementById('ribbon-keepsake-count')
    if (countEl) countEl.textContent = `${gameState.inventory.length}/8`
  }

  initParallax() {
    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2
      this.mouse.targetY = (e.clientY / window.innerHeight - 0.5) * 2
    })

    const updateParallax = () => {
      this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.08
      this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.08

      const stage = document.querySelector('.living-stage')
      if (stage) {
        stage.style.setProperty('--px', this.mouse.x)
        stage.style.setProperty('--py', this.mouse.y)
      }

      requestAnimationFrame(updateParallax)
    }
    requestAnimationFrame(updateParallax)

    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' && this.currentChapterIndex < this.chapters.length - 1) {
        this.goToChapter(this.currentChapterIndex + 1)
      } else if (e.key === 'ArrowLeft' && this.currentChapterIndex > 0) {
        this.goToChapter(this.currentChapterIndex - 1)
      }
    })
  }

  goToChapter(index, playWarp = true) {
    if (this.isWarping && playWarp) return
    this.currentChapterIndex = Math.max(0, Math.min(index, this.chapters.length - 1))
    this.updateRibbonActive()

    const ch = this.chapters[this.currentChapterIndex]

    if (this.onChapterChange && playWarp) {
      this.isWarping = true
      this.onChapterChange(ch)
      setTimeout(() => {
        this.renderChapter(ch)
        this.isWarping = false
      }, 400)
    } else {
      this.renderChapter(ch)
      if (this.onChapterChange) this.onChapterChange(ch)
    }
  }

  renderChapter(ch) {
    this.container.classList.add('fading')

    setTimeout(() => {
      if (ch.id === 'prologue') {
        this.renderPrologue(ch)
      } else if (ch.id === 'finale') {
        this.renderFinale(ch)
      } else {
        this.renderStandardRealm(ch)
      }
      this.container.classList.remove('fading')
    }, 200)
  }

  renderPrologue(ch) {
    this.container.innerHTML = `
      <div class="prologue-screen">
        <div class="prologue-glow-ring"></div>
        <div class="prologue-content">
          <span class="prologue-badge">✦ HAPPY 21ST BIRTHDAY TIYA ✦</span>
          <h1 class="prologue-title">PROJECT AURORA</h1>
          <p class="prologue-subtitle">A bespoke cosmic journey woven across the stories, melodies, and worlds you cherish.</p>
          
          <div class="prologue-preview-constellation">
            <span class="preview-item">🏰 Palace</span>
            <span class="preview-dot">•</span>
            <span class="preview-item">🐞 Paris</span>
            <span class="preview-dot">•</span>
            <span class="preview-item">🌿 Maomao</span>
            <span class="preview-dot">•</span>
            <span class="preview-item">📖 Frieren</span>
            <span class="preview-dot">•</span>
            <span class="preview-item">⚔️ Demon Slayer</span>
            <span class="preview-dot">•</span>
            <span class="preview-item">🥜 Forgers</span>
            <span class="preview-dot">•</span>
            <span class="preview-item">❄️ Koyuki</span>
            <span class="preview-dot">•</span>
            <span class="preview-item">💜 Eras Tour</span>
          </div>

          <button id="begin-journey-btn" class="aurora-glow-btn">
            Begin The Journey ✦
          </button>
        </div>
      </div>
    `

    document.getElementById('begin-journey-btn').addEventListener('click', () => {
      audioEngine.playSparkleFanfare()
      this.goToChapter(1)
    })
  }

  renderStandardRealm(ch) {
    const isCollected = gameState.inventory.some(item => item.id === ch.keepsake?.id)

    this.container.innerHTML = `
      <div class="living-stage" data-realm="${ch.id}">
        <!-- Parallax Background Layer -->
        <div class="parallax-bg-layer" style="background-image: url('${ch.background}')">
          <div class="stage-scenic-overlay" style="--realm-glow: ${ch.realmColor}"></div>
        </div>

        <!-- Atmospheric Particles Layer -->
        <div class="parallax-particles-layer">
          ${this.generateParticles(ch.id)}
        </div>

        <!-- Main Living Content Spread -->
        <div class="realm-layout">
          <!-- Realm Header Info -->
          <div class="realm-header">
            <div class="realm-meta">
              <span class="realm-badge" style="border-color: ${ch.realmColor}; color: ${ch.realmColor}">
                REALM ${ch.number} OF 8
              </span>
              <h2 class="realm-title">${ch.title}</h2>
              <p class="realm-subtitle">${ch.subtitle}</p>
            </div>

            <!-- Inspect / Claim Keepsake Pill -->
            <div class="realm-fragment-anchor">
              <button class="fragment-crystal ${isCollected ? 'collected' : ''}" id="open-keepsake-btn" title="Inspect & Download Keepsake">
                <span class="crystal-icon">🎁</span>
                <span class="crystal-label">${isCollected ? 'Keepsake Claimed ✓' : 'Inspect Gift & Download ⬇'}</span>
              </button>
            </div>
          </div>

          <!-- Character Illustration & Dialogue Centerpiece -->
          <div class="realm-showcase">
            <div class="characters-row">
              ${ch.characters.map((char, i) => `
                <div class="character-card card-${char.side}" style="--char-index: ${i}">
                  <div class="card-frame ${ch.characters.length === 1 ? 'large-frame' : ''}">
                    <img src="${char.img}" alt="${char.name}" class="char-portrait" />
                    <div class="char-aura" style="--glow: ${ch.realmColor}"></div>
                  </div>
                  <span class="char-nameplate">${char.name}</span>
                </div>
              `).join('')}
            </div>

            <!-- Story Speech Cards -->
            <div class="realm-dialogues-stream">
              ${ch.dialogues.map((d, idx) => `
                <div class="speech-bubble" style="--delay: ${idx * 0.12}s">
                  <div class="speech-avatar-frame">
                    <img src="${d.avatar}" alt="${d.speaker}" class="speech-avatar" />
                  </div>
                  <div class="speech-body">
                    <div class="speech-speaker">${d.speaker}</div>
                    <div class="speech-text">${d.text}</div>
                  </div>
                </div>
              `).join('')}

              <!-- Special Interactive Widget (Paris Akuma / Eras Vinyl) -->
              ${this.renderSpecialInteractiveWidget(ch)}
            </div>
          </div>

          <!-- Bottom Navigation Bar -->
          <div class="realm-nav-bar">
            <button class="nav-arrow-btn prev-btn" id="prev-realm-btn">
              ◀ Previous
            </button>
            <div class="nav-realm-hint">
              Use arrow keys or click next to glide through space
            </div>
            <button class="nav-arrow-btn next-btn" id="next-realm-btn" style="background: linear-gradient(135deg, ${ch.realmColor}, #ec4899);">
              ${ch.number === 8 ? 'Advance to The Final Star ⭐' : 'Next Realm ▶'}
            </button>
          </div>
        </div>
      </div>
    `

    this.attachStandardRealmListeners(ch)
  }

  generateParticles(realmId) {
    if (realmId === 'palace') {
      return Array.from({ length: 14 }).map(() =>
        `<span class="particle" style="--left: ${Math.random() * 100}%; --delay: ${Math.random() * 5}s; --duration: ${6 + Math.random() * 6}s">🌸</span>`
      ).join('')
    } else if (realmId === 'paris') {
      return Array.from({ length: 12 }).map(() =>
        `<span class="particle" style="--left: ${Math.random() * 100}%; --delay: ${Math.random() * 4}s; --duration: ${5 + Math.random() * 5}s">✨</span>`
      ).join('')
    } else if (realmId === 'maomao') {
      return Array.from({ length: 16 }).map(() =>
        `<span class="particle" style="--left: ${Math.random() * 100}%; --delay: ${Math.random() * 6}s; --duration: ${7 + Math.random() * 5}s">🌿</span>`
      ).join('')
    } else if (realmId === 'frieren') {
      return Array.from({ length: 14 }).map(() =>
        `<span class="particle" style="--left: ${Math.random() * 100}%; --delay: ${Math.random() * 5}s; --duration: ${6 + Math.random() * 6}s">📜</span>`
      ).join('')
    } else if (realmId === 'demonslayer') {
      return Array.from({ length: 16 }).map(() =>
        `<span class="particle" style="--left: ${Math.random() * 100}%; --delay: ${Math.random() * 5}s; --duration: ${6 + Math.random() * 5}s">🪻</span>`
      ).join('')
    } else if (realmId === 'forgers') {
      return Array.from({ length: 12 }).map(() =>
        `<span class="particle" style="--left: ${Math.random() * 100}%; --delay: ${Math.random() * 4}s; --duration: ${5 + Math.random() * 5}s">🥜</span>`
      ).join('')
    } else if (realmId === 'koyuki') {
      return Array.from({ length: 20 }).map(() =>
        `<span class="particle" style="--left: ${Math.random() * 100}%; --delay: ${Math.random() * 5}s; --duration: ${4 + Math.random() * 6}s">❄️</span>`
      ).join('')
    } else if (realmId === 'eras') {
      return Array.from({ length: 14 }).map(() =>
        `<span class="particle" style="--left: ${Math.random() * 100}%; --delay: ${Math.random() * 5}s; --duration: ${6 + Math.random() * 6}s">🎶</span>`
      ).join('')
    }
    return ''
  }

  renderSpecialInteractiveWidget(ch) {
    if (ch.id === 'paris') {
      return `
        <div class="interactive-paris-box ${this.akumaPurified ? 'cleansed' : ''}" id="akuma-interactive">
          <div class="akuma-butterfly" id="akuma-butterfly-btn" title="Click to purify!">
            ${this.akumaPurified ? '🕊️' : '🦋'}
          </div>
          <div class="akuma-text-block">
            <strong>${this.akumaPurified ? 'Akuma Purified!' : 'Stray Akuma Spotted!'}</strong>
            <p>${this.akumaPurified ? 'Pure starlight restored to Paris. "Miraculous Ladybug!"' : 'Click the purple butterfly to purify it with miraculous starlight!'}</p>
          </div>
        </div>
      `
    } else if (ch.id === 'eras') {
      return `
        <div class="vinyl-player-card" id="vinyl-widget">
          <div class="vinyl-disc-wrapper" id="vinyl-disc">
            <div class="vinyl-disc">
              <div class="vinyl-center-label">
                <span>LOVER</span>
              </div>
            </div>
            <div class="vinyl-needle"></div>
          </div>

          <div class="vinyl-controls">
            <div class="vinyl-meta">
              <span class="vinyl-track">"Lover" (Taylor's Acoustic Lullaby)</span>
              <span class="vinyl-status" id="vinyl-status">Dedicated to Tiya 💖</span>
            </div>
            <div class="vinyl-btn-group">
              <button id="vinyl-play-btn" class="vinyl-action-btn play-action">
                ▶ Play Lullaby
              </button>
              <a id="vinyl-download-btn" class="vinyl-action-btn download-action" download="Taylor_Swift_Lover_Lullaby_For_Tiya.wav">
                ⬇ Download (.wav)
              </a>
            </div>
          </div>
        </div>
      `
    }
    return ''
  }

  attachStandardRealmListeners(ch) {
    // Open Keepsake Modal button
    const openKeepsakeBtn = document.getElementById('open-keepsake-btn')
    if (openKeepsakeBtn) {
      openKeepsakeBtn.addEventListener('click', () => {
        this.showKeepsakeModal(ch.keepsake)
      })
    }

    // Prev / Next buttons
    document.getElementById('prev-realm-btn')?.addEventListener('click', () => {
      audioEngine.playChime(523.25, 0.3)
      this.goToChapter(this.currentChapterIndex - 1)
    })

    document.getElementById('next-realm-btn')?.addEventListener('click', () => {
      audioEngine.playChime(659.25, 0.4)
      this.goToChapter(this.currentChapterIndex + 1)
    })

    // Realm 2: Akuma Click
    if (ch.id === 'paris') {
      const akumaBtn = document.getElementById('akuma-butterfly-btn')
      if (akumaBtn) {
        akumaBtn.addEventListener('click', () => {
          if (!this.akumaPurified) {
            this.akumaPurified = true
            audioEngine.playSparkleFanfare()
            const box = document.getElementById('akuma-interactive')
            box.classList.add('cleansed')
            akumaBtn.textContent = '🕊️'
            box.querySelector('strong').textContent = 'Akuma Purified!'
            box.querySelector('p').textContent = 'Pure starlight restored to Paris. "Miraculous Ladybug!"'
            gameState.showFloatingNotice("🐞 Purified! Ladybug & Cat Noir smile at Tiya!")
          }
        })
      }
    }

    // Realm 8: Vinyl Player
    if (ch.id === 'eras') {
      const playBtn = document.getElementById('vinyl-play-btn')
      const discWrapper = document.getElementById('vinyl-disc')
      const statusLabel = document.getElementById('vinyl-status')
      const downloadLink = document.getElementById('vinyl-download-btn')

      const wavUrl = audioEngine.getLoverLullabyUrl()
      downloadLink.href = wavUrl

      playBtn.addEventListener('click', () => {
        const isPlaying = audioEngine.toggleLoverLullaby((playing) => {
          discWrapper.classList.toggle('playing', playing)
          playBtn.textContent = playing ? '⏸ Pause' : '▶ Play Lullaby'
          statusLabel.textContent = playing ? 'Playing for Tiya... 🎶' : 'Paused'
        })

        discWrapper.classList.toggle('playing', isPlaying)
        playBtn.textContent = isPlaying ? '⏸ Pause' : '▶ Play Lullaby'
        statusLabel.textContent = isPlaying ? 'Playing for Tiya... 🎶' : 'Paused'
      })

      downloadLink.addEventListener('click', () => {
        gameState.showFloatingNotice("🎵 Downloading Taylor's Lullaby for Tiya!")
      })
    }
  }

  showKeepsakeModal(keepsake) {
    if (!keepsake) return

    // Auto-add to inventory
    const exists = gameState.inventory.some(i => i.id === keepsake.id)
    if (!exists) {
      gameState.addInventoryItem(keepsake)
      audioEngine.playSparkleFanfare()
      this.updateRibbonActive()
    }

    const modal = document.createElement('div')
    modal.className = 'keepsake-modal-backdrop'
    modal.innerHTML = `
      <div class="keepsake-modal-card">
        <button class="modal-close-btn" id="close-modal-btn">✕</button>

        <div class="keepsake-preview-frame">
          <img src="${keepsake.img}" alt="${keepsake.name}" class="keepsake-large-img" />
          <div class="keepsake-lens-flare"></div>
        </div>

        <div class="keepsake-details">
          <span class="keepsake-tag">${keepsake.tag}</span>
          <h3 class="keepsake-title">${keepsake.name}</h3>
          <p class="keepsake-desc">${keepsake.desc}</p>

          <div class="keepsake-download-box">
            <a href="${keepsake.img}" download="${keepsake.downloadName}" class="aurora-glow-btn download-glow-btn" id="direct-download-btn">
              ⬇ Download Keepsake (${keepsake.type})
            </a>
            <span class="download-subhint">Click to save this high-resolution gift to your device forever</span>
          </div>
        </div>
      </div>
    `
    document.body.appendChild(modal)

    const close = () => {
      modal.classList.add('closing')
      setTimeout(() => modal.remove(), 250)
    }

    modal.querySelector('#close-modal-btn').addEventListener('click', close)
    modal.addEventListener('click', (e) => {
      if (e.target === modal) close()
    })

    modal.querySelector('#direct-download-btn').addEventListener('click', () => {
      gameState.showFloatingNotice(`🎁 Downloaded ${keepsake.name}!`)
    })
  }

  renderFinale(ch) {
    this.container.innerHTML = `
      <div class="living-stage finale-stage">
        <div class="parallax-bg-layer finale-cosmos">
          <div class="finale-sun-flare"></div>
        </div>

        <div class="realm-layout finale-layout">
          <div class="realm-header">
            <span class="realm-badge" style="border-color: #fbbf24; color: #fbbf24">
              THE CELESTIAL REUNION
            </span>
            <h2 class="realm-title">The Birthday Star</h2>
            <p class="realm-subtitle">All 11 heroes gathered under the golden star for Tiya's 21st Birthday!</p>
          </div>

          <!-- All 11 Heroes Reunited Lineup -->
          <div class="reunion-lineup">
            <div class="reunion-member" title="Thalia">
              <img src="/characters/thalia.jpg" alt="Thalia" />
              <span>Thalia</span>
            </div>
            <div class="reunion-member" title="Varkas">
              <img src="/characters/varkas.jpg" alt="Varkas" />
              <span>Varkas</span>
            </div>
            <div class="reunion-member" title="Ladybug">
              <img src="/characters/ladybug.jpg" alt="Ladybug" />
              <span>Ladybug</span>
            </div>
            <div class="reunion-member" title="Cat Noir">
              <img src="/characters/cat_noir.jpg" alt="Cat Noir" />
              <span>Cat Noir</span>
            </div>
            <div class="reunion-member" title="Maomao">
              <img src="/characters/maomao.jpg" alt="Maomao" />
              <span>Maomao</span>
            </div>
            <div class="reunion-member" title="Frieren">
              <img src="/characters/frieren.jpg" alt="Frieren" />
              <span>Frieren</span>
            </div>
            <div class="reunion-member" title="Tanjiro, Nezuko & Giyu">
              <img src="/characters/demon_slayer_trio.jpg" alt="Demon Slayer" />
              <span>Demon Slayer</span>
            </div>
            <div class="reunion-member" title="The Forger Family">
              <img src="/characters/forger_family.jpg" alt="Spy x Family" />
              <span>The Forgers</span>
            </div>
            <div class="reunion-member" title="Koyuki">
              <img src="/characters/koyuki.jpg" alt="Koyuki" />
              <span>Koyuki</span>
            </div>
            <div class="reunion-member highlight" title="Taylor Swift">
              <img src="/characters/taylor_swift.jpg" alt="Taylor Swift" />
              <span>Taylor Swift</span>
            </div>
          </div>

          <!-- Centerpiece: Joint Master Gift (The Aurora Heart Prism) -->
          <div class="joint-gem-card">
            <div class="joint-gem-header">
              <span class="prism-sparkle">✦</span>
              <h3>The Aurora Heart Prism</h3>
              <p>A master gem forged from the essence of all 8 realms</p>
            </div>
            
            <div class="gem-canvas-container" id="gem-canvas-wrapper" title="Interactive 3D Prism (Drag to Rotate!)">
              <canvas id="gem-3d-canvas" width="220" height="220"></canvas>
            </div>

            <button id="download-prism-btn" class="aurora-glow-btn" style="background: linear-gradient(135deg, #fbbf24, #ec4899); margin-top: 10px;">
              ⬇ Download The Aurora Heart Prism (.png)
            </button>
          </div>

          <!-- 3D/CSS Birthday Cake with Interactive Candles -->
          <div class="cake-ceremony-card">
            <div class="birthday-cake" id="birthday-cake">
              <div class="cake-tier tier-top">
                <div class="candles-cluster">
                  <div class="candle c1"><div class="flame ${this.candlesBlown ? 'extinguished' : ''}"></div></div>
                  <div class="candle c2"><div class="flame ${this.candlesBlown ? 'extinguished' : ''}"></div></div>
                  <div class="candle c3"><div class="flame ${this.candlesBlown ? 'extinguished' : ''}"></div></div>
                  <div class="candle c4"><div class="flame ${this.candlesBlown ? 'extinguished' : ''}"></div></div>
                  <div class="candle c5"><div class="flame ${this.candlesBlown ? 'extinguished' : ''}"></div></div>
                </div>
              </div>
              <div class="cake-tier tier-middle"></div>
              <div class="cake-tier tier-bottom"></div>
              <div class="cake-plate"></div>
            </div>

            <div class="cake-actions">
              <button id="blow-candles-btn" class="aurora-glow-btn" style="background: linear-gradient(135deg, #fbbf24, #f43f5e);">
                ${this.candlesBlown ? 'Make Another Wish 🌟' : 'Make a Wish & Blow Out Candles 🎂💨'}
              </button>
            </div>
          </div>

          <!-- Birthday Letter Card (Revealed after candles blown) -->
          <div class="birthday-letter-card ${this.candlesBlown ? 'revealed' : 'hidden'}" id="birthday-letter">
            <div class="letter-header">
              <span class="letter-seal">✦</span>
              <h3>To Tiya, The Radiant Star on Turning 21</h3>
            </div>
            <div class="letter-body">
              <p>Happy 21st Birthday, Tiya!</p>
              <p>
                From imperial manhwa palaces and Parisian rooftops, to Maomao's apothecary, Frieren's ancient libraries, Mount Wisteria, the chaotic Forger dining table, Koyuki's snowy winter walk, and Taylor's sparkling Eras stage...
              </p>
              <p>
                Every single character and world gathered today with one united voice: to celebrate the brilliant, kind, and deeply wonderful soul you are. May your 21st year sparkle with wild adventure, may your upcoming semester exams be filled with effortless triumph, and may you always know how much you are cherished.
              </p>
              <p class="letter-signoff">
                With all the love across every universe,<br>
                <strong>Happy 21st Birthday, Tiya! 💖✨</strong>
              </p>
            </div>

            <!-- Keepsakes Trophy Tray -->
            <div class="keepsakes-tray">
              <div class="trophy-badge">💎 Moonstone</div>
              <div class="trophy-badge">🐞 Paris Memory</div>
              <div class="trophy-badge">🌿 Qinghao Herb</div>
              <div class="trophy-badge">📖 Odd Spells Grimoire</div>
              <div class="trophy-badge">⚔️ Cedar Charm</div>
              <div class="trophy-badge">🥜 Forger Photo</div>
              <div class="trophy-badge">❄️ Koyuki's Letter</div>
              <div class="trophy-badge">🎵 Taylor's 21st Note</div>
            </div>
          </div>

          <!-- Bottom Navigation -->
          <div class="realm-nav-bar">
            <button class="nav-arrow-btn prev-btn" id="finale-prev-btn">
              ◀ Back to Eras Tour
            </button>
            <button class="nav-arrow-btn" id="replay-btn" style="background: rgba(255, 255, 255, 0.12);">
              🔄 Replay Odyssey
            </button>
          </div>
        </div>
      </div>
    `

    // Render the 3D rotating Aurora Heart Prism on the canvas
    this.render3DHeartPrism()

    // Hook listeners
    document.getElementById('finale-prev-btn')?.addEventListener('click', () => {
      this.goToChapter(8)
    })

    document.getElementById('replay-btn')?.addEventListener('click', () => {
      this.goToChapter(0)
    })

    document.getElementById('blow-candles-btn')?.addEventListener('click', () => {
      this.candlesBlown = true
      audioEngine.playBirthdayMelody()

      document.querySelectorAll('.flame').forEach(f => f.classList.add('extinguished'))
      this.triggerConfettiFireworks()

      const letter = document.getElementById('birthday-letter')
      letter.classList.remove('hidden')
      letter.classList.add('revealed')

      document.getElementById('blow-candles-btn').textContent = 'Make Another Wish 🌟'
      gameState.showFloatingNotice("🎂 Happy 21st Birthday Tiya!! The candles are blown!")
    })

    document.getElementById('download-prism-btn')?.addEventListener('click', () => {
      const canvas = document.getElementById('gem-3d-canvas')
      if (canvas) {
        const url = canvas.toDataURL('image/png')
        const a = document.createElement('a')
        a.href = url
        a.download = 'The_Aurora_Heart_Prism_Tiya_Birthday.png'
        a.click()
        gameState.showFloatingNotice("💎 Downloaded The Aurora Heart Prism!")
      }
    })
  }

  render3DHeartPrism() {
    const canvas = document.getElementById('gem-3d-canvas')
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let angle = 0

    const drawPrism = () => {
      if (!document.getElementById('gem-3d-canvas')) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      angle += 0.025

      const cx = canvas.width / 2
      const cy = canvas.height / 2
      const r = 70

      // Facet vertices with 3D rotation
      const points = [
        { x: 0, y: -r * 1.15, z: 0 }, // Top apex
        { x: -r * 0.75, y: -r * 0.25, z: Math.sin(angle) * r * 0.7 },
        { x: r * 0.75, y: -r * 0.25, z: Math.cos(angle) * r * 0.7 },
        { x: -r * 0.85, y: r * 0.35, z: Math.sin(angle + 2) * r * 0.8 },
        { x: r * 0.85, y: r * 0.35, z: Math.cos(angle + 2) * r * 0.8 },
        { x: 0, y: r * 1.15, z: 0 }  // Bottom apex
      ]

      // Draw glowing facets
      const colors = ['#f43f5e', '#a855f7', '#38bdf8', '#10b981', '#fbbf24', '#ec4899']

      // Facet 1: Top Front
      ctx.fillStyle = colors[Math.floor(Math.abs(Math.sin(angle)) * 6)]
      ctx.globalAlpha = 0.8
      ctx.beginPath()
      ctx.moveTo(cx + points[0].x, cy + points[0].y)
      ctx.lineTo(cx + points[1].x, cy + points[1].y)
      ctx.lineTo(cx + points[2].x, cy + points[2].y)
      ctx.closePath()
      ctx.fill()
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 1.5
      ctx.stroke()

      // Facet 2: Middle Belt
      ctx.fillStyle = colors[Math.floor(Math.abs(Math.cos(angle)) * 6)]
      ctx.globalAlpha = 0.75
      ctx.beginPath()
      ctx.moveTo(cx + points[1].x, cy + points[1].y)
      ctx.lineTo(cx + points[2].x, cy + points[2].y)
      ctx.lineTo(cx + points[4].x, cy + points[4].y)
      ctx.lineTo(cx + points[3].x, cy + points[3].y)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()

      // Facet 3: Bottom
      ctx.fillStyle = '#fbbf24'
      ctx.globalAlpha = 0.85
      ctx.beginPath()
      ctx.moveTo(cx + points[3].x, cy + points[3].y)
      ctx.lineTo(cx + points[4].x, cy + points[4].y)
      ctx.lineTo(cx + points[5].x, cy + points[5].y)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()

      // Central Starlight Flare
      ctx.globalAlpha = 0.95
      ctx.fillStyle = '#ffffff'
      ctx.shadowColor = '#fbbf24'
      ctx.shadowBlur = 18
      ctx.beginPath()
      ctx.arc(cx, cy, 8 + Math.sin(angle * 3) * 3, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0

      requestAnimationFrame(drawPrism)
    }

    drawPrism()
  }

  triggerConfettiFireworks() {
    const burst = document.createElement('div')
    burst.className = 'confetti-burst'
    document.body.appendChild(burst)

    const colors = ['#f59e0b', '#fbbf24', '#f43f5e', '#ec4899', '#a855f7', '#3b82f6', '#10b981', '#06b6d4', '#ffffff']

    for (let i = 0; i < 110; i++) {
      const bit = document.createElement('div')
      bit.className = 'confetti-bit'
      bit.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
      bit.style.left = '50%'
      bit.style.top = '50%'

      const angle = Math.random() * Math.PI * 2
      const velocity = 180 + Math.random() * 450
      const vx = Math.cos(angle) * velocity
      const vy = Math.sin(angle) * velocity - 120

      bit.style.setProperty('--vx', `${vx}px`)
      bit.style.setProperty('--vy', `${vy}px`)
      burst.appendChild(bit)
    }

    setTimeout(() => burst.remove(), 2500)
  }
}
