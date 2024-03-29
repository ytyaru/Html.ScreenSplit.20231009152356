(function() {
class FitText {
    constructor() {
        this.logs = {} // 'width x height':{'blockIndex':0, 'text':'', 'html':''}
        this.index = -1
    }
    set(blocks) { this.blocks = blocks }
    next() {
        if (this.index < this.blocks.length) {
            this.index += 1
            return this.logs[this.size][this.index]
        } else { return null }
    }
    prev() {
        if (0 < this.index) {
            this.index -= 1
            return this.logs[this.size][this.index]
        } else { return null }
    }
    calc() {
        let startIndex = 0
        const size = `${document.documentElement.clientWidth}x${document.documentElement.clientHeight}`
        this.size = size
        //this.logs[size] = {'blockIndex':0, 'blocks':[], 'html':''}
        //this.logs[size] = {'blockIndex':[0, 0], 'html':''}
        //this.logs[size] = {'blockStartIndex':0, 'blockEndIndex':0, 'html':''}
        this.logs[size] = [] // {'blockStartIndex':0, 'blockEndIndex':0, 'html':''}

        Array.from(document.querySelectorAll('.inner-screen')).map(screen=>screen.style.visibility='hidden')
        for (let screen of document.querySelectorAll('.inner-screen')) {
            for (let i=0; i<this.blocks.length; i++) {
                const [endIndex, html] = this.#getRangedBlockIndex(screen, startIndex)
                this.logs[size].push({'blockStartIndex':startIndex, 'blockEndIndex':endIndex, 'html':html})
                /*
                const data = {'blockStartIndex':startIndex, 'blockEndIndex':endIndex, 'html':html}
                data.blockStartIndex = startIndex
                data.blockEndIndex = endIndex
                data
                this.logs[size].push(data)
                this.logs[size].blockStartIndex = startIndex
                this.logs[size].blockEndIndex = endIndex
                this.logs[size].html = html
                */
                startIndex = endIndex
                i = endIndex
            }
        }
        Array.from(document.querySelectorAll('.inner-screen')).map(screen=>screen.style.visibility='visible')
        console.log(this.logs)
    }
    #getRangedBlockIndex(screen, startIndex=0) {
        let html = ''
        const rangedBlocks = []
//        const el = document.createElement('div')
//        el.style.visibility = 'hidden' // visible, hidden, collapse, inherit
//        el.style.position = 'absolute'
//        el.classList.add('inner-screen')
//        el.style.width = Css.getFloat('width', screen)
//        el.style.height = Css.getFloat('height', screen)
//        document.body.appendChild(el)

//        screen.style.visibility = 'hidden'
        screen.innerHTML = ''
        const el = screen        
        for (let i=startIndex; i<this.blocks.length; i++) {
            html += paragraph.parse(this.blocks[i])
            el.innerHTML = html
            const rect = el.getBoundingClientRect()

            //console.log(screen.clientWidth, screen.clientHeight, el.clientWidth, el.clientHeight)
            //console.log(screen.clientWidth, screen.clientHeight, rect.width, rect.height)
            console.log(document.documentElement.clientWidth, document.documentElement.clientHeight, rect.width, rect.height)
            //console.log(Css.getFloat('width', screen), Css.getFloat('height', screen), rect.width, rect.height)
            //if (screen.clientWidth < rect.width || screen.clientHeight < rect.height) { return [i-1, html] }
            //if (screen.clientWidth < el.clientWidth || screen.clientHeight < el.clientHeight) { return [i-1, html] }
            //if (document.documentElement.clientWidth < el.clientWidth || document.documentElement.clientHeight < el.clientHeight) { return [i-1, html] }
            if (document.documentElement.clientWidth < rect.width || document.documentElement.clientHeight < rect.height) { return [i-1, html] }
        }
        return [this.blocks.length-1, html]
    }
}
window.fitText = new FitText()
})();
