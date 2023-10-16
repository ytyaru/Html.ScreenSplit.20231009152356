(function() {
class FitTextBlock {
    constructor() {
        this.pager = new Pager()
        this.fitP = new FitParagraph()
        this.clearBlock()
    }
    clearBlock() {
        this.addBlockIdx=0; this.startIndex=0; this.logs={}; this.blocks=[]; this.tryHtml='';
        this.size = `${document.documentElement.clientWidth}x${document.documentElement.clientHeight}`
        this.logs[this.size] = [] // {'blockStartIndex':0, 'blockEndIndex':0, 'html':''}
        this.init()
    }
    addBlock(block) {
        if (!TextBlock.isIterd) { this.blocks.push(block) }
        let startIndex = 0
        Array.from(document.querySelectorAll('#dummy-screen .inner-screen')).map(screen=>screen.innerHTML='')
        const screen = document.querySelector('#dummy-screen .inner-screen')

        this.fitP.addBlock(block)

        // 最初の頁を表示する（未実装：前回復元時は所定頁をHTML表示する）
        if (this.logs[this.size].length===this.#screenCount()) { this.init() }
    }
    addBlockEnd() { this.fitP.finish(); this.init(); }
    #screenCount() { return Array.from(document.querySelectorAll('#screen .inner-screen')).length }
    init() { this.pager.init(this.logs[this.size]); this.fitP.init(this.logs[this.size]); }
    next() { this.pager.next() }
    prev() { this.pager.prev() }
    resize() { // this.blocksはすべて読込完了している前提。つまり完了するまではresizeを呼び出すべきではない。
        this.size = `${document.documentElement.clientWidth}x${document.documentElement.clientHeight}`
        this.logs[this.size] = [] // {'blockStartIndex':0, 'blockEndIndex':0, 'html':''}
        this.init()
        this.fitP.resize()
        for (let block of this.blocks) { this.addBlock(block) }
        this.addBlockEnd()
    }
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
        centerSplitScreen.setSplitterText(`中央スプリッター　${this.page+1}/${Math.ceil(this.logs.length/this.#screenCount())}`)
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
class FitParagraph {
    constructor() { this.logs=null; this.blocks=[]; this.tryHtml=''; this.startIndex=0; }
    init(logs) { this.logs=logs; }
    resize() { this.tryHtml=''; this.startIndex=0; }
    addBlock(block) {
        if (!TextBlock.isIterd) { this.blocks.push(block) }
        let startIndex = 0
        Array.from(document.querySelectorAll('#dummy-screen .inner-screen')).map(screen=>screen.innerHTML='')
        const screen = document.querySelector('#dummy-screen .inner-screen')

        const html = this.tryHtml
        const blockHtml = blockParser.parse(block)
        this.tryHtml += blockHtml
        screen.innerHTML = this.tryHtml
        if (this.#clientBlock() < this.#clientBlockEl(screen)) { // 一画面に収まらない
            if (''===html) { throw new Error('この段落は一画面に収まりません。複数の段落に分けてください。') }
            this.tryHtml = blockHtml
//            this.logs[this.size].push({'blockStartIndex':this.startIndex, 'blockEndIndex':endIndex, 'html':html})
//            this.startIndex = endIndex + 1
            //this.logs[this.size].push({'blockStartIndex':this.startIndex, 'blockEndIndex':this.blocks.length-1, 'html':html})
            this.logs.push({'blockStartIndex':this.startIndex, 'blockEndIndex':this.blocks.length-1, 'html':html})
            this.startIndex = this.blocks.length
            //centerSplitScreen.setSplitterText(`中央スプリッター　1/${this.logs[this.size].length}`)
            centerSplitScreen.setSplitterText(`中央スプリッター　1/${this.logs.length}`)
//            this.tryHtml = blockHtml
//            return [html, this.blocks.length-1]
        }
//        return [null, -1]
    }
    finish() { this.logs.push({'blockStartIndex':this.startIndex, 'blockEndIndex':-1, 'html':this.tryHtml}); }
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
class FitInlineElement {
    constructor() { this.logs=null; this.tryHtml=''; }
    init(logs) { this.logs = logs; }
    make(block) {
        if (!TextBlock.isIterd) { this.blocks.push(block) }
        let startIndex = 0
        Array.from(document.querySelectorAll('#dummy-screen .inner-screen')).map(screen=>screen.innerHTML='')
        const screen = document.querySelector('#dummy-screen .inner-screen')

        // 一画面内に収まる
        // 一画面内に収まらない

        const html = this.tryHtml
        const blockHtml = blockParser.parse(block)
        this.tryHtml += blockHtml
        screen.innerHTML = this.tryHtml
        if (this.#clientBlock() < this.#clientBlockEl(screen)) { // 一画面に収まらない
            // 段落内のどこまでなら一画面内に収まる？
            // 一画面内に収まるようblockHtmlを分割する
            // その数だけthis.logs[this.size].push({...})する


            //if (''===html) { throw new Error('この段落は一画面に収まりません。複数の段落に分けてください。') }
            if (''===html) { // 最初の段落がすでに一画面内に収まらない
                // throw new Error('この段落は一画面に収まりません。複数の段落に分けてください。')
            } else {
                this.tryHtml = blockHtml
                //this.logs[this.size].push({'blockStartIndex':this.startIndex, 'blockEndIndex':endIndex, 'html':html})
                this.logs[this.size].push({'blockStartIndex':this.startIndex, 'blockEndIndex':this.blocks.length-1, 'html':html})
                //this.startIndex = endIndex + 1
                this.startIndex = this.blocks.length
                centerSplitScreen.setSplitterText(`中央スプリッター　1/${this.logs[this.size].length}`)
            }
//            this.tryHtml = blockHtml
//            return [html, this.blocks.length-1]
        }
//        return [null, -1]
    }
    finish() {
        this.logs[this.size].push({'blockStartIndex':this.startIndex, 'blockEndIndex':-1, 'html':this.tryHtml})
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
window.fitTextBlock = new FitTextBlock()
})();
