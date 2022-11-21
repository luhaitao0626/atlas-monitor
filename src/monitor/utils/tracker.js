// 往服务端上报
let host = 'en-beijing.log.aliyuncs.com';
// let project = 'atlasmonitor';
// let logStore = 'atlasmonitor-store';

// 目前前端主流上报不是http上报而是image上报 用gif图片上传，因为图片速度快，没有跨域问题，但有长度限制
// Navigator.setBeacon可以将少量数据 http请求 异步传输到web服务器，不阻塞页面

let project = 'zhufengmonitor';
let logStore = 'zhufengmonitor-store';

let userAgent = require('user-agent');
function getExtraData() {
    return {
        title: document.title, // 页面标题
        url: location.href, // 访问哪个路径报错了
        timestamp: Date.now(), // 时间
        userAgent: userAgent.parse(navigator.userAgent).name
    }
}

class SendTracker {
    constructor() {
        this.url = `http://${project}.${host}/logstores/${logStore}/track`;
        this.xhr = new XMLHttpRequest;
    }
    send(data = {}) {
        let extraData = getExtraData();
        // console.log('extradata', extraData)
        let log = {
            ...data,
            ...extraData,
        }
        // 对象的值不能是数字，要转成字符串, 阿里云对格式的要求
        for (let key in log) {
            if (typeof log[key] === 'number') {
                log[key] = `${log[key]}`;
            }
        }
        console.log('log', log); 
        this.xhr.open('POST', this.url, true);
        // 这才是真正的阿里云要求的格式
        let body = JSON.stringify({
            __logs__: [log]
        });

        this.xhr.setRequestHeader('Content-Type', 'application/json');//请求体类型
        this.xhr.setRequestHeader('x-log-apiversion', '0.6.0');// 版本号
        this.xhr.setRequestHeader('x-log-bodyrawsize', body.length);//请求体大小
        this.xhr.onload = function () {
            // console.log(this.xhr.response);
        }
        this.xhr.orerror = function (error) {
            // console.log(error);
        }
        this.xhr.send(body);

    }
}
export default new SendTracker;