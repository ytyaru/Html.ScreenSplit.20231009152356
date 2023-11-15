class NowTime {
    constructor() { this.el = null; this.hours=null; this.sp=null; this.minutes=null; }
    make() {
        this.el = document.createElement('div')
        this.el = this.#tagClsTxt('div', 'now-time')
        //this.hours = this.#tagClsTxt('span', 'hours text-combine', '00')
        this.hours = this.#tagClsTxt('span', 'hours', '00')
        this.sp = this.#tagClsTxt('span', 'sp', ':')
        //this.minutes = this.#tagClsTxt('span', 'minutes text-combine', '00')
        this.minutes = this.#tagClsTxt('span', 'minutes', '00')
        this.el.appendChild(this.hours)
        this.el.appendChild(this.sp)
        this.el.appendChild(this.minutes)
        this.el.style.display = 'none'
        this.toggle()
        this.#update()
        return this.el
    }
    #tagClsTxt(tag='div', cls=null, txt=null) {
        const el = document.createElement(tag)
        console.log(tag, cls, txt)
        console.log(el)
        if (cls) { for (let c of cls.split(' ')) { el.classList.add(c) } }
        if (txt) { el.textContent = txt }
        return el
    }
    toggle() { // 表示ON/OFF。display:none/inline-block。clearInterval/setInterval
        console.log(this.el.style.display)
        if ('none'===this.el.style.display) {
            this.el.style.display = 'inline-block'
            setInterval(this.#update.bind(this), 30*1000)
        } else {
            this.el.style.display = 'none'
            clearInterval(this.#update.bind(this))
        }
    }
    #update() {
        const now = new Date()
        this.hours.textContent = `${this.#zeroPad(now.getHours())}`
        this.minutes.textContent = `${this.#zeroPad(now.getMinutes())}`
    }
    #zeroPad(v, fig=2) { return v.toString().padStart(fig, '0') }
}

