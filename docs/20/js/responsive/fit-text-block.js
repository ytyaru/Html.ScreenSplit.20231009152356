(function() {
class FitTextBlock {
    constructor() {
        this.pager = new Pager()
        this.clearBlock()
    }
    clearBlock() {
        this.addBlockIdx=0; this.startIndex=0; this.logs={}; this.blocks=[]; this.tryHtml='';
        this.size = `${document.documentElement.clientWidth}x${document.documentElement.clientHeight}`
        this.logs[this.size] = [] // {'blockStartIndex':0, 'blockEndIndex':0, 'html':''}
    }
    addBlock(block) {
        //this.blocks.push(block)
        if (!TextBlock.isIterd) { this.blocks.push(block) }
        let startIndex = 0
        Array.from(document.querySelectorAll('#dummy-screen .inner-screen')).map(screen=>screen.innerHTML='')
        const screen = document.querySelector('#dummy-screen .inner-screen')

        const [html, endIndex] = this.#getRangedBlockHtml(block)
        if (null!==html && -1!==endIndex) {
            this.logs[this.size].push({'blockStartIndex':this.startIndex, 'blockEndIndex':endIndex, 'html':html})
            this.startIndex = endIndex + 1
            centerSplitScreen.setSplitterText(`中央スプリッター　1/${this.logs[this.size].length}`)
        }
        // 最初の頁を表示する（未実装：前回復元時は所定頁をHTML表示する）
        if (this.logs[this.size].length===this.#screenCount()) { this.init() }
    }
    #getRangedBlockHtml(block, startIndex) {
        const screen = document.querySelector('#dummy-screen .inner-screen')
        screen.innerHTML = ''
        const el = screen

        const html = this.tryHtml
        const blockHtml = blockParser.parse(block)
        this.tryHtml += blockHtml
        el.innerHTML = this.tryHtml
        if (this.#clientBlock() < this.#clientBlockEl(el)) {
            if (''===html) { throw new Error('この段落は一画面に収まりません。複数の段落に分けてください。') }
            this.tryHtml = blockHtml
            return [html, this.blocks.length-1]
        }
        return [null, -1]
    }
    #screenCount() { return Array.from(document.querySelectorAll('#screen .inner-screen')).length }
    init() { this.pager.init(this.logs[this.size]) }
    next() { this.pager.next() }
    prev() { this.pager.prev() }
    resize() { // this.blocksはすべて読込完了している前提。つまり完了するまではresizeを呼び出すべきではない。
        this.size = `${document.documentElement.clientWidth}x${document.documentElement.clientHeight}`
        this.logs[this.size] = [] // {'blockStartIndex':0, 'blockEndIndex':0, 'html':''}
        this.init()
        for (let block of this.blocks) { this.addBlock(block) }
    }
    #isVertical() { return this.#writingMode().startsWith('vertical') }
    #isHorizontal() { return this.#writingMode().startsWith('horizontal') }
    #writingMode() { return Css.get('--writing-mode').trim().toLowerCase() }
    #writingModeReverse() { return (this.#isVertical()) ? 'horizontal-tb' : 'vertical-rl' }
    #clientBlock() { return (this.#isVertical()) ? this.#clientWidth() : this.#clientHeight() }
    #clientBlockEl(el) { return el.getBoundingClientRect()[`${(this.#isVertical()) ? 'width' : 'height' }`] }
    #clientInline() { return (this.#isVertical()) ? this.#clientHeight() : this.#clientWidth() }
    #clientWidth() { return document.documentElement.clientWidth }
    #clientHeight() { return document.documentElement.clientHeight }
}
class Pager {
    constructor() { this.page = 0; this.logs = null; }
    #screenCount() { return Array.from(document.querySelectorAll('#screen .inner-screen')).length }
    //init(logs) { this.page = 0; this.logs = logs; this.#set(); }
    init(logs) { this.page = 0; this.logs = logs; this.#set(); console.log('Pager.init()', this.logs); }
    #set() {
        const screens = Array.from(document.querySelectorAll('#screen .inner-screen')) 
        for (let i=0; i<screens.length; i++) {
            const idx = (this.page * screens.length) + i
            screens[i].innerHTML = (idx < this.logs.length) ? this.logs[idx].html : ''
        }
        //document.querySelector('#screen .splitter').textContent = `中央スプリッター　${this.page+1}/${this.logs.length}`
        centerSplitScreen.setSplitterText(`中央スプリッター　${this.page+1}/${this.logs.length}`)
    }
    next() {
        if (((this.page+1)*this.#screenCount()) < this.logs.length) {
            this.page += 1
            this.#set()
        }
    }
    prev() {
        if (0 < this.page) {
            this.page -= 1
            this.#set()
        }
    }
}
window.fitTextBlock = new FitTextBlock()
})();
