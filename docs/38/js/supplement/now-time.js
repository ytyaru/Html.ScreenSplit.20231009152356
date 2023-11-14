class NowTime {
    constructor() { this.el = null }
    make() {
        this.el = document.createElement('span')
        this.el.id = 'now-time'
        this.el.style.display = 'none'
        this.toggle()
        return this.el
    }
    toggle() { // 表示ON/OFF。display:none/inline-block。clearInterval/setInterval
        console.log(this.el.style.display)
        if ('none'===this.el.style.display) {
            this.el.style.display = 'inline-block'
            setInterval(this.#update, 30*1000)
        } else {
            this.el.style.display = 'none'
            clearInterval(this.#update)
        }
    }
    #update() {
        const now = new Date()
        const h = this.#zeroPad(now.getHowers())
        const m = this.#zeroPad(now.getMinutes())
        this.el.textContent = `${h}:${m}`
    }
    #zeroPad(v, fig=2) { return v.toString().padStart(fig, '0') }
}

