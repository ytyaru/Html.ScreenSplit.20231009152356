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
//    centerSplitScreen.make()
//    centerSplitScreen.make({'count':1})
//    centerSplitScreen.make({'count':1, 'writingMode':'vertical'})
    centerSplitScreen.make({'writingMode':'vertical'})
//    centerSplitScreen.make({'count':2, 'writingMode':'vertical'})
//    centerSplitScreen.make({'count':0})
//    centerSplitScreen.make({'count':0, 'writingMode':'vertical'})
    performance.mark('centerSplitScreen.make-end')
    performance.measure('centerSplitScreen.make', 'centerSplitScreen.make-start', 'centerSplitScreen.make-end')
    console.log(performance.getEntriesByName('centerSplitScreen.make')[0])
    window.addEventListener('resize', debounce((e)=>{
        //centerSplitScreen.resize()
        centerSplitScreen.remake()
        fitTextBlock.resize()
    }, 1000))

    performance.mark('TextBlock.load-start')
//    await TextBlock.load('txt/manuscript.txt')
    await TextBlock.load('txt/large.txt')
    performance.mark('TextBlock.load-end')
    performance.measure('TextBlock.load', 'TextBlock.load-start', 'TextBlock.load-end')
    console.log(performance.getEntriesByName('TextBlock.load')[0])

    performance.mark('TextBlock.iter-start')
    for (let block of TextBlock.iter()) {
        fitTextBlock.addBlock(block) // 一画面分のテキストブロックを配列にする。最初のだけHTML表示する（前回復元時は所定頁をHTML表示する）
    }
    fitTextBlock.addBlockEnd()
    performance.mark('TextBlock.iter-end')
    performance.measure('TextBlock.iter', 'TextBlock.iter-start', 'TextBlock.iter-end')
    console.log(performance.getEntriesByName('TextBlock.iter')[0])

    window.addEventListener('click', async(event) => {
        fitTextBlock.next()
    })
    window.addEventListener("keyup", (e) => {
        console.log(e.key)
        switch(e.key) {
            case 'n': return fitTextBlock.next()
            case 'p': return fitTextBlock.prev()
        }
    });
});
window.addEventListener('beforeunload', (event) => {
    console.log('beforeunload!!');
});

