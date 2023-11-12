class LayoutScreen {
    #defaultOptions = { 'auto':true, 'count':0, 'writingMode':'horizontal', 'hasSplitter':true, 'lineEm':40, 'paddingEm':0.5 }
    make(options={}) {
        deepCopy(this.#defaultOptions).then(obj=>{
            this.options = {...obj, ...options}
            console.debug(this.options)
            if (1!==this.options.count && 2!==this.options.count) { this.options.auto=true; this.options.count=this.#calcCount(); }
            else { this.options.auto=false }
            this.options.lineEm = this.#lineEm()
            console.debug(this.options)
            document.body.appendChild(this.#makeScreen())
            document.body.appendChild(dummyScreen.make())
            console.debug(this.options, this.#defaultOptions)
            console.debug(this.#fontSize())
        })
    }
    remake() { // countが未指定（自動）なら画面分割数をサイズによって変更する
        if (!this.options.auto) { return }
        this.options.count = this.#calcCount()
        this.options.lineEm = this.#lineEm()
        this.el.innerHTML = ''
        this.#addInnerScreen()
        this.#insertCenterSplitter()
        this.#setText('再構成中…しばらくお待ちください')
        document.querySelector('#dummy-screen').remove()
        document.body.appendChild(dummyScreen.make())
        this.resize()
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
        this.#setText()
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
        console.debug('addInnerScreen:', this.options.count)
    }
    #hasSplitter() { return this.options.hasSplitter }
    #insertCenterSplitter() {
        if (!this.#hasSplitter()) { return }
        const splitter = document.createElement('div')
        splitter.classList.add('splitter')
        splitter.textContent = '中央スプリッター　n/N'
        //splitter.innerHTML = `中央スプリッター　1−<span class="text-combine">99</span>`
        this.el.querySelector('.inner-screen').insertAdjacentElement('afterend', splitter)
    }
    resize() {
        this.#setWritingMode()
        console.debug('writingMode:', this.options.writingMode)
        console.debug('#clientWidth() ', this.#clientWidth())
        console.debug('#clientHeight() ', this.#clientHeight())
        console.debug('#clientInline() ', this.#clientInline())
        console.debug('#clientBlock() ', this.#clientBlock())
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
    #splitterWritingMode() { return (1===this.options.count) ? this.#writingMode() : this.#writingModeReverse() }
    #clientBlock() { return (this.#isVertical()) ? this.#clientWidth() : this.#clientHeight() }
    #clientInline() { return (this.#isVertical()) ? this.#clientHeight() : this.#clientWidth() }
    #clientWidth() { return document.documentElement.clientWidth }
    #clientHeight() { return document.documentElement.clientHeight }
    #gridCols() { return this.options.count }
    #gridRows() { return 1 }
    #gridInline() { return this.#clientInline() / this.options.count }
    #gridBlock() { return this.#clientBlock() }
    #gridTemplateColumns() { return '1fr' + ((1===this.options.count) ? '' : ` ${this.#fontSize()}px 1fr`) }
    #gridTemplateRows() { return ((1===this.options.count) ? `${(this.#clientBlock() - this.#fontSize())}px ${this.#fontSize()}px` : `${this.#clientBlock()}px`) }
    //#gridTemplateRows() { return `${(this.#clientBlock() - this.#fontSize())}px` + ((1===this.options.count) ? ` ${this.#fontSize()}px` : '') }
//    #gridTemplateRows() { return `${this.#clientBlock() - this.#fontSize()}px` + ((1===this.options.count) ? ` 1fr` : '') }
    //#gridTemplateColumns() { return `1fr ${(this.#hasSplitter()) ? this.#fontSize()+'px' : ''} ${(2===this.options.count) ? '1fr' : ''}` }
    //#gridTemplateRows() { return `${this.#clientBlock()}px` }
    #gridGap() { return Css.getFloat('--font-size') }
    #gird() {
        Css.set('--grid-template-columns', `${this.#gridTemplateColumns()}`)
        Css.set('--grid-template-rows', `${this.#gridTemplateRows()}`)
        console.log('--grid-template-columns', `${this.#gridTemplateColumns()}`)
        console.log('--grid-template-rows', `${this.#gridTemplateRows()}`)
    }
    #setWritingMode() {
        if (this.#isVertical() || this.#isHorizontal()) {
            Css.set('--writing-mode', this.#writingMode())
            Css.set('--text-orientation', this.#textOrientation())
            Css.set('--text-decoration', this.#textDecoration())
//            Css.set('--splitter-writing-mode', this.#writingModeReverse())
            Css.set('--splitter-writing-mode', this.#splitterWritingMode())
            Css.set('--splitter-text-orientation', this.#splitterOrientation())
            Css.set('--splitter-text-decoration', this.#splitterDecoration())
        }
    }
    #textOrientation() { return (this.#isVertical()) ? 'upright' : 'mixed' }
    #textDecoration() { return (this.#isVertical()) ? 'overline ' : 'underline' }
    #textOrientationReverse() { return (this.#isVertical()) ? 'mixed' : 'upright' }
    #textDecorationReverse() { return (this.#isVertical()) ? 'underline' : 'overline' }
    #splitterOrientation() { return (Css.get('--splitter-writing-mode').trim().startsWith('vertical')) ? 'upright' : 'mixed' }
    #splitterDecoration() { return (Css.get('--splitter-writing-mode').trim().startsWith('vertical')) ? 'overline' : 'underline' }

    #loadingText() { this.el.querySelector('.inner-screen').innerHTML = '<h2>読込中……しばらくお待ちください</h2>' }
    #setText(text='読込中……しばらくお待ちください') { this.el.querySelector('.inner-screen').innerHTML = `<h2>${text}</h2>` }
    #testText() {
        let i = 1;
        for (let el of this.el.querySelectorAll('.inner-screen')) {
            el.innerHTML = `<h2>本のように表示したい</h2>${i}: これはテスト用の文章です。縦書き、横書きの確認などにご利用ください。${'あ'.repeat(999)}`
            i += 1
        }
    }
    setSplitterText(text) {
        const el = document.querySelector('#screen .splitter')
        if (el) { el.textContent = text }
        //if (el) { el.textContent = `中央スプリッター　1/${this.logs[this.size].length}` }
    }
}
window.layoutScreen = new LayoutScreen()
