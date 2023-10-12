class CenterSplitScreen {
    #defaultOptions = { 'count':2, 'writingMode':'horizontal' }
    make(options={}) {
        deepCopy(this.#defaultOptions).then(obj=>{
            this.options = {...obj, ...options}
            console.log(this.options)
            if (1!==this.options.count && 2!==this.options.count) { console.warn(`options.countは1または2のみ有効です。不正値${this.options.count}でしたのでデフォルト値${this.#defaultOptions.count}にリセットして処理を継続します。`); this.options.count=this.#defaultOptions.count; }
            console.log(this.options)
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
        this.#addInnerScreen()
        this.#insertCenterSplitter()
        this.resize()
        return this.el
    }
    #addInnerScreen() {
        for (let i=0; i<this.options.count; i++) {
            const inner = document.createElement('div')
            inner.classList.add('inner-screen')
            this.el.appendChild(inner)
        }
        console.log('addInnerScreen:', this.options.count)
        this.#testText()
    }
    #insertCenterSplitter() {
        if (this.options.count < 2) { return }
        const splitter = document.createElement('div')
        splitter.classList.add('splitter')
        splitter.textContent = '中央スプリッター　1/99'
        //splitter.innerHTML = `中央スプリッター　1−<span class="text-combine">99</span>`
        this.el.querySelector('.inner-screen').insertAdjacentElement('afterend', splitter)
    }
    resize() {
        this.#setWritingMode()
        console.log('writingMode:', this.options.writingMode)
        console.log('#clientWidth() ', this.#clientWidth())
        console.log('#clientHeight() ', this.#clientHeight())
        console.log('#clientInline() ', this.#clientInline())
        console.log('#clientBlock() ', this.#clientBlock())
        this.#gird()
        Css.set('--screen-block-size', `${this.#clientBlock()}px`)
        Css.set('--screen-inline-size', `${this.#clientInline()}px`)
    }
    #isVertical() { return 'vertical'===this.options.writingMode }
    #isHorizontal() { return 'horizontal'===this.options.writingMode }
    #writingMode() { return (this.#isVertical()) ? 'vertical-rl' : 'horizontal-tb' }
    #writingModeReverse() { return (this.#isVertical()) ? 'horizontal-tb' : 'vertical-rl' }
    #clientBlock() { return (this.#isVertical()) ? this.#clientWidth() : this.#clientHeight() }
    #clientInline() { return (this.#isVertical()) ? this.#clientHeight() : this.#clientWidth() }
    //#clientWidth() { return document.body.clientWidth }
    #clientWidth() { return document.documentElement.clientWidth }
    #clientHeight() { return document.documentElement.clientHeight }
    #gridCols() { return this.options.count }
    #gridRows() { return 1 }
    #gridInline() { return this.#clientInline() / this.options.count }
    #gridBlock() { return this.#clientBlock() }
    //#gridBlock() { console.log(this.#isVertical(), 'gridBlock:',this.#clientBlock(), this.#clientWidth(), this.#clientHeight()); return this.#clientBlock(); }
    //#gridGap() { return 10 }
    #gridTemplateColumns() { return (1===this.options.count) ? '1fr' : `1fr ${Css.get('--font-size')} 1fr` }
    //#gridTemplateColumns() { return (1===this.options.count) ? '1fr' : `${this.#gridTemplateColumnSize()}px ${Css.get('--font-size')} ${this.#gridTemplateColumnSize()}px` }
    //#gridTemplateColumnSize() { return (this.#clientInline() / this.options.count) - Css.getFloat('--font-size') }
    #gridTemplateRows() { return `${this.#clientBlock()}px` }
    #gridGap() { return Css.getFloat('--font-size') }
    #gird() {
        Css.set('--grid-template-columns', `${this.#gridTemplateColumns()}`)
        Css.set('--grid-template-rows', `1fr`)
        //Css.set('--grid-template-rows', `${this.#gridTemplateRows()}`)
        /*
        Css.set('--grid-cols', `${this.#gridCols()}`)
        Css.set('--grid-inline', `${this.#gridInline()}px`)
        Css.set('--grid-rows', `${this.#gridRows()}`)
        Css.set('--grid-block', `${this.#gridBlock()}px`)
        Css.set('--grid-gap', `${this.#gridGap()}px`)
        */
    }
    #setWritingMode() {
        if (this.#isVertical() || this.#isHorizontal()) {
            Css.set('--writing-mode', this.#writingMode())
            Css.set('--text-orientation', this.#textOrientation())
            Css.set('--text-decoration', this.#textDecoration())
            Css.set('--splitter-writing-mode', this.#writingModeReverse())
            Css.set('--splitter-text-orientation', this.#textOrientationReverse())
            Css.set('--splitter-text-decoration', this.#textDecorationReverse())
        }
    }
    #textOrientation() { return (this.#isVertical()) ? 'upright' : 'mixed' }
    #textDecoration() { return (this.#isVertical()) ? 'overline ' : 'underline' }
    #textOrientationReverse() { return (this.#isVertical()) ? 'mixed' : 'upright' }
    #textDecorationReverse() { return (this.#isVertical()) ? 'underline' : 'overline' }
    #testText() {
        let i = 1;
        for (let el of this.el.querySelectorAll('.inner-screen')) {
            el.innerHTML = `${i}: これはテスト用の文章です。縦書き、横書きの確認などにご利用ください。`
            i += 1
        }
    }
}
window.centerSplitScreen = new CenterSplitScreen()
