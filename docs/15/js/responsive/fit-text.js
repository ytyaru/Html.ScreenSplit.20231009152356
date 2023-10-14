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
    /*
    next() {
        if (this.index < this.logs[this.size].length-1) {
            this.index += 1
            //this.index += this.#screenCount()
            console.log('index:', this.index)
            return this.logs[this.size][this.index]
        } else { return null }
    }
    prev() {
        if (0 < this.index) {
            this.index -= 1
            //this.index -= this.#screenCount()
            console.log('index:', this.index)
            return this.logs[this.size][this.index]
        } else { return null }
    }
    */
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
            //i = endIndex
            i = (i < endIndex) ? endIndex : i
        }
        // 画面分割数に合わせて空HTMLを作成する
        if (0===(this.#screenCount()%2) && 1===(this.logs[this.size].length%2)) { this.logs[this.size].push({'blockStartIndex':-1, 'blockEndIndex':-1, 'html':''}) }
        /*
        for (let screen of document.querySelectorAll('.inner-screen')) {
            for (let i=0; i<this.blocks.length; i++) {
                const [endIndex, html] = this.#getRangedBlockIndex(screen, startIndex)
                this.logs[size].push({'blockStartIndex':startIndex, 'blockEndIndex':endIndex, 'html':html})
                startIndex = endIndex + 1
                i = endIndex
            }
        }
        */
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
        //const blockSize = Css.get('block-size', screen)
        const el = screen
        /*
        const el = document.createElement('div')
        el.classList.add('inner-screen')
        el.style.inlineSize = Css.get('inline-size', screen)
        el.style.blockSize = Css.get('block-size', screen)
//        el.style.width = '100%'
//        el.style.height = '100%'
        el.style.position = 'absolute';
        el.style.writingMode = Css.get('--writing-mode')
        el.style.fontSize = Css.get('--font-size');
        el.style.fontSize = Css.get('--font-size');
        el.style.fontSize = Css.get('--font-size');
        el.style.letterSpacing = Css.get('--letter-spacing');
        el.style.lineHeight = Css.get('--line-height');
        el.style.padding = Css.get('padding', screen);
        document.body.appendChild(el)
        */
        for (let i=startIndex; i<this.blocks.length; i++) {
            //console.log(i, this.blocks[i])
//            html += paragraph.parse(this.blocks[i])
            const blockHtml = paragraph.parse(this.blocks[i])
            tryHtml += blockHtml
//            el.innerHTML = html
            el.innerHTML = tryHtml
            //console.log(i, this.blocks[i], html)
            //console.log(i, this.blocks[i], tryHtml)
            const rect = el.getBoundingClientRect()

            //console.log(screen.clientWidth, screen.clientHeight, el.clientWidth, el.clientHeight)
            //console.log(screen.clientWidth, screen.clientHeight, rect.width, rect.height)
            //console.log(document.documentElement.clientWidth, document.documentElement.clientHeight, rect.width, rect.height)
            //console.log(document.documentElement.clientWidth, document.documentElement.clientHeight, rect.width, rect.height, Css.get('width', el), Css.get('height', el))
            //console.log(Css.getFloat('width', screen), Css.getFloat('height', screen), rect.width, rect.height)
            //if (screen.clientWidth < rect.width || screen.clientHeight < rect.height) { return [i-1, html] }
            //if (screen.clientWidth < el.clientWidth || screen.clientHeight < el.clientHeight) { return [i-1, html] }
            //if (document.documentElement.clientWidth < el.clientWidth || document.documentElement.clientHeight < el.clientHeight) { return [i-1, html] }
            //if (document.documentElement.clientWidth < rect.width || document.documentElement.clientHeight < rect.height) { return [i-1, html] }
            console.log(this.#clientBlock(), this.#clientBlockRect(rect))
            if (this.#clientBlock() < this.#clientBlockRect(rect)) { return [i-1, html] }
            html += blockHtml
            //console.log(blockSize, ((this.#isVertical()) ? rect.width : rect.height), Css.getFloat('block-size', screen), Css.getFloat('--screen-block-size'), rect.width, rect.height, this.#clientBlockRect(rect))
            //if (blockSize < ((this.#isVertical()) ? rect.width : rect.height)) { return [i-1, html] }
            //if (blockSize < this.#clientBlockRect(rect)) { document.body.removeChild(el); return [i-1, html] }
            //if (blockSize < ((this.#isVertical()) ? rect.width : rect.height)) { document.body.removeChild(el); return [i-1, html] }
            
        }
        //document.body.removeChild(el)
        return [this.blocks.length-1, html]
    }
    #isVertical() { return this.#writingMode().startsWith('vertical') }
    #isHorizontal() { return this.#writingMode().startsWith('horizontal') }
    #writingMode() { return Css.get('--writing-mode').trim().toLowerCase() }
    #writingModeReverse() { return (this.#isVertical()) ? 'horizontal-tb' : 'vertical-rl' }
    #clientBlock() { return (this.#isVertical()) ? this.#clientWidth() : this.#clientHeight() }
    #clientBlockRect(rect) { return (this.#isVertical()) ? rect.width : rect.height }
    #clientInline() { return (this.#isVertical()) ? this.#clientHeight() : this.#clientWidth() }
    #clientWidth() { return document.documentElement.clientWidth }
    #clientHeight() { return document.documentElement.clientHeight }

}
class Pager {
    constructor() { this.page = 0; this.logs = null; }
    #screenCount() { return Array.from(document.querySelectorAll('#screen .inner-screen')).length }
    init(logs) { this.page = 0; this.logs = logs; this.#set(); }
    #set() {
        console.log('Pager.#set()')
        const screens = Array.from(document.querySelectorAll('#screen .inner-screen')) 
        for (let i=0; i<screens.length; i++) {
            console.log(screens[i], this.logs[(this.page*screens.length)+i].html)
            screens[i].innerHTML = this.logs[(this.page*screens.length)+i].html
        }
    }
    next() {
        console.log('Pager.next()')
        if (((this.page+1)*this.#screenCount()) < this.logs.length) {
            this.page += 1
            this.#set()
        }
    }
    prev() {
        console.log('Pager.prev()')
        if (0 < this.page) {
            this.page -= 1
            this.#set()
        }
    }
}

window.fitText = new FitText()
})();
