// ========================================
// PROJECT AURORA - AUDIO ENGINE
// Synthesizes Taylor Swift's "Lover" lullaby (.wav export),
// Happy Birthday music box, and celestial UI chimes.
// ========================================

class AudioEngine {
  constructor() {
    this.ctx = null
    this.muted = false
    this.lullabyAudio = null
    this.lullabyUrl = null
    this.isLullabyPlaying = false
    this.currentBgm = null
    this.bgmTimer = null
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  toggleMute() {
    this.muted = !this.muted
    if (this.muted) {
      if (this.lullabyAudio) this.lullabyAudio.pause()
      this.isLullabyPlaying = false
      if (this.currentBgm) this.currentBgm.pause()
    } else {
      if (this.currentBgm) {
        this.currentBgm.play().catch(e => console.log('BGM play blocked:', e))
      }
    }
    return this.muted
  }

  playRealmBgm(trackUrl, maxDuration = 0) {
    this.stopRealmBgm()
    if (!trackUrl) return

    try {
      this.currentBgm = new Audio(trackUrl)
      this.currentBgm.volume = 0.55
      this.currentBgm.loop = maxDuration === 0

      if (!this.muted) {
        this.currentBgm.play().catch(e => console.log('Autoplay audio blocked until user click:', e))
      }

      if (maxDuration > 0) {
        this.bgmTimer = setTimeout(() => {
          if (this.currentBgm) {
            let vol = this.currentBgm.volume
            const fade = setInterval(() => {
              vol = Math.max(0, vol - 0.05)
              if (this.currentBgm) this.currentBgm.volume = vol
              if (vol <= 0) {
                clearInterval(fade)
                this.stopRealmBgm()
              }
            }, 100)
          }
        }, maxDuration * 1000)
      }
    } catch (e) {
      console.warn('Failed to load realm BGM:', e)
    }
  }

  stopRealmBgm() {
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer)
      this.bgmTimer = null
    }
    if (this.currentBgm) {
      this.currentBgm.pause()
      this.currentBgm = null
    }
  }

  // Play a gentle celestial bell chime
  playChime(freq = 587.33, duration = 0.8) {
    if (this.muted) return
    this.initContext()
    if (!this.ctx) return

    try {
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      const now = this.ctx.currentTime

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now)
      // Slight overtone
      const osc2 = this.ctx.createOscillator()
      const gain2 = this.ctx.createGain()
      osc2.type = 'triangle'
      osc2.frequency.setValueAtTime(freq * 2, now)

      gain.gain.setValueAtTime(0.18, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)

      gain2.gain.setValueAtTime(0.06, now)
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.7)

      osc.connect(gain)
      osc2.connect(gain2)
      gain.connect(this.ctx.destination)
      gain2.connect(this.ctx.destination)

      osc.start(now)
      osc2.start(now)
      osc.stop(now + duration)
      osc2.stop(now + duration)
    } catch (e) {
      console.warn('Audio chime failed:', e)
    }
  }

  // Play star fragment acquire sparkle chord
  playSparkleFanfare() {
    if (this.muted) return
    const notes = [523.25, 659.25, 783.99, 1046.50] // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => this.playChime(freq, 1.2), idx * 110)
    })
  }

  // Play Happy Birthday music box melody for candle blowout
  playBirthdayMelody() {
    if (this.muted) return
    this.initContext()
    if (!this.ctx) return

    // "Happy Birthday to you..."
    const notes = [
      { f: 261.63, d: 0.35 }, // Hap-
      { f: 261.63, d: 0.35 }, // py
      { f: 293.66, d: 0.65 }, // birth-
      { f: 261.63, d: 0.65 }, // day
      { f: 349.23, d: 0.65 }, // to
      { f: 329.63, d: 1.10 }, // you
      { f: 261.63, d: 0.35 }, // Hap-
      { f: 261.63, d: 0.35 }, // py
      { f: 293.66, d: 0.65 }, // birth-
      { f: 261.63, d: 0.65 }, // day
      { f: 392.00, d: 0.65 }, // to
      { f: 349.23, d: 1.10 }, // you
      { f: 261.63, d: 0.35 }, // Hap-
      { f: 261.63, d: 0.35 }, // py
      { f: 523.25, d: 0.65 }, // birth-
      { f: 440.00, d: 0.65 }, // day
      { f: 349.23, d: 0.65 }, // dear
      { f: 329.63, d: 0.65 }, // Ti-
      { f: 293.66, d: 0.85 }, // ya
      { f: 466.16, d: 0.35 }, // Hap-
      { f: 466.16, d: 0.35 }, // py
      { f: 440.00, d: 0.65 }, // birth-
      { f: 349.23, d: 0.65 }, // day
      { f: 392.00, d: 0.65 }, // to
      { f: 349.23, d: 1.60 }  // you!
    ]

    let timeOffset = 0
    notes.forEach(n => {
      setTimeout(() => this.playChime(n.f, n.d * 1.5), timeOffset * 1000)
      timeOffset += n.d
    })
  }

  // Synthesize Taylor Swift's "Lover" Lullaby as a downloadable 16-bit PCM WAV Blob
  getLoverLullabyUrl() {
    if (this.lullabyUrl) return this.lullabyUrl

    const sampleRate = 44100
    // "Lover" chorus melodic progression (G Major)
    const notes = [
      // "Can I go where you go?"
      { f: 392.00, d: 0.45 },
      { f: 440.00, d: 0.45 },
      { f: 493.88, d: 0.65 },
      { f: 587.33, d: 0.95 },
      { f: 493.88, d: 0.65 },
      { f: 440.00, d: 0.65 },
      { f: 392.00, d: 1.10 },

      // "Can we always be this close..."
      { f: 329.63, d: 0.45 },
      { f: 392.00, d: 0.45 },
      { f: 440.00, d: 0.55 },
      { f: 493.88, d: 0.75 },
      { f: 440.00, d: 0.55 },
      { f: 392.00, d: 0.75 },
      { f: 329.63, d: 1.20 },

      // "Forever and ever..."
      { f: 329.63, d: 0.45 },
      { f: 392.00, d: 0.55 },
      { f: 440.00, d: 0.55 },
      { f: 493.88, d: 0.65 },
      { f: 587.33, d: 0.85 },
      { f: 659.25, d: 0.95 },
      { f: 587.33, d: 1.30 },

      // "You're my, my, my, my... lover"
      { f: 587.33, d: 0.45 },
      { f: 493.88, d: 0.45 },
      { f: 440.00, d: 0.45 },
      { f: 392.00, d: 0.55 },
      { f: 440.00, d: 0.85 },
      { f: 392.00, d: 2.20 }
    ]

    let totalDuration = 0.5
    notes.forEach(n => { totalDuration += n.d * 0.85 })
    totalDuration += 2.0

    const numSamples = Math.floor(sampleRate * totalDuration)
    const samples = new Float32Array(numSamples)

    let currentTime = 0.5
    notes.forEach(note => {
      const noteStart = Math.floor(currentTime * sampleRate)
      const noteDurationSamples = Math.floor(note.d * 1.8 * sampleRate)

      for (let i = 0; i < noteDurationSamples; i++) {
        const idx = noteStart + i
        if (idx >= numSamples) break

        const t = i / sampleRate
        const envelope = Math.exp(-t * 3.2)
        const tone1 = Math.sin(2 * Math.PI * note.f * t)
        const tone2 = 0.35 * Math.sin(2 * Math.PI * note.f * 2 * t) * Math.exp(-t * 4.5)
        const tone3 = 0.15 * Math.sin(2 * Math.PI * note.f * 3 * t) * Math.exp(-t * 6.0)

        samples[idx] += (tone1 + tone2 + tone3) * envelope * 0.28
      }
      currentTime += note.d * 0.85
    })

    const buffer = new ArrayBuffer(44 + numSamples * 2)
    const view = new DataView(buffer)

    function writeString(offset, string) {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i))
      }
    }

    writeString(0, 'RIFF')
    view.setUint32(4, 36 + numSamples * 2, true)
    writeString(8, 'WAVE')
    writeString(12, 'fmt ')
    view.setUint32(16, 16, true)
    view.setUint16(20, 1, true)
    view.setUint16(22, 1, true)
    view.setUint32(24, sampleRate, true)
    view.setUint32(28, sampleRate * 2, true)
    view.setUint16(32, 2, true)
    view.setUint16(34, 16, true)
    writeString(36, 'data')
    view.setUint32(40, numSamples * 2, true)

    let offset = 44
    for (let i = 0; i < numSamples; i++) {
      let s = Math.max(-1, Math.min(1, samples[i]))
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true)
      offset += 2
    }

    const blob = new Blob([view], { type: 'audio/wav' })
    this.lullabyUrl = URL.createObjectURL(blob)
    return this.lullabyUrl
  }

  toggleLoverLullaby(onStateChange = null) {
    if (this.muted) return false

    if (!this.lullabyAudio) {
      const url = this.getLoverLullabyUrl()
      this.lullabyAudio = new Audio(url)
      this.lullabyAudio.addEventListener('ended', () => {
        this.isLullabyPlaying = false
        if (onStateChange) onStateChange(false)
      })
    }

    if (this.isLullabyPlaying) {
      this.lullabyAudio.pause()
      this.isLullabyPlaying = false
      if (onStateChange) onStateChange(false)
      return false
    } else {
      this.lullabyAudio.currentTime = 0
      this.lullabyAudio.play()
      this.isLullabyPlaying = true
      if (onStateChange) onStateChange(true)
      return true
    }
  }

  stopLullaby() {
    if (this.lullabyAudio && this.isLullabyPlaying) {
      this.lullabyAudio.pause()
      this.isLullabyPlaying = false
    }
  }
}

export const audioEngine = new AudioEngine()
