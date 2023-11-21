class Splitter {
    constructor() {
        this.el = null
        this.loading = new LoadingIcon()
        this.noble = new Noble()
        this.time = new NowTime()
        this.section = new SectionButton()
        this.writingMode = new WritingModeButton()
        this.colorScheme = new ColorSchemeButton()
        this.setting = new SettingButton()
        /*
        this.supplys = {
            'loading': new LoadingIcon(),
            'noble': new Noble(),
            'time': new NowTime(),
            'section': new BookSection(),
            'writeMode': new WritingModeButton(),
            'darkMode': new DarkModeButton(),
            'setting': new AppSetting(),
        }
        */
    }
    make() {
        this.el = document.createElement('div')
        this.el.classList.add('splitter')
//        this.el.textContent = '中央スプリッター　n/N'
        this.el.appendChild(this.loading.make())
        this.el.appendChild(this.noble.make())
        this.el.appendChild(this.time.make())
        this.el.appendChild(this.section.make())
        this.el.appendChild(this.writingMode.make())
        this.el.appendChild(this.colorScheme.make())
        this.el.appendChild(this.setting.make())
        /*
        this.el.appendChild(this.supplys.loading.make())
        this.el.appendChild(this.supplys.noble.make())
        this.el.appendChild(this.supplys.time.make())
        this.el.appendChild(this.supplys.section.make())
        this.el.appendChild(this.supplys.writeMode.make())
        this.el.appendChild(this.supplys.darkMode.make())
        this.el.appendChild(this.supplys.setting.make())
        */
        //splitter.innerHTML = `中央スプリッター　1−<span class="text-combine">99</span>`
        return this.el
    }
    setText(text) {
        if (!el) { return }
        this.el.innerHTML = `<div class="loader book"><figure class="page"></figure><figure class="page"></figure><figure class="page"></figure></div><span>${text}</span>`
    }
}
