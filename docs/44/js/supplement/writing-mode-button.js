class WritingModeButton {
    constructor() { this.el = null; this.symbols = [['横','縦'], ['Ｚ','Ｎ']]; this.symbolId = 0; this.selected = 0; }
    make() {
        this.el = document.createElement('div')
        this.el.classList.add('write-mode-button')
        this.#addListener()
        this.toggleSymbol()
        return this.el
    }
    toggle() {
        this.selected += 1
        if (this.symbols[0].length <= this.selected) { this.selected = 0 }
        this.#update()
        //this.#setWritingMode()
    }
    toggleSymbol() {
        this.symbolId += 1
        if (this.symbols[0].length <= this.symbolId) { this.symbolId = 0 }
        this.#update() 
    }
    hide() { this.el.style.display = 'none' }
    show() { this.el.style.display = 'block' }
    #update() { this.el.textContent = this.symbols[this.symbolId][this.selected] }
    #addListener() { this.el.addEventListener('click', async(event)=>{ this.toggle() }) }
    /*
    #setWritingMode() {
        Css.set('--writing-mode', this.#getSelectedWritingMode())
        fitTextBlock.resize()
    }
    #getSelectedWritingMode() { return (0===this.selected) ? 'vertical-rl' : 'holizontal-tb' }
    */
}
