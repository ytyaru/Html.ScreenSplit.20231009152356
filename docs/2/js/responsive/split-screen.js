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
        Css.set('--writing-mode', this.#writingMode())
        this.#gird()
        Css.set('--screen-block-size', `${this.#clientBlock()}px`)
        Css.set('--screen-inline-size', `${this.#clientInline()}px`)
        Css.set('--inner-block-size', `${this.#clientBlock()}px`)
        //Css.set('--inner-inline-size', `${this.#clientInline() / this.options.count}px`)
        //Css.set('--inner-inline-size', `${(this.#clientInline() / this.options.count)}px`)
        Css.set('--inner-inline-size', `${(this.#clientInline() / this.options.count) - (this.#gridGap() / this.options.count)}px`)
    }
    #isVertical() { return 'vertical'===this.options.writingMode }
    #isHorizontal() { return 'horizontal'===this.options.writingMode }
    #writingMode() { return (this.#isVertical()) ? 'vertical-rl' : 'holizontal-tb' }
    #clientBlock() { return (this.#isVertical()) ? this.#clientWidth() : this.#clientHeight() }
    #clientInline() { return (this.#isVertical()) ? this.#clientHeight() : this.#clientWidth() }
    #clientWidth() { return document.body.clientWidth }
    #clientHeight() { return document.documentElement.clientHeight }
//    #screenDisplay() { return (this.#isVertical()) ? 'block' : 'inline-block' }
    #gridCols() { return (this.#isVertical()) ? 1 : this.options.count }
    #gridRows() { return (this.#isVertical()) ? this.options.count : 1 }
    #gridHeight() { return this.#clientHeight() / ((this.#isVertical()) ? this.options.count : 1) }
    #gridGap() { return 10 }
    #gird() {
        Css.set('--grid-cols', `${this.#gridCols()}`)
        Css.set('--grid-rows', `${this.#gridRows()}`)
        Css.set('--grid-height', `${this.#gridHeight()}px`)
        Css.set('--grid-gap', `${this.#gridGap()}px`)
    }
}
window.splitScreen = new SplitScreen()
