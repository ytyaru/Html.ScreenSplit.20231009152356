class SplitScreen {
    #defaultOptions = { 'count':2, 'writingMode':'horizontal' }
    make(options={}) {
        deepCopy(this.#defaultOptions).then(obj=>{
            this.options = {...obj, ...options}
            document.body.appendChild(this.#makeScreen())
            console.log(this.options, this.#defaultOptions)
        })
    }
    #makeScreen() {
        if (document.querySelector('#screen')) {
            this.el = document.querySelector('#screen')
            this.el.innerHTML = ''
        } else {
            this.el = document.createElement('div')
            this.el.setAttribute('id', 'screen')
        }
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
        this.#testText()
    }
    resize() {
        this.#setWritingMode()
        console.log('writingMode:', this.options.writingMode)
        console.log('#clientWidth() ', this.#clientWidth())
        console.log('#clientHeight() ', this.#clientHeight())

        this.#gird()
        Css.set('--screen-block-size', `${this.#clientBlock()}px`)
        Css.set('--screen-inline-size', `${this.#clientInline()}px`)
    }
    #isVertical() { return 'vertical'===this.options.writingMode }
    #isHorizontal() { return 'horizontal'===this.options.writingMode }
    #writingMode() { return (this.#isVertical()) ? 'vertical-rl' : 'holizontal-tb' }
    #clientBlock() { return (this.#isVertical()) ? this.#clientWidth() : this.#clientHeight() }
    #clientInline() { return (this.#isVertical()) ? this.#clientHeight() : this.#clientWidth() }
    //#clientWidth() { return document.body.clientWidth }
    #clientWidth() { return document.documentElement.clientWidth }
    #clientHeight() { return document.documentElement.clientHeight }
    #gridCols() { return this.options.count }
    #gridRows() { return 1 }
    #gridInline() { return this.#clientInline() / this.options.count }
    //#gridBlock() { return this.#clientBlock() }
    #gridBlock() { console.log(this.#isVertical(), 'gridBlock:',this.#clientBlock(), this.#clientWidth(), this.#clientHeight()); return this.#clientBlock(); }
    #gridGap() { return 10 }
    #gird() {
        Css.set('--grid-cols', `${this.#gridCols()}`)
        Css.set('--grid-inline', `${this.#gridInline()}px`)
        Css.set('--grid-rows', `${this.#gridRows()}`)
        Css.set('--grid-block', `${this.#gridBlock()}px`)
        Css.set('--grid-gap', `${this.#gridGap()}px`)
    }
    #setWritingMode() {
        if (this.#isVertical() || this.#isHorizontal()) {
            Css.set('--writing-mode', this.#writingMode())
            Css.set('--text-orientation', this.#textOrientation())
            Css.set('--text-decoration', this.#textDecoration())
        }
    }
    #textOrientation() { return (this.#isVertical()) ? 'upright' : 'mixed' }
    #textDecoration() { return (this.#isVertical()) ? 'overline ' : 'underline' }
    #testText() {
        let i = 1;
        for (let el of this.el.querySelectorAll('.inner-screen')) {
            el.innerHTML = `${i}: これはテスト用の文章です。縦書き、横書きの確認などにご利用ください。`
            i += 1
        }
    }
}
window.splitScreen = new SplitScreen()
