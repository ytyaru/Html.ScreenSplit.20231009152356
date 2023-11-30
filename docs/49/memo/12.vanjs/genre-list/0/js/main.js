window.addEventListener('DOMContentLoaded', (event) => {
    const { h1, div, span, select, option } = van.tags
    const WRITING_MODES = ['horizontal-tb', 'vertical-rl']
    const writingMode = van.state('horizontal-tb')
    const GenreList = (genres, delimiter='>') => {
        const items = genres.join(`,${delimiter},`).split(',')
        const spans = items.map((item, i)=>((0 === (i % 2))) ? span(item) : span({style:()=>`padding-inline:0.5em; display:inline-block; transform:scale(0.75);`}, item))
        return div({class:'genre-breadcrumb', style:'display:flex;'}, spans)
    }
    van.add(document.body, h1('配列からパンくずリストを作る'))
    van.add(document.body, GenreList(['文書','創作','小説','一般文芸・文学']))
    van.add(document.body, select({
        id:'writing-mode-select',
        oninput:(e)=>{
            writingMode.val = WRITING_MODES[e.target.selectedIndex]
            document.querySelector(':root').style.setProperty('--writing-mode', writingMode.val)
        }},
        WRITING_MODES.map(item=>option({value:item}, item))
    ))
    document.querySelector(`#writing-mode-select`).dispatchEvent(new Event('input'))
});
window.addEventListener('beforeunload', (event) => {
    console.log('beforeunload!!');
});

