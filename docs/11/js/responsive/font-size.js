(function() {
class FontSize {
    #fontSize
    calc() {
        if (Size.client.inline < 720) { Css.set('--column-count', '1'); Css.set(`--font-size`, '16px'); this.#fontSize=16; }
        else if (Size.client.inline  < 1024) { this.#setFontSize(1, 40) }
        else if (Size.client.inline < 1280) { this.#setFontSize(1, 45) }
        else if (Size.client.inline < 1920) { this.#setFontSize(2, 35) }
        else if (Size.client.inline < 2048) { this.#setFontSize(2, 40) }
        else { this.#setFontSize(2, 45) }
    }
    #setFontSize(columnCount, lineOfChars) {
        Css.set('--column-count', `${columnCount}`)
        const LS = Css.getFloat('--letter-spacing')
        const G = Css.getFloat('--column-gap')
        const PS = Css.getFloat('--padding-inline-start')
        const PE = Css.getFloat('--padding-inline-end')
        this.#fontSize = (Size.client.inline) / (((lineOfChars + (lineOfChars * LS) + (PS + PE)) * columnCount) + (G * (columnCount-1)))
        console.log(columnCount, lineOfChars, LS, G, this.#fontSize)
        Css.set('--font-size', `${this.#fontSize}px`)
        return this.#fontSize
    }
}
window.FontSize = new FontSize()
})();
