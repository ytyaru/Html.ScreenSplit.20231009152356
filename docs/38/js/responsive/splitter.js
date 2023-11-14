class Splitter {
    constructor() {
        this.el = null
        this.supplys = {
            'loading': new LoadingIcon(),
            'noble': new Noble(),
            'time': new NowTime(),
            'section': new BookSection(),
            'writeMode': new WritingModeButton(),
            'darkMode': new DarkModeButton(),
            'setting': new AppSetting(),
        }
    }
    make() {
        this.el = document.createElement('div')
        this.el.classList.add('splitter')
        this.el.textContent = '中央スプリッター　n/N'
        this.el.appendChild(this.supplys.loading.make())
        this.el.appendChild(this.supplys.noble.make())
        this.el.appendChild(this.supplys.time.make())
        this.el.appendChild(this.supplys.section.make())
        this.el.appendChild(this.supplys.writeMode.make())
        this.el.appendChild(this.supplys.darkMode.make())
        this.el.appendChild(this.supplys.setting.make())
        //splitter.innerHTML = `中央スプリッター　1−<span class="text-combine">99</span>`
        return this.el
    }
    setText(text) {
        if (!el) { return }
        this.el.innerHTML = `<div class="loader book"><figure class="page"></figure><figure class="page"></figure><figure class="page"></figure></div><span>${text}</span>`
    }
}
