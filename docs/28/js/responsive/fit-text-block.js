(function() {
class FitTextBlock {
    constructor() {
        this.pager = new Pager()
        this.fit = new FitInlineElement() // new FitParagraph()
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
            this.logs.push({'blockStartIndex':this.startIndex, 'blockEndIndex':this.blocks.length-1, 'html':html})
            this.startIndex = this.blocks.length
        }
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
    constructor() { this.splitter=new SpanSplitter(); this.logs=null; this.blocks=[]; this.tryHtml=''; this.startIndex=0; }
    init(logs) { this.logs=logs; }
    resize() { this.tryHtml=''; this.startIndex=0; }
    addBlock(block) {
        console.debug(`FitInlineElement.addBlock`)
        if (!TextBlock.isIterd) { this.blocks.push(block) }
        let startIndex = 0
        Array.from(document.querySelectorAll('#dummy-screen .inner-screen')).map(screen=>screen.innerHTML='')
        const screen = document.querySelector('#dummy-screen .inner-screen')
        console.debug(screen.innerHTML)

        const html = this.tryHtml
        const blockHtml = blockParser.parse(block)
        console.log('blockHtml:', blockHtml)
        //const blockHtml = blockParser.parse(block).sanitaize()
        //console.log('blockHtml:', blockHtml)
        const blockHtmlEl = this.#text2El(blockHtml)
        console.log('blockHtmlEl:', blockHtmlEl)
        screen.innerHTML = this.tryHtml
        screen.appendChild(blockHtmlEl)
        console.debug('blockHtml:', blockHtml)
        console.debug('this.tryHtml:', this.tryHtml)
        console.debug(screen.innerHTML)
        console.debug(this.#isOverScreen(Array.from(screen.children).slice(-1)[0]))
        console.debug(['p'].some(n=>n===blockHtmlEl.tagName.toLowerCase()))
        console.debug(['h1','h2','h3','h4','h5','h6'].some(n=>n===blockHtmlEl.tagName.toLowerCase()))
        console.debug(blockHtmlEl.tagName.toLowerCase())
        console.debug(blockHtmlEl.childNodes)

        if (this.#isOverScreen(Array.from(screen.children).slice(-1)[0])) { // 一画面に収まらない
            if ('p'===blockHtmlEl.tagName.toLowerCase()) {
                screen.removeChild(blockHtmlEl)
                console.log(blockHtmlEl)
                this.tryHtml = this.#splitParagraph2(html, blockHtmlEl)
                console.log(this.tryHtml)
                console.debug(this.tryHtml)
                this.startIndex = this.blocks.length
                console.debug(this.logs)
            } else if (['h1','h2','h3','h4','h5','h6'].some(n=>n===blockHtmlEl.tagName.toLowerCase())) {
                screen.removeChild(blockHtmlEl)
                this.logs.push({'blockStartIndex':this.startIndex, 'blockEndIndex':this.startIndex, 'html':html})
                this.tryHtml = blockHtml
                this.startIndex = this.blocks.length
            }
        } else {screen.removeChild(blockHtmlEl);this.tryHtml += blockHtml;}
    }
    finish() { this.logs.push({'blockStartIndex':this.startIndex, 'blockEndIndex':-1, 'html':this.tryHtml}); }
    #text2El(html) {
        const el = document.createElement('div')
        console.debug(html)
        el.innerHTML = html
        return el.firstChild
    }
    #splitParagraph2(rangedHtml, blockHtmlEl) {
        console.debug('#splitParagraph2')
        console.debug(rangedHtml)
        console.debug(blockHtmlEl)
        let html = rangedHtml
        let inlineElText = ''
        const screen = document.querySelector('#dummy-screen .inner-screen')
        screen.innerHTML = html

        // 位置超過判定のため位置取得すべくTextNodeをspanで囲む。ただしTextNode以外はそのまま
        const letterSpanHtmlEl = this.#encloseSpan(blockHtmlEl)
        console.log(letterSpanHtmlEl)
        //console.debug(letterSpanHtmlEl)
        for (let el of letterSpanHtmlEl.children) {
            console.debug(el)
            inlineElText += el.outerHTML
            console.debug(inlineElText)
            screen.innerHTML = `${(rangedHtml) ? rangedHtml : ''}<p>${inlineElText}</p>` 
            console.debug(screen.innerHTML)
            console.debug(this.#clientBlock(), this.#clientBlockEl(screen), this.#elBlockPos(el), this.#elBlockPos(Array.from(Array.from(screen.children).slice(-1)[0].children).slice(-1)[0]))
            console.debug(screen.children)
            console.debug(Array.from(Array.from(screen.children).slice(-1)[0].children).slice(-1)[0])

            if (this.#isOverScreen(Array.from(Array.from(screen.children).slice(-1)[0].children).slice(-1)[0])) { // 一画面に収まらない
                console.debug(html)
                console.debug(`<p>${inlineElText}</p>`)
                this.logs.push({'blockStartIndex':this.startIndex, 'blockEndIndex':this.startIndex, 
                    'html':((html) ? html : '')+`${(inlineElText) ? '<p>'+inlineElText+'</p>' : ''}`})
                //console.debug(this.logs)
                console.log(this.logs)
                rangedHtml = ''
                html = ''
                inlineElText = el.outerHTML
                console.debug(inlineElText)
                screen.innerHTML = ''
                if (this.#clientBlock() < this.#clientBlockEl(screen)) { throw new Error('段落内にあるHTML要素のうち少なくとも一つが一画面内に収まらないほど大きいです。画面に収まる要素サイズに調整してください。') } // 一要素が一画面に収まらない
            } else {}
//            } else {inlineElText += el.outerHTML}
        }
        this.tryHtml = `${(html) ? html : ''}<p>${inlineElText}</p>`
        return this.tryHtml // 次の画面に収まる表示すべきHTMLテキスト
    }
    #encloseSpan(blockHtmlEl) {
        let html = ''
        console.log(blockHtmlEl.childNodes)
        for (let node of blockHtmlEl.childNodes) { html += this.#encloseNode(node) }
        html = `<${blockHtmlEl.tagName}>${html}</${blockHtmlEl.tagName}>`
        console.debug(blockHtmlEl)
        console.debug(html)
        console.debug(this.#text2El(html))
        return this.#text2El(html)
    }
    #encloseNode(node) {
        switch(node.nodeName) {
            //case '#text': return this.splitter.split(letterSpanHtmlEl.innerHTML)
//            case '#text': return this.splitter.split(node.textContent)
//            case '#text': return this.splitter.split(node.textContent.sanitaize())
//            case '#text': return this.splitter.split(node.textContent.sanitaize()).unsanitaize()
            case '#text': return this.splitter.split(node.textContent.sanitaize())
            default: return node.outerHTML
        }

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
    //#elBlockPos(el) { return el.getBoundingClientRect()[`${(this.#isVertical()) ? 'left' : 'bottom' }`] }
    #elBlockPos(el) {
        console.debug('elBlockPos:', 
            el,
            this.#isVertical(), 
            `${(this.#isVertical()) ? 'left' : 'bottom' }:`, el.getBoundingClientRect()[`${(this.#isVertical()) ? 'left' : 'bottom' }`],
            'left:', el.getBoundingClientRect()['left'],
            'bottom:', el.getBoundingClientRect()['bottom'],
//            `${(this.#isVertical()) ? 'x' : 'y' }:`, el.getBoundingClientRect()[`${(this.#isVertical()) ? 'x' : 'y' }`],
            'x:', el.getBoundingClientRect()['x'],
            'y:', el.getBoundingClientRect()['y'],
            'w:', el.getBoundingClientRect()['width'],
            'h:', el.getBoundingClientRect()['height'],
        );
        return el.getBoundingClientRect()[`${(this.#isVertical()) ? 'left' : 'bottom' }`] }
    #isOverScreen(el) {
        const pos = this.#elBlockPos(el)
        if (pos < 0) { return true }
        return (this.#clientBlock() < pos)
    }
}
class SpanSplitter { // innerHTML内にあるテキストを一字ずつspanで囲む。ただしruby,em,aなどのインラインHTML要素はそのまま出力する。
    split(html) {
        // <???></???>, <??? />, <???>    HTMLタグには３パターンある。正規、XML、省略。<a></a>, <br/>, <br>等。今回は正規のみ
        //html.matchAll(/(<[^<>]+>[^<>]+</([^<>]+)>)/g)
        // let matches = html.matchAll(/(<[^\/<>]+>[^<>]+<\/[^\/<>]+>)/g)
        // for (let match of matches) {console.debug(match);}
        console.debug('SpanSplitter.split:', html)
        const elIdxs = [] // {start:0, end:0}
        let [startIdx, endIdx]  = [0, 0]
        let name = null
        //for (let c of html.Graphemes) {
        for (let i=0; i<html.Graphemes.length; i++) {
            let c = html.Graphemes[i]
            let n = (i<html.Graphemes.length) ? html.Graphemes[i+1] : ''
            if (name) { // </name>まで飛ばす
                endIdx = this.#getEndTagIdx(html, i, name)
                //endIdx = this.#getEndTagIdx(html, i-1, name)
                console.debug(endIdx, {'start':startIdx, 'end':endIdx})
                elIdxs.push({'start':startIdx, 'end':endIdx})
                i = endIdx
                //startIdx = i + 1
                startIdx = i
                name = ''
            }
            if ('<'===c && '/'!==n) { // 開始タグ
                startIdx = i
                console.debug(this.#getName(html, i+1))
                // [name, i] = this.#getName(html, i+1)
                let [a, b] = this.#getName(html, i+1)
                name = a
                //i = b
                i = (-1===b) ? i : b
                console.debug(i, name)

                // 終了タグがない形
                if ('br'===name) { elIdxs.push({'start':startIdx, 'end':startIdx+name.length+1}); name=''; }
                // 終了タグがある形
                else {}
            }
        }
        console.debug(html)
        console.debug(elIdxs)
        console.debug(this.#join(html, elIdxs))
        return this.#join(html, elIdxs)
    }
    #getName(html, s) {
        if (-1<html.indexOf(' ') && -1<html.indexOf('>')) { return [html.substring(s, html.indexOf(' ')), html.indexOf('>')+1] }
        for (let i=s; i<html.Graphemes.length; i++) {
            let c = html.Graphemes[i]
            if ('>'===c) { return [html.slice(s, i).trim('/').trim(), i+1] }
        }
        return ['', -1]
    }
    #getEndTagIdx(html, s, name) {
        console.debug('getEndTagIndex:', s, name)
        if (['br'].some(n=>n===name)) { return s } // 終了タグが必ず省略されるもの
        for (let i=s; i<html.Graphemes.length; i++) {
            if ('<'!==html.Graphemes[i+0]) { continue }
            if ('/'!==html.Graphemes[i+1]) { continue }
            for (let n=0; n<name.length; n++) {
                if (name[n]!==html.Graphemes[i+2+n]) { continue }
            }
            if ('>'!==html.Graphemes[i+2+name.length]) { continue }
            //return i
            return i+2+name.length
            //return i+2+name.length+1
        }
    }
    #join(html, elIdxs) {
        let text = ''
        let lastElIdx = null

        console.log(html)
        html = html.replace(/\&(.+)\;/g, (match, p1)=>{ return `&${p1};`.unsanitaize() })
        console.log(html)

        if (0===elIdxs.length) { return html.Graphemes.map(c=>`<span>${c}</span>`).join('') }
        if (0 < elIdxs.length && 0 < elIdxs[0].start) {
            text += this.#textToSpan(html.Graphemes.slice(0, elIdxs[0].start))
            console.debug(text)
        }
        for (let i=0; i<elIdxs.length; i++) {
            if (0 < elIdxs[i].start) {
//                console.debug(html.Graphemes.slice(elIdxs[i].start, elIdxs[i].end).join(''))
//                text += html.Graphemes.slice(elIdxs[i].start, elIdxs[i].end).join('')
                console.debug(html.Graphemes.slice(elIdxs[i].start, elIdxs[i].end+1).join(''))
                text += html.Graphemes.slice(elIdxs[i].start, elIdxs[i].end+1).join('')
                console.debug(text)
                if (i+1 < elIdxs.length) { // 次のHTML要素があるなら、今のHTML要素との間にあるプレーンテキストをspan化する
//                    console.debug(html.Graphemes.slice(elIdxs[i].end, elIdxs[i+1].start))
//                    text += this.#textToSpan(html.Graphemes.slice(elIdxs[i].end, elIdxs[i+1].start))
                    console.debug(html.Graphemes.slice(elIdxs[i].end+1, elIdxs[i+1].start))
                    text += this.#textToSpan(html.Graphemes.slice(elIdxs[i].end+1, elIdxs[i+1].start))
                    console.debug(text)
                } else { // 次のHTML要素がないなら、今のHTML要素から最後のプレーンテキストまでをspan化する
//                    text += this.#textToSpan(html.Graphemes.slice(elIdxs[i].end))
                    text += this.#textToSpan(html.Graphemes.slice(elIdxs[i].end+1))
                }
            }
        }
        return text
    }
    #textToSpan(graphemes) {
        let html = ''
        for (let g of graphemes) { html += `<span>${g}</span>` }
        return html
    }
}
const spanSplitter = new SpanSplitter()
console.debug(spanSplitter.split('これはinnerHTML内テキストです。<em>HTMLタグ</em>も含みます。'))
console.debug(spanSplitter.split('　<ruby>山田<rp>（</rp><rt>やまだ</rt><rp>）</rp></ruby><ruby>太郎<rp>（</rp><rt>たろう</rt><rp>）</rp></ruby>のように人名、固有名詞にルビを振ることが多いでしょう。'))
//console.debug(spanSplitter.split('　山田《やまだ》太郎《たろう》のように人名、固有名詞にルビを振ることが多いでしょう。'))

window.fitTextBlock = new FitTextBlock()
})();
