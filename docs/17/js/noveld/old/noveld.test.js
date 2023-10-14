class NoveldTest {
    static test() {
        console.log('NoveldTest start')
        // options
        this.#testOptions(noveld.options)
        // getDefaultOptions
        this.#testOptions(noveld.getDefaultOptions())
        // setOptions
        noveld.setOptions({ruby:false}); console.assert(false===noveld.options.ruby);
        noveld.setOptions({break:false}); console.assert(false===noveld.options.break);
        noveld.setOptions({thematicBreak:false})
        console.assert(false===noveld.options.thematicBreak);
        // parse
        let src = "山《やま》\n\n\n｜ABC《えーびーしー》\n\n---\n\nおわり。"
        console.log(src.split(/\n/))
        console.log(noveld.parse(src).split(/\n/))
        console.assert(src==noveld.parse(src));
        // resetOptions
        noveld.resetOptions()
        this.#testOptions(noveld.options)
        console.log(noveld.parse(src))
        console.assert(noveld.parse(src)==`<ruby>山<rp>（</rp><rt>やま</rt><rp>）</rp></ruby>\n\n<br>\n\n<ruby>ABC<rp>（</rp><rt>えーびーしー</rt><rp>）</rp></ruby>\n\n<div class="scene-change scene-change-border"><p>◇◆◇◆</p></div>\n\nおわり。`);
        // options.thematicBreakBorder:falseのCSS値
        noveld.setOptions({thematicBreakBorder:false})
        console.log(noveld.options)
        console.log(noveld.parse(src))
        console.assert(noveld.parse(src)==`<ruby>山<rp>（</rp><rt>やま</rt><rp>）</rp></ruby>\n\n<br>\n\n<ruby>ABC<rp>（</rp><rt>えーびーしー</rt><rp>）</rp></ruby>\n\n<div class="scene-change"><p>◇◆◇◆</p></div>\n\nおわり。`);
        // options.thematicBreakText:＊のpテキストノード値
        noveld.setOptions({thematicBreakText:'＊'})
        console.log(noveld.options)
        console.log(noveld.parse(src))
        console.assert(noveld.parse(src)==`<ruby>山<rp>（</rp><rt>やま</rt><rp>）</rp></ruby>\n\n<br>\n\n<ruby>ABC<rp>（</rp><rt>えーびーしー</rt><rp>）</rp></ruby>\n\n<div class="scene-change"><p>＊</p></div>\n\nおわり。`);
        
        console.log('%cOK! NoveldTest', `color:green; background:white;`)
    }
    static #testOptions(options) {
        console.assert(['ruby', 'break', 'thematicBreak'].every(key=>noveld.options.hasOwnProperty(key)))
        console.assert(options.ruby)
        console.assert(options.break)
        console.assert(options.thematicBreak)
        console.assert(options.thematicBreakBorder)
        console.assert('◇◆◇◆'===options.thematicBreakText)
    }
}
