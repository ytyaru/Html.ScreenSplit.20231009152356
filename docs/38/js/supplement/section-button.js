class SectionButton {
    constructor() { this.el = null }
    make() {
        this.el = document.createElement('div')
        this.el.classList.add('section')
        this.setTitle()
        return this.el
        // <div class="section"><ruby>表題<rt>ひょうだい</rt></ruby>である</div>
    }
    off() { this.el.style.display = 'none' }
    on() { this.el.style.display = 'block' }
    setTitle(title) { this.on(); this.el.innerHTML = title || '§'; }
}
