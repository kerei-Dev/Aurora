// ========================================
// PROJECT AURORA - GAME STATE & HUD
// ========================================

class GameState {
  constructor() {
    this.starFragments = []
    this.inventory = []
    this.currentUniverse = 0
    this.hudElement = null
    this.initHUD()
  }

  initHUD() {
    // Create HUD container in DOM if not present
    let hud = document.querySelector('.aurora-hud')
    if (!hud) {
      hud = document.createElement('div')
      hud.className = 'aurora-hud'
      hud.innerHTML = `
        <div class="hud-item hud-fragments" title="Star Fragments Collected">
          <span class="hud-icon">✦</span>
          <span class="hud-text">Fragments: <strong id="fragment-count">0</strong></span>
        </div>
        <div class="hud-item hud-inventory" id="inventory-btn" title="View Inventory">
          <span class="hud-icon">🎒</span>
          <span class="hud-text">Souvenirs (<strong id="inventory-count">0</strong>)</span>
        </div>
      `
      document.body.appendChild(hud)
    }
    this.hudElement = hud
    this.updateHUD()
  }

  addStarFragment(fragment) {
    this.starFragments.push(fragment)
    this.updateHUD()
    this.showFloatingNotice(`✦ Acquired Star Fragment: ${fragment.name}!`)
  }

  addInventoryItem(item) {
    this.inventory.push(item)
    this.updateHUD()
    this.showFloatingNotice(`🎁 Received Souvenir: ${item.name}!`)
  }

  updateHUD() {
    const fragmentCountEl = document.getElementById('fragment-count')
    const inventoryCountEl = document.getElementById('inventory-count')
    if (fragmentCountEl) fragmentCountEl.textContent = this.starFragments.length
    if (inventoryCountEl) inventoryCountEl.textContent = this.inventory.length
  }

  showFloatingNotice(text) {
    const notice = document.createElement('div')
    notice.className = 'aurora-notice'
    notice.textContent = text
    document.body.appendChild(notice)

    setTimeout(() => {
      notice.classList.add('show')
    }, 50)

    setTimeout(() => {
      notice.classList.remove('show')
      setTimeout(() => notice.remove(), 600)
    }, 4500)
  }
}

export const gameState = new GameState()
