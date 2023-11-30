class SettingButton {
    constructor() { this.el = null; this.symbols = ['設','⚙','︙']; this.symbolId = 0; this.selected = 0; }
    make() {
        if (this.el) { return this.el }
        this.el = document.createElement('div')
        this.el.classList.add('setting-button')
        this.toggleSymbol()
        return this.el
        // <div class="write-mode-button">縦</div>
    }
    toggleSymbol() {
        this.symbolId += 1
        if (this.symbols.length <= this.symbolId) { this.symbolId = 0 }
        this.#update()
    }
    hide() { this.el.style.display = 'none' }
    show() { this.el.style.display = 'block' }
    #update() { this.el.textContent = this.symbols[this.symbolId][this.selected] }
    //#update() { this.el.textContent = this.symbols[this.symbolId][this.selected] + '　' }
    openDialog() {}
    closeDialog() {}
}

