(function() {
class FitTextBlock {
    constructor() {
        /*
        this.blocks = []
        this.logs = {} // 'width x height':{'blockIndex':0, 'text':'', 'html':''}
        this.index = -1
        this.tryHtml = ''
        this.startIndex = 0
        this.addBlockIdx = 0
        */
        this.pager = new Pager()
        this.clearBlock()
    }
    clearBlock() {
        this.addBlockIdx=0; this.startIndex=0; this.logs={}; this.blocks=[]; this.tryHtml='';
        this.size = `${document.documentElement.clientWidth}x${document.documentElement.clientHeight}`
        this.logs[this.size] = [] // {'blockStartIndex':0, 'blockEndIndex':0, 'html':''}
    }
    addBlock(block) {
//        console.log('fitTextBlock.addBlock')
        this.blocks.push(block)
        let startIndex = 0
        //const size = `${document.documentElement.clientWidth}x${document.documentElement.clientHeight}`
        //this.size = size
        //this.logs[this.size] = [] // {'blockStartIndex':0, 'blockEndIndex':0, 'html':''}

        Array.from(document.querySelectorAll('#dummy-screen .inner-screen')).map(screen=>screen.innerHTML='')
//        Array.from(document.querySelectorAll('#dummy-screen .inner-screen')).map(screen=>screen.style.visibility='hidden')
        const screen = document.querySelector('#dummy-screen .inner-screen')

        const [html, endIndex] = this.#getRangedBlockHtml(block)
        if (null!==html && -1!==endIndex) {
            this.logs[this.size].push({'blockStartIndex':this.startIndex, 'blockEndIndex':endIndex, 'html':html})
            //console.log(this.logs[this.size].length, html, endIndex)
//            console.log(this.logs[this.size].length, this.logs[this.size])
//            console.log(this.logs.length, this.logs, this.blocks)
//            console.log(this.logs[this.size].length)
            this.startIndex = endIndex + 1
            //this.startIndex = endIndex

            document.querySelector('#screen .splitter').textContent = `中央スプリッター　1/${this.logs[this.size].length}`
        }
        //console.log(this.logs[this.size].length, html, endIndex)
        // 最初の頁を表示する（未実装：前回復元時は所定頁をHTML表示する）
        if (this.logs[this.size].length===this.#screenCount()) { this.pager.init(this.logs[this.size]) }

        //this.startIndex += 1
//        Array.from(document.querySelectorAll('#dummy-screen .inner-screen')).map(screen=>screen.style.visibility='visible')
        //return this.logs[this.size].length
        /*
        for (let i=0; i<this.blocks.length; i++) {
            const [endIndex, html] = this.#getRangedBlockIndex(screen, startIndex)
            this.logs[size].push({'blockStartIndex':startIndex, 'blockEndIndex':endIndex, 'html':html})
            startIndex = endIndex + 1
            i = (i < endIndex) ? endIndex : i
        }
        // 画面分割数に合わせて空HTMLを作成する
        if (0===(this.#screenCount()%2) && 1===(this.logs[this.size].length%2)) { this.logs[this.size].push({'blockStartIndex':-1, 'blockEndIndex':-1, 'html':''}) }
        */
        /*
        Array.from(document.querySelectorAll('.inner-screen')).map(screen=>screen.style.visibility='visible')
        console.debug(this.logs)
        this.pager.init(this.logs[this.size])
        */
    }
    #getRangedBlockHtml(block, startIndex) {
        const screen = document.querySelector('#dummy-screen .inner-screen')
        screen.innerHTML = ''
        const el = screen

        const html = this.tryHtml
        const blockHtml = blockParser.parse(block)
        this.tryHtml += blockHtml
        el.innerHTML = this.tryHtml
        //if (this.#clientBlock() < this.#clientBlockEl(el)) { return [startIndex, html] }
        if (this.#clientBlock() < this.#clientBlockEl(el)) {
            if (''===html) { throw new Error('この段落は一画面に収まりません。複数の段落に分けてください。') }
            this.tryHtml = blockHtml
            //return [startIndex, html]
            //return html
            return [html, this.blocks.length-1]
        }
        //html += blockHtml
        // return [this.blocks.length-1, html]
        return [null, -1]
    }


    set(blocks) { this.blocks = blocks }
    #screenCount() { return Array.from(document.querySelectorAll('#screen .inner-screen')).length }
    init() { this.pager.init() }
    next() { this.pager.next() }
    prev() { this.pager.prev() }
    calc() {
        let startIndex = 0
        const size = `${document.documentElement.clientWidth}x${document.documentElement.clientHeight}`
        this.size = size
        this.logs[size] = [] // {'blockStartIndex':0, 'blockEndIndex':0, 'html':''}

        Array.from(document.querySelectorAll('.inner-screen')).map(screen=>screen.innerHTML='')
        Array.from(document.querySelectorAll('.inner-screen')).map(screen=>screen.style.visibility='hidden')
        const screen = document.querySelector('.inner-screen')

        for (let i=0; i<this.blocks.length; i++) {
            const [endIndex, html] = this.#getRangedBlockIndex(screen, startIndex)
            this.logs[size].push({'blockStartIndex':startIndex, 'blockEndIndex':endIndex, 'html':html})
            startIndex = endIndex + 1
            i = (i < endIndex) ? endIndex : i
        }
        // 画面分割数に合わせて空HTMLを作成する
        if (0===(this.#screenCount()%2) && 1===(this.logs[this.size].length%2)) { this.logs[this.size].push({'blockStartIndex':-1, 'blockEndIndex':-1, 'html':''}) }

        Array.from(document.querySelectorAll('.inner-screen')).map(screen=>screen.style.visibility='visible')
        console.debug(this.logs)
        this.pager.init(this.logs[this.size])
    }
    /*
    *#rangedBlockIndexIter() {
        let tryHtml = ''
        let html = ''
        let idx = 0
        const screen = document.querySelector('#screen .inner-screen')
        //screen.style.visibility='hidden'
        screen.innerHTML = ''
        //screen.style.visibility='visible'
        for (let [block, i] of TextBlock.iter(true)) {
            const blockHtml = blockParser.parse(block)
            tryHtml += blockHtml
            screen.innerHTML = tryHtml
            //if (this.#clientBlock() < this.#clientBlockEl(screen)) { return [i-1, html] }
            //if (this.#clientBlock() < this.#clientBlockEl(screen)) { yield [i-1, html] }
            if (this.#clientBlock() < this.#clientBlockEl(screen)) {
                this.logs[this.size].push({'blockStartIndex':idx, 'blockEndIndex':i-1, 'html':html})
                yield [i-1, html]
            }
            html += blockHtml
            idx = i
        }
        //return [idx, html]
        yield [idx, html]

        // 画面分割数に合わせて空HTMLを作成する
        if (0===(this.#screenCount()%2) && 1===((idx+1)%2)) {
            this.logs[this.size].push({'blockStartIndex':-1, 'blockEndIndex':-1, 'html':''})
            yield [-1, '']
        }
    }
    */
    #getRangedBlockIndex(screen, startIndex=0) {
        let tryHtml = ''
        let html = ''
        const rangedBlocks = []
        screen.innerHTML = ''
        const el = screen
        for (let i=startIndex; i<this.blocks.length; i++) {
            const blockHtml = blockParser.parse(this.blocks[i])
            tryHtml += blockHtml
            el.innerHTML = tryHtml
            if (this.#clientBlock() < this.#clientBlockEl(el)) { return [i-1, html] }
            html += blockHtml
        }
        return [this.blocks.length-1, html]
    }
    /*
    #parse(block) {
        if ('#'===block.trim()) { }// 改段/改頁
        else if ('==='===block.trim()) { } // 改頁
        else if (block.startsWith('# ')) { return heading.parse(block.slice(2)) } // 見出し
        else { return paragraph.parse(block) } // 段落
    }
    */
    #isVertical() { return this.#writingMode().startsWith('vertical') }
    #isHorizontal() { return this.#writingMode().startsWith('horizontal') }
    #writingMode() { return Css.get('--writing-mode').trim().toLowerCase() }
    #writingModeReverse() { return (this.#isVertical()) ? 'horizontal-tb' : 'vertical-rl' }
    #clientBlock() { return (this.#isVertical()) ? this.#clientWidth() : this.#clientHeight() }
    #clientBlockEl(el) { return el.getBoundingClientRect()[`${(this.#isVertical()) ? 'width' : 'height' }`] }
//    #clientBlockRect(el) { return (this.#isVertical()) ? rect.width : rect.height }
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
            //screens[i].innerHTML = ((this.page*screens.length)+i < this.logs.length) ? this.logs[(this.page*screens.length)+i].html : ''
//            screens[i].innerHTML = this.logs[(this.page*screens.length)+i].html
        }
        document.querySelector('#screen .splitter').textContent = `中央スプリッター　${this.page+1}/${this.logs.length}`
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
