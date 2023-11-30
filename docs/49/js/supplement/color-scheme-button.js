class ColorSchemeButton {
    constructor() { this.el = null; this.symbols = [['明','暗'], ['☀','🌙']]; this.symbolId = 0; this.selected = 0; }
    make() {
        if (this.el) { return this.el }
        this.el = document.createElement('div')
        this.el.classList.add('color-scheme-button')
        this.changeSymbol()
        this.#addListener()
        return this.el
        // <div class="color-scheme-button">明</div>
    }
    toggle() {
        this.selected = (0===this.selected) ? 1 : 0
        this.#update() 
    }
    changeSymbol() {
        if (this.symbolId+1 < this.symbols.length) { this.symbolId += 1 }
        else { this.symbolId = 0 }
        this.#update() 
    }
    #update() { this.el.textContent = this.symbols[this.symbolId][this.selected] }
    hidden() { this.el.style.display = 'none' }
    show() { this.el.style.display = 'block' }
    #addListener() { this.el.addEventListener('click', async(event)=>{ this.toggle() }) }
}
