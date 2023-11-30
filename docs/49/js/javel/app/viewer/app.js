(function() {
const { div, span, h1, p, button } = van.tags
class Loader {
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
/*
class Page {
    constructor() {
        this.now = van.state(0)
        this.all = van.state(0)
    }
}
*/
class MenuButton {
    constructor() {
        this.value = van.state('')
        this.icon = van.state(0)
        this.showable = van.state(0)
    }
    dom() { return button({
        type:'button', class:`${this.constructor.name.toChain()}`, style:this.#style(),
        onclick:()=>this.onClick(),
        }, this.icon)
    }
    onClick(e) { alert(`「${this.constructor.name.toChain()}」ボタンを押したね`) }
    //dom() { return div({class:`${this.constructor.name.toChain()}`, style:this.#style()}, span(this.icon)) }
    //#style() { return `box-sizing:border-box; border:1px solid black; padding:0.5em;` }
    #style() { return `box-sizing:border-box; border:1px solid black; padding:0.5em;` }
    toggleIconSet() {

    }
    toggleIcon() {

    }
}
class LoadingIcon extends MenuButton {
    constructor() {
        super()
        this.icon.val = '🔃'
    }
}
class NobleButton extends MenuButton {
    constructor() {
        super()
        this.icon.val = 'n/N'
    }
    onClick(e) { alert(`頁数を知りたいか？`) }
}
class NowTimeButton extends MenuButton {
    constructor() {
        super()
        this.icon.val = '00:00'
    }
}
class BookInfoButton extends MenuButton {
    constructor() {
        super()
        this.icon.val = '§'
    }
}
class WritingModeButton extends MenuButton {
    constructor() {
        super()
        this.icon.val = 'Ｚ'
    }
}
class ColorSchemeButton extends MenuButton {
    constructor() {
        super()
        this.icon.val = '☀'
    }
}
class FullScreenButton extends MenuButton {
    constructor() {
        super()
        this.icon.val = '全'
    }
}
class SettingButton extends MenuButton {
    constructor() {
        super()
        this.icon.val = '⚙'
    }
}
class Menu {
    constructor() {
        this.loading = new LoadingIcon()
        this.noble = new NobleButton()
        this.time = new NowTimeButton()
        this.info = new BookInfoButton()
        this.writingMode = new WritingModeButton()
        this.colorScheme = new ColorSchemeButton()
        this.fullScreen = new FullScreenButton()
        this.setting = new SettingButton()
    }
    dom() { return this.#dom() }
    #dom() { return div({class:'menu', style:()=>this.#style()}, 
        this.loading.dom(),
        this.noble.dom(),
        this.time.dom(),
        this.info.dom(),
        this.writingMode.dom(),
        this.colorScheme.dom(),
        this.fullScreen.dom(),
        this.setting.dom(),
    )}
    #style() { return `display:flex;` }
}
class Body {
    constructor() {
        this.htmls = van.state()
        this.htmls.val = [h1('本の見出し'), p('本の本文。')]
    }
    get dom() { return this.#dom() }
    //#dom() { return ()=>div({class:'body'}, this.htmls.val.flat()) }
    //#dom() { return ()=>div({class:'body'}, ()=>this.htmls.val.flat()) }
    //#dom() { return ()=>div({class:'body'}, ()=>this.htmls.val) }
    //#dom() { return ()=>div({class:'body'}, ()=>this.htmls) }
    //#dom() { return ()=>div({class:'body'}, this.htmls) }
    #dom() { return ()=>div({class:'body'}, this.htmls.val) }
}
class Dialog {
    constructor() {
//        this.content = van.state('')
//        this.content.val = div(h1('ダイアログ'), p('これはダイアログです。'))
        this.showable = van.state(1)
//        this.showable.val = 0
        this.doms = van.state(null)
        this.doms.val = [h1('ダイアログ'), p('これはダイアログです。')]
    }
    get dom() { return this.#dom() }
    #dom() { return ()=>div({class:'dialog', style:()=>this.#style()}, 
        div({class:'overlay'}, 
            div({class:'content'}, 
                this.doms.val))) }
//                ()=>this.content.val))) }
    #style() { return `display:${(0===this.showable) ? 'none' : 'block'}` }
}

class Screen {
    constructor() {
        this.body = new Body()
        this.menu = new Menu()
//        this.body.htmls.val = [h1('変更したよ')]
    }
    get dom() { return this.#dom() }
    #dom() { return ()=>div({class:'screen'}, this.body.dom(), this.menu.dom()) }
    /*
    #InnerScreen() { return [...Array(javel.lib.viewer.columnCount.val)].map(()=>{
            //const html = van.derive(()=>javel.lib.manuscript.text)
            //const html = van.derive(()=>javel.lib.manuscript.htmls)
            //const html = van.derive(()=>[javel.lib.manuscript.text, javel.lib.manuscript.body.html])
            //const html = van.derive(()=>[
            //    javel.lib.manuscript.text.val, 
            //    javel.lib.manuscript.body.text.val,
            //    javel.lib.manuscript.body.html.val,
            //])
            const html = van.derive(()=>javel.lib.manuscript.body.htmls.val[javel.lib.page.now.val])
            return div({class:'inner-screen'}, html)
        })
    }
    #dom() { return ()=>div({class:'screen'}, this.#InnerScreen(), this.menu.dom()) }
    */
}
class Viewer {
    constructor() {
        this.ID = 'javel-viewer'
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
        this.page = {
            'now': van.state(0),
            'all': van.state(0),
        }
//        this._page = new Page()
        this.screen = new Screen()
        this.dialog = new Dialog()
    }
//    get page() { return this._page }
    #dom() { return () => div({id:this.ID}, this.screen.dom(), this.dialog.dom()) }
    init() {
        if (document.querySelector(this.ID)) { return }
        van.add(document.body, this.#dom())
        //van.add(document.body, javel.lib.viewer.dom())
        window.addEventListener("keyup", (e) => {
            console.log(e.key)
            switch(e.key) {
                case 'n': { console.log('n:', javel.lib.viewer.page.now.val); return ++javel.lib.viewer.page.now.val }
                case 'p': { console.log('p:', javel.lib.viewer.page.now.val); return --javel.lib.viewer.page.now.val }
            }
        });
    }
}
//const Viewer = () => { return div({class:'screen'}, InnerScreen()) }
window.javel = window.javel || {}
console.log(javel)
window.javel.lib = window.javel.lib || {}
window.javel.lib.manuscript = new Manuscript()
window.javel.lib.loader = new Loader()
//window.javel.lib.viewer = window.javel.lib.viewer || Viewer
//window.javel.lib.viewer = window.javel.lib.viewer || new Viewer()
window.javel.viewer = window.javel.viewer || new Viewer()
window.javel.lib.page = window.javel.lib.page || new Page()
})();
