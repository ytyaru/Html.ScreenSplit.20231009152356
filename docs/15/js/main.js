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
    centerSplitScreen.make({'writingMode':'vertical'})
//    centerSplitScreen.make({'count':0})
//    centerSplitScreen.make({'count':0, 'writingMode':'vertical'})
    window.addEventListener('resize', debounce((e)=>{centerSplitScreen.resize()},300))

    //await TextBlock.fromUrl('/tmp/work/Html.ScreenSplit.20231009152356/docs/13/txt/manuscript.txt')
    const blocks = await TextBlock.fromUrl('txt/manuscript.txt')
    console.log(blocks)
    document.querySelector('.inner-screen').innerHTML = blocks.map(block=>paragraph.parse(block)).join('')
    
    fitText.set(blocks)
    fitText.calc()
    document.querySelector('.inner-screen').innerHTML = fitText.next().html

    window.addEventListener('click', async(event) => {
        setInnerHtml(fitText.next()?.html)
    })
    window.addEventListener("keyup", (e) => {
        console.log(e.key)
        switch(e.key) {
            case 'n': return setInnerHtml(fitText.next()?.html)
            case 'p': return setInnerHtml(fitText.prev()?.html)
        }
    });
    function setInnerHtml(html) { if (html) { document.querySelector('.inner-screen').innerHTML = html }
    /*
    */
    /*
    */
    /*
    splitScreen.make()
    splitScreen.make()
    splitScreen.make({'count':1})
    splitScreen.make({'count':3})
    splitScreen.make({'writingMode':'vertical'})
    splitScreen.make({'count':3, 'writingMode':'vertical'})
    window.addEventListener('resize', debounce((e)=>{splitScreen.resize()},300))
    */
});
window.addEventListener('beforeunload', (event) => {
    console.log('beforeunload!!');
});

