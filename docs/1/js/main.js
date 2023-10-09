window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOMContentLoaded!!');
    splitScreen.make()
});
window.addEventListener('beforeunload', (event) => {
    console.log('beforeunload!!');
});

