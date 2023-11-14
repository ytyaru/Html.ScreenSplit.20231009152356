class Noble { // ノンブル　現在ページを表示する
    constructor() { this.el=null; this.now=null; this.all=null; this.sp=null; }
    make() {
        this.el = this.#tagClsTxt('div', 'noble')
        this.now = this.#tagClsTxt('span', 'now', 'n')
        this.sp  = this.#tagClsTxt('span', 'sp', '/')
        this.all = this.#tagClsTxt('span', 'all', 'N')
        for (let child of [this.now, this.sp, this.all]) { this.el.appendChild(child) }
        this.#on()
        return this.el
    }
    #tagClsTxt(tag='div', cls=null, txt=null) {
        const el = document.createElement(tag)
        if (cls) { for (let c of cls.split(' ')) { el.classList.add(c) } }
        if (txt) { el.textContent = txt }
        return el
    }
    set(now, all) { this.Now = now; this.All = all; }
    set Now(page) { this.now.textContent = `${page}` }
    set All(page) { this.all.textContent = `${page}` }
    get Now() { return parseInt(this.now.textContent) }
    get All() { return parseInt(this.all.textContent) }
//    setNow(page) { this.el.querySelector('.now').textContent = `${page}` }
//    setAll(page) { this.el.querySelector('.all').textContent = `${page}` }
    toggle() { // 表示3パターン切替（now/sp/all, on/on/on, on/off/off, off/off/off）
        if (this.#isOnlyNow()) { this.#on() }
        else if (this.#isOn()) { this.#off() }
        else                   { this.#onlyNow() }
    }
    #isOn() { return [this.now, this.sp, this.all].all(el=>'inline'===el.style.display) }
    #isOff() { return [this.now, this.sp, this.all].all(el=>'none'===el.style.display) }
    #isOnlyNow() { return 'inline'===this.now.style.display && [this.sp, this.all].all(el=>'none'===el.style.display) }
    #on() { for (let el of [this.now, this.sp, this.all]) { el.style.display = 'inline' } }
    #off() {for (let el of [this.now, this.sp, this.all]) { el.style.display = 'none' } }
    #onlyNow() {
        this.now.style.display = 'inline'
        this.sp.style.display = 'none'
        this.all.style.display = 'none'
    }
}

