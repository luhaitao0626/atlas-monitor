import tracker from "../utils/tracker";
// 会将上报的xhr也拦截了，需要过滤掉
export function injectXHR() {
    let XMLHttpRequest = window.XMLHttpRequest;
    let oldOpen = XMLHttpRequest.prototype.open
    XMLHttpRequest.prototype.open = function (method, url, async) {
        // console.log(`url:${url}`)
        // 如果时上报的接口路径，或者webpack的心跳检测的路径就不用了
        if (!url.match(/logstores/) && !url.match(/sockjs/)) { 
            this.logData = { method, url, async };
        }
        return oldOpen.apply(this, arguments);
    }

    let oldSend = XMLHttpRequest.prototype.send;
    
    // axios 的原理:
        // browser -> XMLHttpRequest , 
        // node -> http
    
    XMLHttpRequest.prototype.send = function (body) {
        if (this.logData) { // 已经劫持了
            let startTime = Date.now(); // 在发送之前记录发送时间
            // XMLHttpRequest 0-1-2-3-4   readyState === 4时，就到load中了
            // status 2xx 304成功，其他就是失败
            // TODO: fetch,axios 怎么监听
            let handler = (type) => event => { // 在结束之后，load,error,abort之后拿到差时
                let duration = Date.now() - startTime;
                let status = this.status; // 200,500
                let statusText = this.statusText; // OK Server Error
                tracker.send({
                    kind: 'stability', // 大类型，稳定性指标
                    type: 'xhr',
                    eventType: type, // load,error abort
                    pathname: this.logData.url,
                    status: status + '-' + statusText,
                    duration, // 持续时间
                    response: this.response ? JSON.stringify(this.response) : '', //响应体
                    params: body || ''
                });
                // this.logData = null;
            }
            this.addEventListener('load', handler('load'), false);
            this.addEventListener('error', handler('error'), false);
            this.addEventListener('abort', handler('abort'), false);
        }
        return oldSend.apply(this, arguments);
    }
}