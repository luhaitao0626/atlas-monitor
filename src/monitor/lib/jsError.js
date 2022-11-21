
// const _event = {
//     'title': "前端监控系统",// 页面标题
//     'url':"http://localhost:8080", //页面url
//     'timeStamp':"1590815288710",// 访问时间戳
//     'userAgent':"Chrome",//用户浏览器类型
//     'kind':"stability",//大类
//     'type':"error",//小类
//     'errorType':"jsError",//错误类型
//     'message':"Uncaught TypeError: Cannot set property 'error' of undefined",//类型详情
//     'filename':"http://localhost:8080/",// 访问的文件名
//     'position':"0:0",//行列信息
//     'stack':"btnClick (http://localhost:8080/:20:39)^HTMLInputElement.onclick (http://localhost:8080/:14:72)",// 堆栈信息
//     'selector':"HTML BODY #container .content INPUT"//选择器
// }
import getLastEvent from "../utils/getLastEvent";
import getSelector from '../utils/getSelector';
import tracker from "../utils/tracker";
export function injectJsError() {
    // 监听全局未捕获的错误
    window.addEventListener('error', function (event) {//错误事件对象
        let laseEvent = getLastEvent(); // 获取到最后一个交互事件
        // 通过lastEvent.path 找出selector
        console.log('error',event);
        // 脚本加载错误
        if(event.target && (event.target.src || event.target.href)) {
            tracker.send({
                kind: 'stability', // 监控指标的大类
                type: 'error', // 小类型，说明是一个错误
                errorType: 'resourceError', // JS执行错误
                // message: '', // 报错信息
                filename: event.target.src || event.target.href,
                tagName: event.target.tagName, //Script 
                selector: getSelector(event.target) // 代表最后一个操作的元素 // body div#container div.content input
            });
        }
        // 代码报错
        else{
            tracker.send({
                kind: 'stability', // 监控指标的大类
                type: 'error', // 小类型，说明是一个错误
                errorType: 'jsError', // JS执行错误
                message: event.message, // 报错信息
                filename: event.filename,
                position: `${event.lineno}:${event.colno}`,
                stack: getLines(event.error.stack),
                selector: laseEvent ? getSelector(laseEvent.path) : '' // 代表最后一个操作的元素 // body div#container div.content input
            });
        }
        
    }, true); //TODO 这里加true是为什么的 ,capther 阶段捕获

    window.addEventListener('unhandledrejection', (event) => {
        console.log(event);
        let laseEvent = getLastEvent();
        let message;
        let filename;
        let line = 0;
        let column = 0;
        let stack;
        let reason = event.reason;
        // console.log('reason', reason);
        if (typeof event.reason === 'string') {
            message = reason;
        } else if (typeof reason === 'object') { // 说明是一个错误对象
            message = reason.message;
            if (reason.stack) {
                let matchResult = reason.stack.match(/at\s+(.+):(\d+):(\d+)/);
                filename = matchResult[1];
                line = matchResult[2];
                column = matchResult[3];
            }
            stack = getLines(reason.stack);
        }
        tracker.send({
            kind: 'stability', // 监控指标的大类
            type: 'error', // 小类型，说明是一个错误
            errorType: 'promiseError', // JS执行错误
            message, // 报错信息
            filename,
            position: `${line}:${column}`,
            stack,
            selector: laseEvent ? getSelector(laseEvent.path) : '' // 代表最后一个操作的元素 // body div#container div.content input
        });
    })

    function getLines(stack) {
        let res = stack.split('\n').slice(1);
        res = res.map(item => item.replace(/^\s+at\s+/g, ""))
        res = res.join('^');
        return res;
    }
}