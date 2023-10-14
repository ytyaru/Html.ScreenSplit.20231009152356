window.addEventListener('DOMContentLoaded', async(event) => {
    console.log('DOMContentLoaded!!');
    /*
    centerSplitScreen.make()
    centerSplitScreen.make()
    centerSplitScreen.make({'count':1})
    centerSplitScreen.make({'count':3})
    centerSplitScreen.make({'writingMode':'vertical'})
    centerSplitScreen.make({'count':3, 'writingMode':'vertical'})
    centerSplitScreen.make({'hasSplitter':false})
    centerSplitScreen.make({'hasSplitter':false, 'writingMode':'vertical'})
    centerSplitScreen.make({'hasSplitter':true, 'writingMode':'vertical'})
    centerSplitScreen.make({'count':0, 'writingMode':'vertical'})
    */
    centerSplitScreen.make()
//    centerSplitScreen.make({'count':1})
//    centerSplitScreen.make({'writingMode':'vertical'})
//    centerSplitScreen.make({'count':2, 'writingMode':'vertical'})
//    centerSplitScreen.make({'count':0})
//    centerSplitScreen.make({'count':0, 'writingMode':'vertical'})
//    window.addEventListener('resize', debounce((e)=>{centerSplitScreen.resize()},300))
    window.addEventListener('resize', debounce((e)=>{
        centerSplitScreen.resize()
        fitText.calc()
    },300))

    const blocks = await TextBlock.fromUrl('txt/manuscript.txt')
    console.log(blocks)
    //document.querySelector('.inner-screen').innerHTML = blocks.map(block=>paragraph.parse(block)).join('')
    
    fitText.set(blocks)
    fitText.calc()
    //document.querySelector('.inner-screen').innerHTML = fitText.next().html
    //setInnerHtml('next')

    window.addEventListener('click', async(event) => {
        //setInnerHtml(fitText.next()?.html)
        //setInnerHtml('next')
        fitText.next()
    })
    window.addEventListener("keyup", (e) => {
        console.log(e.key)
        switch(e.key) {
//            case 'n': return setInnerHtml(fitText.next()?.html)
//            case 'p': return setInnerHtml(fitText.prev()?.html)
//            case 'n': return setInnerHtml('next')
//            case 'p': return setInnerHtml('prev')
            case 'n': return fitText.next()
            case 'p': return fitText.prev()
        }
    });
    //function setInnerHtml(html) { if (html) { document.querySelector('.inner-screen').innerHTML = html } }
    function setInnerHtml(action) {
        const screens = Array.from(document.querySelectorAll('.inner-screen')) 
        if ('prev'===action) { screens.reverse() }
        for (let screen of screens) {
            const block = fitText[action]()
            screen.innerHTML = (block) ? block.html : ''
        }
    }
});
window.addEventListener('beforeunload', (event) => {
    console.log('beforeunload!!');
});

