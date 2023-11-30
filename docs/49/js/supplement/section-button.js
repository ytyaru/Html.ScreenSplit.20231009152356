class SectionButton {
    constructor() { this.el = null; this.SYMBOL='§'; this.DIALOG_ID='book-summary-dialog'; }
    make() {
        if (this.el) { return this.el }
        this.el = document.createElement('div')
        //this.el = document.createElement('button')
        this.el.classList.add('section-button')
        this.el.setAttribute('data-micromodal-trigger', this.DIALOG_ID)
        this.el.setAttribute('role', 'button')
        this.el.innerHTML = this.SYMBOL
        this.#addListener()
        // this.setTitle()
        return this.el
        // <div class="section"><ruby>表題<rt>ひょうだい</rt></ruby>である</div>
    }
    off() { this.el.style.display = 'none' }
    on() { this.el.style.display = 'block' }
    toggle() { this.el.innerHTML = (manuscript.Meta.hasOwnProperty('title') && this.SYMBOL===this.el.textContent) ? blockParser.toEl(manuscript.Meta.title).innerHTML : this.SYMBOL }
//    setTitle() { this.on(); this.el.innerHTML = (manuscript.Meta.hasOwnProperty('title')) ? manuscript.Meta.title : '§' }
    setTitle(title) { this.on(); this.el.innerHTML = title || '§'; }
//    setTitle(title) { this.on(); this.el.innerHTML = (title || '§') + '　'; }
    #addListener() {
        console.log('#addListener()')
        //this.el.addEventListener('click', async(event)=>{ this.toggle() })
        //this.el.addEventListener('click', async(event)=>{ MicroModal.show(this.DIALOG_ID) })
        this.el.addEventListener('click', async(event)=>{ MicroModal.show(this.DIALOG_ID); console.log('DIALOGGGGGGGGG'); })
//        this.el.addEventListener('click', async(event)=>{ console.log('DIALOGGGGGGGGG'); })
    }
    setupDialog() {
        console.log(this.DIALOG_ID)
        if (document.querySelector(`#${this.DIALOG_ID}`)) { return }
        console.log(this.#dialogHtml())
        console.log(this.#dialogHtml().toElement())
        document.querySelector('body').appendChild(this.#dialogHtml().toElement())
        console.log(document.querySelector(`#${this.DIALOG_ID}`))
        //document.querySelector('body').appendChild(blockParser.toEl(this.#dialogHtml()))
        //document.querySelector('body').innerHTML += this.#dialogHtml()
        console.log(document.querySelector('body').innerHTML)
        // 閉じるアニメに必要だが、たまにクリックで表示しようとすると一瞬表示された直後に消えてしまう。そもそも終了アニメされない。
        /*
        MicroModal.init({
            disableScroll: true,
            awaitOpenAnimation: true,
            awaitCloseAnimation: true
        })
        */
        MicroModal.init()
    }
    #dialogHtml() {
        const coverHtml = fitTextBlock.Logs[0].html
        const coverEl = coverHtml.toElement()
        const title = coverEl.querySelector('h1').innerHTML
        coverEl.removeChild(coverEl.querySelector('h1'))
        const body = coverEl.innerHTML
        console.log(title)
        console.log(body)
        return this.#dialogTemplate(title, body)
        //const [title, body] = coverHtml.split('</h1>')
        //return this.#dialogTemplate(title+'</h1>', body)
    }
    #dialogTemplate(title, body) { return `
<div class="modal micromodal-slide" id="${this.DIALOG_ID}" aria-hidden="true">
<div class="modal__overlay" tabindex="-1" data-micromodal-close>
<div class="modal__container" role="dialog" aria-modal="true" aria-labelledby="${this.DIALOG_ID}-title">
<header class="modal__header">
<h1 class="modal__title" id="${this.DIALOG_ID}-title">${title}</h1>
<button class="modal__close" aria-label="Close modal" data-micromodal-close></button>
</header>
<main class="modal__content" id="${this.DIALOG_ID}-content">${body}</main>
<footer class="modal__footer">
<!--<button class="modal__btn modal__btn-primary">Continue</button>-->
<button class="modal__btn" data-micromodal-close aria-label="Close this dialog window">Close</button>
</footer>
<!--
-->
</div>
</div>
</div>` }
    /*
    #dialogHtml() { return `
<div class="modal micromodal-slide" id="${this.DIALOG_ID}" aria-hidden="true">
<div class="modal__overlay" tabindex="-1" data-micromodal-close>
<div class="modal__container" role="dialog" aria-modal="true" aria-labelledby="${this.DIALOG_ID}-title">
<header class="modal__header">
<!--<h2 class="modal__title" id="${this.DIALOG_ID}-title">${manuscript.Meta.title}</h2>-->
<h1 class="modal__title" id="${this.DIALOG_ID}-title">${blockParser.toEl(manuscript.Meta.title).innerHTML}</h1>
<button class="modal__close" aria-label="Close modal" data-micromodal-close></button>
</header>
<main class="modal__content" id="${this.DIALOG_ID}-content">
${fitTextBlock.Logs[0].html}
</main>
<footer class="modal__footer">
<!--<button class="modal__btn modal__btn-primary">Continue</button>-->
<button class="modal__btn" data-micromodal-close aria-label="Close this dialog window">Close</button>
</footer>
</div>
</div>
</div>` }
    */
}
