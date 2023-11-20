class NowTime {
    constructor() { this.el = null; this.clocks = [new DigitalClock(), new EmojiClock()]; this.selected = 0;}
    make() {
        this.el = this.#tagClsTxt('div', 'now-time')
        for (let clock of this.clocks) { this.el.appendChild(clock.make()) }
        this.#addListener()
        this.toggle()
        return this.el
    }
    toggle() {
        this.selected += 1
        if (this.clocks.length <= this.selected) { this.selected = 0 }
        for (let i=0; i<this.clocks.length; i++) {
            if (i===this.selected) { this.clocks[i].show() }
            else { this.clocks[i].hide() }
        }
    }
    #tagClsTxt(tag='div', cls=null, txt=null) {
        const el = document.createElement(tag)
        console.log(tag, cls, txt)
        console.log(el)
        if (cls) { for (let c of cls.split(' ')) { el.classList.add(c) } }
        if (txt) { el.textContent = txt }
        return el
    }
    #addListener() { this.el.addEventListener('click', async(event)=>{ this.toggle() }) }
}
class DigitalClock {
    constructor() { this.el = null; this.hours=null; this.sp=null; this.minutes=null; this.type=null; }
    make() {
        this.el = this.#tagClsTxt('div', 'now-time digital-clock')
        this.sp = this.#tagClsTxt('span', 'sp', ':')
        //this.hours = this.#tagClsTxt('span', 'hours', '00')
        //this.minutes = this.#tagClsTxt('span', 'minutes', '00')
        this.hours = this.#tagClsTxt('span', 'hours text-combine', '00')
        this.minutes = this.#tagClsTxt('span', 'minutes text-combine', '00')
        for (let child of [this.hours, this.sp, this.minutes]) { this.el.appendChild(child) }
        this.el.style.display = 'none'
        this.hide()
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
    show() {
        this.el.style.display = 'inline-block'
        clearInterval(this.#update.bind(this))
        setInterval(this.#update.bind(this), 30*1000)
        this.#update()
    }
    hide() {
        this.el.style.display = 'none'
        clearInterval(this.#update.bind(this))
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
class EmojiClock {
    constructor() { this.el = null; this.hours=null; this.sp=null; this.minutes=null; this.type=null; this.symbols = ['🕛','🕧','🕐','🕜','🕑','🕝','🕒','🕞','🕓','🕟','🕔','🕠','🕕','🕡','🕖','🕢','🕗','🕣','🕘','🕤','🕙','🕥','🕚','🕦'];}
    make() {
        this.el = document.createElement('div')
        this.el = this.#tagClsTxt('div', 'now-time emoji-clock')
        this.el.style.display = 'none'
        this.hide()
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
    show() {
        this.el.style.display = 'inline-block'
        clearInterval(this.#update.bind(this))
        setInterval(this.#update.bind(this), 30*1000)
        this.#update()
    }
    hide() {
        this.el.style.display = 'none'
        clearInterval(this.#update.bind(this))
    }
    toggle() { // 表示ON/OFF。display:none/inline-block。clearInterval/setInterval
        console.log(this.el.style.display)
        if ('none'===this.el.style.display) {
            this.el.style.display = 'inline-block'
            setInterval(this.#update.bind(this), 15*60*1000)
        } else {
            this.el.style.display = 'none'
            clearInterval(this.#update.bind(this))
        }
    }
    #update() {
        const now = new Date()
        // tick=30分を1とする。00:00を0とする。0〜23の24状態。12時間毎＋30分毎
        const h = (now.getHours() % 12) * 2         // (0〜11) * 2
        const m = Math.floor(now.getMinutes() / 30) // 0〜1
        const tick = h + m
        this.el.textContent = this.symbols[tick]
// 🕛12時 🕧12時半 🕐 1時 🕜 1時半
// 🕑 2時 🕝 2時半 🕒 3時 🕞 3時半
// 🕓 4時 🕟 4時半 🕔 5時 🕠 5時半
// 🕕 6時 🕡 6時半 🕖 7時 🕢 7時半
// 🕗 8時 🕣 8時半 🕘 9時 🕤 9時半
// 🕙10時 🕥10時半 🕚11時 🕦11時半
    }
}
