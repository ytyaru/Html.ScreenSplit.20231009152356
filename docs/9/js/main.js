window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOMContentLoaded!!');
    centerSplitScreen.make()
    centerSplitScreen.make()
    centerSplitScreen.make({'count':1})
    centerSplitScreen.make({'count':3})
    centerSplitScreen.make({'writingMode':'vertical'})
    centerSplitScreen.make({'count':3, 'writingMode':'vertical'})
    window.addEventListener('resize', debounce((e)=>{centerSplitScreen.resize()},300))
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

