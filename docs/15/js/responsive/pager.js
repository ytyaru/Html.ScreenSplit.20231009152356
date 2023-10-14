(function() {
class Pager {
    constructor() {
        this.page = 0
        this.logs = logs
    }
    #screenCount() { return Array.from(document.querySelectorAll('#screen .inner-screen')).length }
    set() {
        const screens = Array.from(document.querySelectorAll('#screen .inner-screen')) 
        for (let i=0; i<screens.length; i++) {
            screens[i].innerHTML = this.logs[(this.page*screens.length)+i].html
        }
    }
    next() {
        if (((this.page+1)*this.#screenCount()) < this.logs.length) {
            this.page += 1
            this.set()
        }
    }
    prev() {
        if (0 < this.page) {
            this.page -= 1
            this.set()
        }
    }
}
window.pager = new Pager()
})();
