class LoadingIcon {
    constructor() { this.el = null }
    make() {
        this.el = document.createElement('div')
        this.el.classList.add('loader')
        this.el.classList.add('book')
        for (let i=0; i<3; i++) {
            const fig = document.createElement('figure')
            this.el.classList.add('page')
            this.el.appendChild(fig)
        }
        return this.el
    // <div class="loader book"><figure class="page"></figure><figure class="page"></figure><figure class="page"></figure></div>
    }
}
