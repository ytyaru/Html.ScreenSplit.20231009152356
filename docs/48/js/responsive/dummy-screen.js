class DummyScreen { // 実際に表示する画面と同じサイズやCSSにすることで画面に収まるか判定する
    constructor() {
        this.el = null
        this.screen = null
        this.tryAddHtml = null
        this.rangedHtml = null
    }
    make() {
        console.log('DummyScreen.make()')
        const screen = document.querySelector('#screen')
        if (!screen) { throw new Error('DummyScreenを作成できません。idがscreenのHTML要素を作成してください。') }
        this.el = screen.cloneNode(true)
        this.el.setAttribute('id', 'dummy-screen')
        //document.body.appendChild(dummyScreen.make())
        //this.screen = document.querySelector('#dummy-screen .inner-screen')
        this.screen = this.el.querySelector('#dummy-screen .inner-screen')
        this.clear()
        console.log(this.screen)
        return this.el
    }
    clear() { this.screen.innerHTML = '' }
    addElement(el) { // 末尾に要素を追加する（h2, p, br）
        console.log('DummyScreen.addElement()', el)
        this.screen.appendChild(el)
        const res = this.isWithin(el)
        //if (!res) { this.screen.removeChild(el) }
        if (!res) { console.log('removeChild !!'); this.screen.removeChild(el) }
        return res   
    }
    addInline(el) { // 最後のパラグラフへ要素を追加する（span, br, ruby, em, a, mark）
        console.log('addInline()', el)
        const lastP = this.screen.querySelector('p:last-child')
        lastP.appendChild(el)
        const res = this.isWithin(el)
        //if (!res) { lastP.removeChild(el) }
        if (!res) { console.log('removeChild !!'); lastP.removeChild(el) }
        return res   
    }
    isWithin(el=null) { // 最後のパラグラフ内にある最後の要素は画面内にあるか
        el = (el) ? el : this.screen.querySelector('p:last-child > *:last-child')
        const pos = this.#elBlockPos(el)
        console.log(this.#clientBlockSize(), this.#elBlockSize(this.screen), pos)
        if (pos < 0) { return false }
        return (pos <= this.#elBlockSize(this.screen))
        //return (pos <= this.#clientBlockSize())
    }
    isWithinOnce(innerHTML, isClear=false) {
        if (isClear) { this.clear() }
        const backup = this.screen.innerHTML
        this.screen.innerHTML = innerHTML
        const isWithin = this.isWithin(dummyScreen.screen.querySelector('*:last-child'))
        console.log(isWithin)
        this.screen.innerHTML = backup
        if (!isWithin) { throw new Error('表紙が一画面内に収まりません。テキストを短くする等して一画面内に収まるようにしてください。') }
        return isWithin
    }
    #writingMode() { return Css.get('--writing-mode').trim().toLowerCase() }
    #writingModeReverse() { return (this.#isVertical()) ? 'horizontal-tb' : 'vertical-rl' }
    #isVertical() { return this.#writingMode().startsWith('vertical') }
    #isHorizontal() { return this.#writingMode().startsWith('horizontal') }
    #clientBlockSize() { return (this.#isVertical()) ? this.#clientWidth() : this.#clientHeight() }
    #clientInlineSize() { return (this.#isVertical()) ? this.#clientHeight() : this.#clientWidth() }
    #clientWidth() { return document.documentElement.clientWidth }
    #clientHeight() { return document.documentElement.clientHeight }
    #elBlockPos(el) { return el.getBoundingClientRect()[`${(this.#isVertical()) ? 'left' : 'bottom' }`] }
    #elBlockSize(el) { return el.getBoundingClientRect()[`${(this.#isVertical()) ? 'width' : 'height' }`] }

}
dummyScreen = new DummyScreen()
