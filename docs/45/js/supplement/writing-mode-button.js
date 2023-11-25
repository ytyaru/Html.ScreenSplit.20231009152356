class WritingModeButton {
    constructor() { this.el=null; this.symbols=[['横','縦'],['Ｚ','Ｎ']]; this.symbolId=0; this.selected=0; }
    make() {
        if (this.el) { return this.el }
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
        layoutScreen.toggleWritingMode()
        fitTextBlock.resize()
        //this.#setWritingMode()
    }
    toggleSymbol() {
        this.symbolId += 1
        if (this.symbols[0].length <= this.symbolId) { this.symbolId = 0 }
        console.log(`symbolId: ${this.symbolId}`)
        this.#update() 
        console.log(this.symbols[this.symbolId])
        console.log(this.symbols[this.symbolId][this.selected])
    }
    hide() { this.el.style.display = 'none' }
    show() { this.el.style.display = 'block' }
    #update() { this.el.textContent = this.symbols[this.symbolId][this.selected] }
    #addListener() { this.el.addEventListener('click', async(event)=>{ this.toggle() }) }
    /*
    #setWritingMode() {
        layoutScreen.options.writingMode = this.#getSelectedWritingMode().split('-')[0]
        layoutScreen.resize()
        //Css.set('--writing-mode', this.#getSelectedWritingMode())
        fitTextBlock.resize()
    }
    #getSelectedWritingMode() { return (0===this.selected) ? 'vertical-rl' : 'holizontal-tb' }
    */
}
