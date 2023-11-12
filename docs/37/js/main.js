window.addEventListener('DOMContentLoaded', async(event) => {
    console.log('DOMContentLoaded!!');
    /*
    layoutScreen.make()
    layoutScreen.make()
    layoutScreen.make({'count':1})
    layoutScreen.make({'count':3})
    layoutScreen.make({'writingMode':'vertical'})
    layoutScreen.make({'count':3, 'writingMode':'vertical'})
    layoutScreen.make({'hasSplitter':false})
    layoutScreen.make({'hasSplitter':false, 'writingMode':'vertical'})
    layoutScreen.make({'hasSplitter':true, 'writingMode':'vertical'})
    layoutScreen.make({'count':0, 'writingMode':'vertical'})
    */
    performance.mark('layoutScreen.make-start')
    layoutScreen.make()
//    layoutScreen.make({'count':1})
//    layoutScreen.make({'count':1, 'writingMode':'vertical'})
//    layoutScreen.make({'writingMode':'vertical'})
//    layoutScreen.make({'count':2, 'writingMode':'vertical'})
//    layoutScreen.make({'count':0})
//    layoutScreen.make({'count':0, 'writingMode':'vertical'})
    performance.mark('layoutScreen.make-end')
    performance.measure('layoutScreen.make', 'layoutScreen.make-start', 'layoutScreen.make-end')
    console.log(performance.getEntriesByName('layoutScreen.make')[0])
    window.addEventListener('resize', debounce((e)=>{
        layoutScreen.remake()
        fitTextBlock.resize()
    }, 1000))

    performance.mark('TextBlock.load-start')
//    await TextBlock.load('txt/manuscript.txt')
//    await TextBlock.load('txt/large.txt')
    await TextBlock.load('txt/long-paragraph.txt')
//    await TextBlock.load('txt/sanitaize.txt')
    performance.mark('TextBlock.load-end')
    performance.measure('TextBlock.load', 'TextBlock.load-start', 'TextBlock.load-end')
    console.log(performance.getEntriesByName('TextBlock.load')[0])

    performance.mark('TextBlock.iter-start')
    for (let block of TextBlock.iter()) {
        fitTextBlock.addBlock(block) // 一画面に収まるHTMLテキスト単位にまとめて配列にする
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

