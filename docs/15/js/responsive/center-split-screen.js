class CenterSplitScreen {
    #defaultOptions = { 'count':0, 'writingMode':'horizontal', 'hasSplitter':true, 'lineEm':40, 'paddingEm':0.5 }
    make(options={}) {
        deepCopy(this.#defaultOptions).then(obj=>{
            this.options = {...obj, ...options}
            console.log(this.options)
            if (1!==this.options.count && 2!==this.options.count) { this.options.count = this.#calcCount() }
            this.options.lineEm = this.#lineEm()
            console.log(this.options)
            document.body.appendChild(this.#makeScreen())
            console.log(this.options, this.#defaultOptions)
            console.log(this.#fontSize())
        })
    }
    #calcCount() { return (1280 <= this.#clientInline()) ? 2 : 1 }
    #lineEm() { return (640 <= (this.#clientInline()/this.options.count)) ? 40 : Math.floor(((this.#clientInline()/this.options.count)-(this.#inlinePaddingEm()*16)) / (16 * (1+Css.getFloat('--letter-spacing')))) }
    #fontSize() { return (this.#clientInline() / this.options.count) / this.options.lineEm }
    #inlinePaddingEm() { return ((this.options.paddingEm * 2) * this.options.count) + (this.#hasSplitter()) ? this.options.paddingEm : 0 }
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
    #hasSplitter() { return this.options.hasSplitter && 2==this.options.count }
    #insertCenterSplitter() {
        if (!this.#hasSplitter()) { return }
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
        Css.set('--font-size', `${this.#fontSize()}px`)
        Css.set('--inner-padding', `${this.#fontSize() * this.options.paddingEm}px`)
    }
    #isVertical() { return 'vertical'===this.options.writingMode }
    #isHorizontal() { return 'horizontal'===this.options.writingMode }
    #writingMode() { return (this.#isVertical()) ? 'vertical-rl' : 'horizontal-tb' }
    #writingModeReverse() { return (this.#isVertical()) ? 'horizontal-tb' : 'vertical-rl' }
    #clientBlock() { return (this.#isVertical()) ? this.#clientWidth() : this.#clientHeight() }
    #clientInline() { return (this.#isVertical()) ? this.#clientHeight() : this.#clientWidth() }
    #clientWidth() { return document.documentElement.clientWidth }
    #clientHeight() { return document.documentElement.clientHeight }
    #gridCols() { return this.options.count }
    #gridRows() { return 1 }
    #gridInline() { return this.#clientInline() / this.options.count }
    #gridBlock() { return this.#clientBlock() }
    #gridTemplateColumns() { return (1===this.options.count) ? '1fr' : `1fr ${(this.#hasSplitter()) ? this.#fontSize()+'px' : ''} 1fr`  }
    #gridTemplateRows() { return `${this.#clientBlock()}px` }
    #gridGap() { return Css.getFloat('--font-size') }
    #gird() {
        Css.set('--grid-template-columns', `${this.#gridTemplateColumns()}`)
        Css.set('--grid-template-rows', `1fr`)
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
            el.innerHTML = `<h2>本のように表示したい</h2>${i}: これはテスト用の文章です。縦書き、横書きの確認などにご利用ください。${'あ'.repeat(999)}`
            i += 1
        }
    }

    load(url) {
        fetch(url).then((res)=>{
            const text = res.text()
        })
    }
    next() {

    }
    prev() {

    }
    first() {

    }
}
window.centerSplitScreen = new CenterSplitScreen()
