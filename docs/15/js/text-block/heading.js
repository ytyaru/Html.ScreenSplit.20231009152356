(function(){
class Heading { // <h1>任意テキスト</h1>
    constructor() {
        this.ruby = new RubyParser()
        this.em = new EmParser()
    }
    parse(text) { return `<h2>` + this.ruby.parse(this.em.parse(text.split(/\r|\r?\n/).join('<br>'))) + '</h2>' }
}
class RubyParser {
    #SHORT = /([一-龠々仝〆〇ヶ]{1,50})《([^｜《》\n\r]{1,20})》/g
    #LONG = /｜([^｜《》\n\r]{1,50})《([^｜《》\n\r]{1,20})》/g
    #ESCAPE = /｜《/g
    parse(src) { return this.#escape([this.#LONG, this.#SHORT].reduce((src, reg)=>
            src.replace(reg, (match, rb, rt)=>{ return this.#toHtml(rb, rt) }), src)) }
    #escape(src) { return src.replace(this.#ESCAPE, (match)=>'《') }
    #toHtml(rb, rt) { return `<ruby>${rb}<rp>（</rp><rt>${rt}</rt><rp>）</rp></ruby>` }
}
class EmParser {
    #REGEX_DOT = /《《([^\n]{1,50}?)》》/g;
    parse(text) {
        return text.replace(this.#REGEX_DOT, (match, p1)=>{
            const text = [...p1].map(a => `<span>${a}</span>`).join('');
            return `<em class="emphasis">${text}</em>`;
        });
    }
}
window.heading = new Heading()
})()

