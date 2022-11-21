import onload from "../utils/onload";
import tracker from "../utils/tracker";

export function timing() {
    onload(function(){
        setTimeout(()=>{// 延时3秒后再获取更准确;
            const {
                fetchStart,
                connectStart,
                connectEnd,
                requestStart,
                requestEnd,
                responseStart,
                responseEnd,
                domLoading,
                domInteractive,
                domContenLoadedEventStart,
                domContentLoadedEventEnd,
                loadEventStart,
            } = performance.timing || PerformanceNavigationTiming;
            // 页面绘制; Render, -> paint , 双缓冲来回切,两个线程,不会出现卡顿
            tracker.send({
                kind:'experience', // 用户体验指标
                time:'timing', // 统计每个阶段的时间
                connectTime: connectEnd-connectStart, // 连接时间
                ttfbTime: responseStart - requestStart, // 首字节到达时间
                responseTime: responseEnd-responseStart, // 相应的读取时间
                parseDomTime: loadEventStart - domLoading, // dom解析时间
                domContentLoadedTime: domContentLoadedEventEnd - domContenLoadedEventStart,
                timeTointeractive: domInteractive - fetchStart, // 首次可交互的时间
                loadTime: loadEventStart - fetchStart  // 玩真的加载时间
            }) 
        },3000);
    })

}