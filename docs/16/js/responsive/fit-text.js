(function() {
class FitText {
    constructor() {
        this.logs = {} // 'width x height':{'blockIndex':0, 'text':'', 'html':''}
        this.index = -1
        this.pager = new Pager()
    }
    set(blocks) { this.blocks = blocks }
    #screenCount() { return Array.from(document.querySelectorAll('#screen .inner-screen')).length }
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
        console.log(this.logs)
        this.pager.init(this.logs[this.size])
    }
    #getRangedBlockIndex(screen, startIndex=0) {
        let tryHtml = ''
        let html = ''
        const rangedBlocks = []
        screen.innerHTML = ''
        const blockSize = Css.getFloat('block-size', screen)
        const el = screen
        for (let i=startIndex; i<this.blocks.length; i++) {
            //const blockHtml = paragraph.parse(this.blocks[i])
            //const blockHtml = this.#parse(this.blocks[i])
            const blockHtml = blockParser.parse(this.blocks[i])
            tryHtml += blockHtml
            el.innerHTML = tryHtml
//            const rect = el.getBoundingClientRect()
            //console.log(this.#clientBlock(), this.#clientBlockRect(rect))
            //if (this.#clientBlock() < this.#clientBlockRect(rect)) { return [i-1, html] }
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
    init(logs) { this.page = 0; this.logs = logs; this.#set(); }
    #set() {
        const screens = Array.from(document.querySelectorAll('#screen .inner-screen')) 
        for (let i=0; i<screens.length; i++) {
            screens[i].innerHTML = this.logs[(this.page*screens.length)+i].html
        }
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
window.fitText = new FitText()
})();
