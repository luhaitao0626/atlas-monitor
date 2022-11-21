import onload from "../utils/onload";
import tracker from "../utils/tracker";

export function blankScreen() {
    let wrapperElements = ['html', 'body', '#container', '.content.main']; // 包裹元素列表，认为这些都是空元素，
    let emptyPoints = 0;
    function getSelector(element) {
        if (element.id) {
            return '#' + element.id;
        } else if (element.className) { // a b c => .a.b.c
            element.className.split(' ').filter(item => !!item).join('.')
            return '.' + element.className
        } else {
            return element.nodeName.toLowerCase();
        }
    }
    function isWrapper(element) {
        let selector = getSelector(element);
        if (wrapperElements.includes(selector)) {
            emptyPoints++;
        }
    }
    onload(function () { // 页面加载完后再执行判断白屏的逻辑
        for (let i = 1; i <= 9; i++) { // 一共18个点 x,y
            // 每次取两个点 x, y 
            let xElements = document.elementsFromPoint(window.innerWidth * i / 10, window.innerHeight / 2);
            let yElements = document.elementsFromPoint(window.innerWidth / 2, window.innerHeight * i / 10);
            // console.log(xElements,yElements)
            isWrapper(xElements[0]); // 判断是不是有包裹元素
            isWrapper(yElements[0]);
        }
        if (emptyPoints >= 18) { // 一共18个点，16个点没元素，就认为是白屏
            let centerElements = document.elementsFromPoint( // 中心点元素认为是selector的第0个
                window.innerWidth / 2,
                window.innerHeight / 2
            )
            tracker.send({
                kind: 'stability',
                type: 'blank',
                emptyPoints,
                screen: window.screen.width + "X" + window.screen.height,
                viewPoint: window.innerWidth + "X" + window.innerHeight,
                selector: getSelector(centerElements[0])
            })
        }
    })

}