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
        //this.text = van.state('')
        this.text = van.derive(()=>javel.lib.loader.text.val)
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
//const Viewer = () => { return div({class:'screen'}, InnerScreen()) }
window.javel = window.javel || {}
console.log(javel)
window.javel.lib = window.javel.lib || {}
window.javel.lib.manuscript = new Manuscript()
window.javel.lib.loader = new Loader()
//window.javel.lib.viewer = window.javel.lib.viewer || Viewer
window.javel.lib.viewer = window.javel.lib.viewer || new Viewer()
window.javel.lib.page = window.javel.lib.page || new Page()
})();
