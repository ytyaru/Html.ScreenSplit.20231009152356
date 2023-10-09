class SplitScreen {
    make(options) {
        this.options = (options) ? options : {'count':2, 'writingMode':'horizontal'}
        document.body.appendChild(this.#makeScreen())
        console.log(this.options)
    }
    #makeScreen() {
        this.el = document.createElement('div')
        this.el.classList.add('screen')
        this.#addInnerScreen(this.el)
        this.resize()
        return this.el
    }
    #addInnerScreen() {
        for (let i=0; i<this.options.count; i++) {
            const inner = document.createElement('div')
            inner.classList.add('inner-screen')
            this.el.appendChild(inner)
        }
    }
    resize() {
        //Css.set('--screen-display', `${this.#screenDisplay()}`)
        //Css.set('--inner-display', `${this.#screenDisplay()}`)
        Css.set('--screen-block-size', `${this.#clientBlock()}px`)
        Css.set('--screen-inline-size', `${this.#clientInline()}px`)
        Css.set('--inner-block-size', `${this.#clientBlock()}px`)
        //Css.set('--inner-inline-size', `${this.#clientInline() / this.options.count}px`)
        Css.set('--inner-inline-size', `${(this.#clientInline() / this.options.count) - 200}px`)

        /*
        Css.set('--screen-block-size', `${(this.#isVertical()) ? this.#clientWidth() : this.clientHeight()}px`)
        Css.set('--screen-inline-size', `${(this.#isVertical()) ? this.#clientHeight() : this.clientWidth()}px`)
        Css.set('--inner-block-size', `${(this.#isVertical()) ? this.#clientWidth() : this.clientHeight()}px`)
        Css.set('--inner-inline-size', `${((this.#isVertical()) ? this.#clientHeight() : this.clientWidth()) / this.options.count}px`)
        */
        /*
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
        */
    }
    #isVertical() { return 'vertical'===this.options.writingMode }
    #isHorizontal() { return 'horizontal'===this.options.writingMode }
    #clientBlock() { return (this.#isVertical()) ? this.#clientWidth() : this.#clientHeight() }
    #clientInline() { return (this.#isVertical()) ? this.#clientHeight() : this.#clientWidth() }
    #clientWidth() { return document.body.clientWidth }
    #clientHeight() { return document.documentElement.clientHeight }
    #screenDisplay() { return (this.#isVertical()) ? 'block' : 'inline-block' }
}
window.splitScreen = new SplitScreen()
