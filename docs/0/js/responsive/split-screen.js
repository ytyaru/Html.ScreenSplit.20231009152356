class SplitScreen {
    make(options) {
        this.options = (options) ? options : {'count':2, 'writingMode':'horizontal'}
    }
    #makeScreen() {
        this.el = document.createElement('div')
        this.el.classList.add('screen')
        this.#addInnerScreen(this.el) 
        return this.el
    }
    #addInnerScreen() {
        for (let i=0; i<this.options.count; i++) {
            const inner = document.createElement('div')
            inner.classList.add('inner-screen')
            this.el.appendChild(split)
        }
    }
    resize() {
        if ('horizontal'===this.options.writingMode) {
            Css.set('--screen-block-size', `${this.el.clientHeight}px`)
            Css.set('--screen-inline-size', `${this.el.clientWidth}px`)
            Css.set('--inner-block-size', `${this.el.clientHeight}px`)
            Css.set('--inner-inline-size', `${this.el.clientWidth / this.options.count}px`)
        } else if ('vertical'===this.options.writingMode) {
            Css.set('--screen-block-size', `${this.el.clientWidth}px`)
            Css.set('--screen-inline-size', `${this.el.clientHeight}px`)
            Css.set('--inner-block-size', `${this.el.clientWidth}px`)
            Css.set('--inner-inline-size', `${this.el.clientHeight / this.options.count}px`)
        } else {}
    }
}
window.splitScreen = new SplitScreen()
