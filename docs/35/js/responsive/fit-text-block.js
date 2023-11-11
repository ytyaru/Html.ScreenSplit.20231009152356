(function() {
class FitTextBlock {
    constructor() {
        this.pager = new Pager()
        this.fit = new FitElement()
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

        this.fit.addBlock(block)
        //this.fit.addBlock(block.sanitaize())
        this.pager.setSplitterText()

        // 最初の頁を表示する（未実装：前回復元時は所定頁をHTML表示する）
        if (this.logs[this.size].length===this.#screenCount()) { this.init() }
    }
    addBlockEnd() { this.fit.finish(); this.init(); }
    #screenCount() { return Array.from(document.querySelectorAll('#screen .inner-screen')).length }
    init() { this.pager.init(this.logs[this.size]); this.fit.init(this.logs[this.size]); }
    next() { this.pager.next() }
    prev() { this.pager.prev() }
    resize() { // this.blocksはすべて読込完了している前提。つまり完了するまではresizeを呼び出すべきではない。
        this.size = `${document.documentElement.clientWidth}x${document.documentElement.clientHeight}`
        if (!this.logs.hasOwnProperty(this.size)) { 
            this.logs[this.size] = []
            this.init()
            this.fit.resize()
            for (let block of this.blocks) { this.addBlock(block) }
            this.addBlockEnd()
        } else { this.init(); this.fit.resize(); } // 既存のlogs[size]を使い回す（再計算しない）
    }
}
class Pager {
    constructor() { this.page = 0; this.logs = null; }
    #screenCount() { return Array.from(document.querySelectorAll('#screen .inner-screen')).length }
    //init(logs) { this.page = 0; this.logs = logs; this.#set(); }
    init(logs) { this.page = 0; this.logs = logs; this.#set(); console.debug('Pager.init()', this.logs); }
    #set() {
        const screens = Array.from(document.querySelectorAll('#screen .inner-screen')) 
        for (let i=0; i<screens.length; i++) {
            const idx = (this.page * screens.length) + i
            screens[i].innerHTML = (idx < this.logs.length) ? this.logs[idx].html : ''
        }
        this.setSplitterText()
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
    setSplitterText() {
        centerSplitScreen.setSplitterText(`中央スプリッター　${this.page+1}/${Math.ceil(this.logs.length/this.#screenCount())}`)
    }
}
class FitElement {
    constructor() { this.spanner=new TextNodeSpan(); this.logs=null; this.blocks=[]; this.tryHtml=''; this.startIndex=0; }
    init(logs) { this.logs=logs; }
    resize() { this.tryHtml=''; this.startIndex=0; }
    finish() { this.logs.push({'blockStartIndex':this.startIndex, 'blockEndIndex':-1, 'html':dummyScreen.screen.innerHTML}); dummyScreen.clear(); }
    addBlock(block) {
        console.log(block)
        console.log(dummyScreen.screen.innerHTML)
        if (!TextBlock.isIterd) { this.blocks.push(block) }
        const blockHtml = blockParser.parse(block)
        const blockEl = this.spanner.text2El(blockHtml)
        if ('p'===blockEl.tagName.toLowerCase()) {
            // ブロックごと入るか試みる
            let isWithin = dummyScreen.addElement(blockEl)
            console.log(dummyScreen.screen.innerHTML)
            if (isWithin) { return }
            console.log(dummyScreen.screen.innerHTML)
            // パラグラフ内の子要素をノードや文に細分化して入るか試みる
            this.#addParagraphInlines(blockEl)
        } else if (['h1','h2','h3','h4','h5','h6'].some(n=>n===blockEl.tagName.toLowerCase())) {
            // ブロックごと入るか試みる
            let isWithin = dummyScreen.addElement(blockEl)
            if (isWithin) { return }
            // 画面内確定
            this.logs.push({'blockStartIndex':this.startIndex, 
                            'blockEndIndex':this.startIndex, 
                            'html':dummyScreen.screen.innerHTML})
            // 次の画面へ持ち越し
            dummyScreen.clear()
            dummyScreen.addElement(blockEl)
        }
        this.startIndex += 1
    }
    #addParagraphInlines(p) {
        const before = dummyScreen.screen.innerHTML
        dummyScreen.addElement(document.createElement('p'))
        for (let node of p.childNodes) { // Node単位
            const el = this.spanner.node2El(node)
            if (dummyScreen.addInline(el)) { continue }
            for (let sentence of this.spanner.splitSentence(el)) { // 文単位
                if (dummyScreen.addInline(sentence)) { continue }
                // 画面内確定
                this.logs.push({'blockStartIndex':this.startIndex, 
                                'blockEndIndex':this.startIndex, 
                                'html':dummyScreen.screen.innerHTML})
                // 次の画面へ持ち越し
                dummyScreen.clear()
                if (!dummyScreen.screen.querySelector('p')) { dummyScreen.addElement(document.createElement('p')) }
                dummyScreen.addInline(sentence)
            }
        }
        if (before===dummyScreen.screen.innerHTML) { throw new Error('最小単位一つさえ一画面に収まりません。') }
    }
}
class TextNodeSpan {
    node2El(node) {
        console.log('node2El()')
        switch(node.nodeName) {
            case '#text': return this.text2El(`<span class="text-node">${node.textContent.sanitaize()}</span>`)
            default: return this.text2El(node.outerHTML)
        }
    }
    splitSentence(el) {
        console.log('splitSentence()')
        if ('span'===el.tagName.toLowerCase() && el.classList.contains('text-node')) { return this.#splitSentence(el) }
        else { return el }
    }
    splitLetter(el) {
        if ('span'===el.tagName.toLowerCase())
            if (el.classList.contains('text-node') || 
                el.classList.contains('sentence') || 
                el.classList.contains('sentence-after')) { return el.textContent.Graphemes.map(g=>this.text2El(`<span>${g}</span>`)) }
            else { return el }
        else { return el }
    }
    #splitSentence(span) {
        const text = span.textContent.replace('。「', '。　「') // 。「だと「が文末になってしまうバグがあるので対応する
        return text.Sentences.map(s=>this.text2El(`<span class="sentence">${s.replace(/^　「/, '「')}</span>`))
//        console.log(span.textContent)
//        console.log(span.textContent.Sentences)
//        return span.textContent.Sentences.map(s=>this.text2El(`<span class="sentence">${s}</span>`))
    }
//    #splitSentence(span) { return span.textContent.Sentences.map(s=>this.text2El(`<span class="sentence">${s}</span>`)) }
    /*
    #splitSentence(span) {
        const text = span.textContent
        console.log('#splitSentence()', text)
        const sentences = []
        const regex = /[。]/g
        const periodIdxs = text.Graphemes.map((g, i)=>('。'===g) ? i : -1).filter(i=>-1 < i)
        if (periodIdxs) {
            let s = 0
            let sentence = null
            for (let idx of periodIdxs) {
                sentences.push('<span class="sentence">'+text.Graphemes.slice(s, idx+1).join('')+'</span>')
                s = idx+1
            }
            if (s < text.Graphemes.length-1) { sentences.push('<span class="sentence-after">'+text.Graphemes.slice(s).join('')+'</span>') }
            console.log(sentences.join(''))
            return sentences.map(s=>this.text2El(s))
        } else { return span }
    }
    */
    text2El(html) {
        const el = document.createElement('div')
        el.innerHTML = html
        return el.firstChild
    }
}
window.fitTextBlock = new FitTextBlock()
})();
