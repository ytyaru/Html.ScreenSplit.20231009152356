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
    performance.mark('centerSplitScreen.make-start')
    centerSplitScreen.make()
    performance.mark('centerSplitScreen.make-end')
    performance.measure('centerSplitScreen.make', 'centerSplitScreen.make-start', 'centerSplitScreen.make-end')
    console.log(performance.getEntriesByName('centerSplitScreen.make')[0])
//    centerSplitScreen.make({'count':1})
//    centerSplitScreen.make({'writingMode':'vertical'})
//    centerSplitScreen.make({'count':2, 'writingMode':'vertical'})
//    centerSplitScreen.make({'count':0})
//    centerSplitScreen.make({'count':0, 'writingMode':'vertical'})
//    window.addEventListener('resize', debounce((e)=>{centerSplitScreen.resize()},300))
    window.addEventListener('resize', debounce((e)=>{
        centerSplitScreen.resize()
        //fitText.calc()
    },300))

    performance.mark('TextBlock.load-start')
    //await TextBlock.load('txt/manuscript.txt')
    await TextBlock.load('txt/large.txt')
    performance.mark('TextBlock.load-end')
    performance.measure('TextBlock.load', 'TextBlock.load-start', 'TextBlock.load-end')
    console.log(performance.getEntriesByName('TextBlock.load')[0])

    performance.mark('TextBlock.fromUrlIter-start')
    //const blocks = await TextBlock.fromUrl('txt/manuscript.txt')
    //const blocks = await TextBlock.fromUrlIter('txt/large.txt')
//    const blocks = []
//    for (let [block, i] of TextBlock.iter(true)) {
    for (let block of TextBlock.iter()) {
//    for await (let [block, i] of TextBlock.fromUrlIter('txt/large.txt', true)) {
//        console.debug(block)
//        blocks.push(block)
        fitTextBlock.addBlock(block) // 一画面分のテキストブロックを配列にする。最初のだけHTML表示する（前回復元時は所定頁をHTML表示する）
    }
    performance.mark('TextBlock.fromUrlIter-end')
    performance.measure('TextBlock.fromUrlIter', 'TextBlock.fromUrlIter-start', 'TextBlock.fromUrlIter-end')
    console.log(performance.getEntriesByName('TextBlock.fromUrlIter')[0])
//    console.log(blocks)
    //document.querySelector('.inner-screen').innerHTML = blocks.map(block=>paragraph.parse(block)).join('')
    /*
    performance.mark('TextBlock.fromUrl-start')
    //const blocks = await TextBlock.fromUrl('txt/manuscript.txt')
    const blocks = await TextBlock.fromUrl('txt/large.txt')
    performance.mark('TextBlock.fromUrl-end')
    performance.measure('TextBlock.fromUrl', 'TextBlock.fromUrl-start', 'TextBlock.fromUrl-end')
    console.log(performance.getEntriesByName('TextBlock.fromUrl')[0])
//    console.log(blocks)
    //document.querySelector('.inner-screen').innerHTML = blocks.map(block=>paragraph.parse(block)).join('')
    */

    /*
    performance.mark('fitText.set-start')
    fitText.set(blocks)
    performance.mark('fitText.set-end')
    performance.measure('fitText.set', 'fitText.set-start', 'fitText.set-end')
    performance.mark('fitText.calc-start')
    fitText.calc()
    performance.mark('fitText.calc-end')
    performance.measure('fitText.calc', 'fitText.calc-start', 'fitText.calc-end')
    console.log(performance.getEntriesByName('fitText.calc')[0])
    //document.querySelector('.inner-screen').innerHTML = fitText.next().html
    //setInnerHtml('next')
    */
    window.addEventListener('click', async(event) => {
        //setInnerHtml(fitText.next()?.html)
        //setInnerHtml('next')
        //fitText.next()
        fitTextBlock.next()
    })
    window.addEventListener("keyup", (e) => {
        console.log(e.key)
        switch(e.key) {
//            case 'n': return setInnerHtml(fitText.next()?.html)
//            case 'p': return setInnerHtml(fitText.prev()?.html)
//            case 'n': return setInnerHtml('next')
//            case 'p': return setInnerHtml('prev')
//            case 'n': return fitText.next()
//            case 'p': return fitText.prev()
            case 'n': return fitTextBlock.next()
            case 'p': return fitTextBlock.prev()
        }
    });
    /*
    //function setInnerHtml(html) { if (html) { document.querySelector('.inner-screen').innerHTML = html } }
    function setInnerHtml(action) {
        const screens = Array.from(document.querySelectorAll('.inner-screen')) 
        if ('prev'===action) { screens.reverse() }
        for (let screen of screens) {
            const block = fitText[action]()
            screen.innerHTML = (block) ? block.html : ''
        }
    }
    */
});
window.addEventListener('beforeunload', (event) => {
    console.log('beforeunload!!');
});

