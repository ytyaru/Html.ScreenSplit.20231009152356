(function() {
console.log('aaaaaaaaaaaaaaa')
const { div, span, h1 } = van.tags
class Loader {
    /*
`text`|String|原稿（テキストデータ）
`url`|String|原稿（`fetch()`）
`file`|File|原稿（DnD, input type=file, FileSystemAPI）
`uuid`|String|原稿（IndexedDB内にある原稿データを取得する）
`dom`|Element|原稿（`pre`,`textarea`要素から原稿を取得する）
`path`|String|原稿（Node.js限定でパス文字列から原稿ファイルを取得する）
    */
    constructor() {
        this.text = van.state('')
        this.url = van.state('')
        this.file = van.state({})
        this.uuid = van.state('')
        this.dom = van.state({})
        this.path = van.state('')
    }
    load(text) {
        manuscript.text = text
        manuscript.blocks = van.derive(()=>(this.text) ? [...Array(10)].map((v)=>`${v+1}ページ目`) : [])
        manuscript.htmls = van.derive(()=>(this.text) ? [...Array(10)].map((v)=>`<p>${v+1}ページ目</p>`) : [])
    }
}
class Manuscript {
    constructor() {
        this.text = van.state('')
        this.body = {
            text: van.derive(()=>((this.text.val) ? `本文です。${this.text.val}` : 'ないよ')),
            blocks: van.derive(()=>(this.text.val) ? [...Array(10)].map((v)=>`${v+1}ページ目`) : []),
            html: van.derive(()=>(this.text.val) ? this.text.val : ''),
            htmls: van.derive(()=>(this.blocks) ? [...Array(10)].map((v)=>`<p>${v+1}ページ目</p>`) : []),
            length: van.derive(()=>this.text.val.length),
        }
        /*
        this.meta = {
            title: van.state(''),
            subTitle: van.state(''),
            catch: van.state(''),
            intro: van.state(''),
            genres: van.state(['']),
            selfRatings: van.state(['']),
            url: van.state(''),
            uuid: van.state(''),
            revisions: van.state([{}]),
            fileSize: van.state(0),
            charCount: van.state(0),
            author: {
                name: van.state(''),
                url: van.state(''),
                name: van.state(''),
                linkTo: van.state([{}]),
            },
            pushTo: van.state(''),
            donateTo: van.state(''),
            pullReqTo: van.state(''),
            replyTo: van.state(''),
        }
        this.body = {
            text: van.state(''),
            blocks: van.derive(()=>(this.text) ? [...Array(10)].map((v)=>`${v+1}ページ目`) : []),
            html: van.derive(()=>(this.text) ? this.text : ''),
            htmls: van.derive(()=>(this.text) ? [...Array(10)].map((v)=>`<p>${v+1}ページ目</p>`) : []),
        }
        */
    }
}
class Page {
    constructor() {
        this.now = van.state(0)
        this.all = van.state(0)
    }
}
/*
const Page = () => {
    const html = van.derive(()=>javel.lib.loader.manuscript.body.htmls[javel.lib.viewer.page])
    return div({class:'inner-screen'}, html)
}
*/
const InnerScreen = () => {
    //return [...Array(javel.lib.viewer.columnCount)].map(()=>Page())
    return [...Array(javel.lib.viewer.columnCount)].map(()=>{
        //const html = van.derive(()=>javel.lib.manuscript.text)
        //const html = van.derive(()=>[javel.lib.manuscript.text, javel.lib.manuscript.body.html])
        const html = van.derive(()=>[
            javel.lib.manuscript.text.val, 
            javel.lib.manuscript.body.text.val,
            javel.lib.manuscript.body.html.val,
        ])
        //const html = van.derive(()=>javel.lib.manuscript.body.htmls[javel.lib.page.now])
        return div({class:'inner-screen'}, html)
    })
}
class Viewer {
    constructor() {
        this.blockSize = van.state(0)
        this.inlineSize = van.state(0)
        this.columnCount = van.state(0)
        this.lineOfChars = van.state(0)
        this.padding = van.state(0) // `padding-[block|inline]-[start|end]:?em;`, `box-sizing:border-box;`
        //this.paddingBlock = van.state(0)
        //this.paddingInline = van.state(0)
        this.writingMode = van.state('horizontal-tb') // `horizontal-tb`/`vartical-rl`
        this.colorScheme = van.state('light') // `light`/`dark`
        this.showMenuMethod = van.state('') // `Fixed.[block|inline][First|Last|Middle]`, `longPress.show[Menu|Dialog]`
        this._page = new Page()
    }
    get page() { return this._page }
    dom() { return () => div({class:'screen'}, InnerScreen()) }
}
//const Viewer = () => { return div({class:'screen'}, InnerScreen()) }
window.javel = window.javel || {}
console.log(javel)
window.javel.lib = window.javel.lib || {}
window.javel.lib.manuscript = new Manuscript()
window.javel.lib.loader = new Loader()
//window.javel.lib.viewer = window.javel.lib.viewer || Viewer
window.javel.lib.viewer = window.javel.lib.viewer || new Viewer()
window.javel.lib.page = window.javel.lib.page || new Page()
window.addEventListener("keyup", (e) => {
    console.log(e.key)
    switch(e.key) {
        case 'n': { console.log('n:', javel.lib.viewer.page.now.val); return ++javel.lib.viewer.page.now.val }
        case 'p': { console.log('p:', javel.lib.viewer.page.now.val); return --javel.lib.viewer.page.now.val }
    }
});
})();
