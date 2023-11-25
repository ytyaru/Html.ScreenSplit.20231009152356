class LoadingIcon {
    constructor() { this.el = null }
    make() {
        if (this.el) { return this.el }
        this.el = document.createElement('div')
        this.el.classList.add('loading-icon')
        this.el.classList.add('book')
        for (let i=0; i<3; i++) {
            const fig = document.createElement('figure')
            fig.classList.add('page')
            this.el.appendChild(fig)
        }
        return this.el
    // <div class="loader book"><figure class="page"></figure><figure class="page"></figure><figure class="page"></figure></div>
    }
}
