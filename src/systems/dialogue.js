// ========================================
// PROJECT AURORA - DYNAMIC DUAL CHARACTER DIALOGUE ENGINE
// Supports Thalia & Varkas, Ladybug & Cat Noir, and all future planets!
// ========================================

export class DialogueSystem {
  constructor() {
    this.container = null
    this.dialogueQueue = []
    this.currentIndex = 0
    this.isTyping = false
    this.typingTimer = null
    this.currentText = ''
    this.onCompleteCallback = null
    this.initDOM()
  }

  initDOM() {
    let el = document.querySelector('.aurora-dialogue-box')
    if (!el) {
      el = document.createElement('div')
      el.className = 'aurora-dialogue-box hidden'
      el.innerHTML = `
        <div class="dialogue-stage">
          <div class="stage-character" id="stage-left">
            <div class="stage-portrait-wrapper">
              <img src="/characters/thalia.jpg" alt="Left Character" class="stage-portrait" id="portrait-left" />
              <div class="stage-glow"></div>
            </div>
            <span class="stage-name" id="name-left">Thalia</span>
          </div>

          <div class="stage-character" id="stage-right">
            <div class="stage-portrait-wrapper">
              <img src="/characters/varkas.jpg" alt="Right Character" class="stage-portrait" id="portrait-right" />
              <div class="stage-glow"></div>
            </div>
            <span class="stage-name" id="name-right">Varkas</span>
          </div>
        </div>

        <div class="dialogue-content">
          <div class="dialogue-header">
            <span class="dialogue-speaker-tag" id="dialogue-speaker">Speaker</span>
            <span class="dialogue-universe-tag" id="dialogue-universe">Cosmic Realm</span>
          </div>
          <div class="dialogue-body">
            <p class="dialogue-text" id="dialogue-text"></p>
          </div>
          <div class="dialogue-footer">
            <span class="dialogue-prompt">Click anywhere to continue <span class="blinking-arrow">▾</span></span>
          </div>
        </div>
      `
      document.body.appendChild(el)

      el.addEventListener('click', () => this.handleAdvance())
    }
    this.container = el
  }

  start(dialogueList, onComplete = null) {
    this.dialogueQueue = dialogueList
    this.currentIndex = 0
    this.onCompleteCallback = onComplete

    // Configure the stage portraits according to the universe
    this.setupStageForUniverse(dialogueList)

    this.container.classList.remove('hidden')
    this.showLine(this.currentIndex)
  }

  setupStageForUniverse(dialogueList) {
    const firstLine = dialogueList[0] || {}
    const universe = (firstLine.universe || '').toLowerCase()

    const leftStage = document.getElementById('stage-left')
    const rightStage = document.getElementById('stage-right')
    const leftPortrait = document.getElementById('portrait-left')
    const rightPortrait = document.getElementById('portrait-right')
    const leftName = document.getElementById('name-left')
    const rightName = document.getElementById('name-right')

    if (universe.includes('miraculous') || universe.includes('paris')) {
      this.container.classList.add('miraculous-theme')
      leftStage.style.display = 'flex'
      rightStage.style.display = 'flex'
      leftStage.className = 'stage-character ladybug-stage'
      rightStage.className = 'stage-character catnoir-stage'
      leftPortrait.src = '/characters/ladybug.jpg'
      rightPortrait.src = '/characters/cat_noir.jpg'
      leftName.textContent = 'Ladybug'
      rightName.textContent = 'Cat Noir'
    } else if (universe.includes('apothecary') || universe.includes('frieren') || universe.includes('maomao')) {
      this.container.classList.remove('miraculous-theme')
      leftStage.style.display = 'flex'
      rightStage.style.display = 'flex'
      leftStage.className = 'stage-character maomao-stage'
      rightStage.className = 'stage-character frieren-stage'
      leftPortrait.src = '/characters/maomao.jpg'
      rightPortrait.src = '/characters/frieren.jpg'
      leftName.textContent = 'Maomao'
      rightName.textContent = 'Frieren'
    } else if (universe.includes('eras') || universe.includes('melody') || universe.includes('taylor')) {
      this.container.classList.remove('miraculous-theme')
      leftStage.style.display = 'flex'
      rightStage.style.display = 'none'
      leftStage.className = 'stage-character taylor-stage'
      leftPortrait.src = '/characters/taylor_swift.jpg'
      leftName.textContent = 'Taylor Swift'
    } else {
      this.container.classList.remove('miraculous-theme')
      leftStage.style.display = 'flex'
      rightStage.style.display = 'flex'
      // Default to Thalia & Varkas (Forgotten Field)
      leftStage.className = 'stage-character thalia-stage'
      rightStage.className = 'stage-character varkas-stage'
      leftPortrait.src = '/characters/thalia.jpg'
      rightPortrait.src = '/characters/varkas.jpg'
      leftName.textContent = 'Thalia'
      rightName.textContent = 'Varkas'
    }
  }

  showLine(index) {
    if (index >= this.dialogueQueue.length) {
      this.close()
      if (this.onCompleteCallback) {
        this.onCompleteCallback()
      }
      return
    }

    const item = this.dialogueQueue[index]
    const speakerEl = document.getElementById('dialogue-speaker')
    const textEl = document.getElementById('dialogue-text')
    const universeEl = document.getElementById('dialogue-universe')
    const leftStage = document.getElementById('stage-left')
    const rightStage = document.getElementById('stage-right')
    const leftName = document.getElementById('name-left').textContent.toLowerCase()
    const rightName = document.getElementById('name-right').textContent.toLowerCase()

    speakerEl.textContent = item.speaker
    speakerEl.setAttribute('data-speaker', item.speaker.toLowerCase().replace(/\s+/g, '-'))
    if (item.universe) universeEl.textContent = item.universe

    const speakerLower = item.speaker.toLowerCase()
    const matchesLeft = speakerLower.includes(leftName)
    const matchesRight = speakerLower.includes(rightName)

    if (matchesLeft && matchesRight) {
      leftStage.classList.add('speaker-active')
      leftStage.classList.remove('speaker-inactive')
      rightStage.classList.add('speaker-active')
      rightStage.classList.remove('speaker-inactive')
    } else if (matchesLeft) {
      leftStage.classList.add('speaker-active')
      leftStage.classList.remove('speaker-inactive')
      rightStage.classList.remove('speaker-active')
      rightStage.classList.add('speaker-inactive')
    } else if (matchesRight) {
      rightStage.classList.add('speaker-active')
      rightStage.classList.remove('speaker-inactive')
      leftStage.classList.remove('speaker-active')
      leftStage.classList.add('speaker-inactive')
    } else {
      leftStage.classList.remove('speaker-active', 'speaker-inactive')
      rightStage.classList.remove('speaker-active', 'speaker-inactive')
    }

    this.typewriter(item.text, textEl)
  }

  typewriter(fullText, element) {
    if (this.typingTimer) clearInterval(this.typingTimer)
    this.isTyping = true
    this.currentText = fullText
    element.innerHTML = ''
    let charIndex = 0

    this.typingTimer = setInterval(() => {
      if (charIndex < fullText.length) {
        element.innerHTML += fullText.charAt(charIndex)
        charIndex++
      } else {
        clearInterval(this.typingTimer)
        this.isTyping = false
      }
    }, 20)
  }

  handleAdvance() {
    const textEl = document.getElementById('dialogue-text')
    if (this.isTyping) {
      clearInterval(this.typingTimer)
      this.isTyping = false
      textEl.innerHTML = this.currentText
    } else {
      this.currentIndex++
      this.showLine(this.currentIndex)
    }
  }

  close() {
    this.container.classList.add('hidden')
    if (this.typingTimer) clearInterval(this.typingTimer)
    this.isTyping = false
  }
}

export const dialogueSystem = new DialogueSystem()
