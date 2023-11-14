class WriteModeButton {
    constructor() { this.el = null; this.symbols = [['横','縦'], ['Ｚ','Ｎ']]; this.symbolId = 0; this.selected = 0; }
    make() {
        this.el = document.createElement('div')
        this.el.classList.add('write-mode-button')
        this.setTitle()
        return this.el
        // <div class="write-mode-button">縦</div>
    }
    off() { this.el.style.display = 'none' }
    on() { this.el.style.display = 'block' }
    setTitle(title) { this.on(); this.el.innerHTML = title || '§'; }
}
