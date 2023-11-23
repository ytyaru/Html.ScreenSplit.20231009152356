class SectionButton {
    constructor() { this.el = null; this.SYMBOL='§'; }
    make() {
        this.el = document.createElement('div')
        this.el.classList.add('section')
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
        this.el.addEventListener('click', async(event)=>{ this.toggle() })
    }
    /*
    openDialog() {
        micromodal.init()
    }
    #makeDialog() {
        if (!this.html) {
            this.html = `<div class="dialog" aria-hidden="true">${fitTextBlock.Logs[0]}</div>`;
            document.querySelector('body').appendChild(this.html)
        }
        return this.html
    }
    */
}
