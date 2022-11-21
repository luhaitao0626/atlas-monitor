import onload from "../utils/onload";
import tracker from "../utils/tracker";
import getLastEvent from '../utils/getLastEvent';
import getSelector from "../utils/getSelector";
export function timing() {

    // TODO: mdn上去看 developer.mozilla.org/zh-CH/docs/Web/API/PerformanceObserver/observe
    // w3c.github.io/paint-timing/#first-contentful-paint
    // 统计FP  LCP FMP FCP ....
    let FMP, LCP
    // 性能观察者，增加一个性能条目的观察者
    new PerformanceObserver((entryList, observer) => {
        let perfEntries = entryList.getEntries();
        console.log(perfEntries)
        FMP = perfEntries[0]; // 浏览器也不知道哪个是最有意义的元素，需要用户加标识
        observer.disconnect();// 断开不再观察了
    }).observe({ entryTypes: ['element'] });//观察页面中有意义的元素


    new PerformanceObserver((entryList, observer) => {
        let perfEntries = entryList.getEntries();
        LCP = perfEntries[0];
        observer.disconnect();// 断开不再观察了
    }).observe({ entryTypes: ['largest-contentful-paint'] });//观察页面中最大内容元素的元素

    // FIP
    new PerformanceObserver((entryList, observer) => {
        let lastEvent = getLastEvent();
        let firstInput = entryList.getEntries()[0];
        console.log('FID', firstInput)
        if (firstInput) {
            // processintStart开始处理的时间  -  startTime点击开始的时间，差值就是处理的延迟时间
            // 从点页面到页面开始处理的事件
            let inputDelay = firstInput.processingStart - firstInput.startTime;
            // 处理的时间长度
            let duration = firstInput.duration;
            if (inputDelay > 0 || duration > 0) {
                tracker.send({
                    kind: 'experience', // 用户体验指标
                    time: 'firstInputDelay', // 首次输入延迟
                    inputDelay, // 延迟的时间
                    duration, // 处理的时间,
                    startTime: firstInput.startTime,
                    selector: lastEvent ? getSelector(lastEvent.path || lastEvent.target) : '',
                });
            }

        }
        observer.disconnect();// 断开不再观察了
    }).observe({ type: 'first-input', buffered: true }); // 用户的第一次交互，点击页面




    onload(function () {

        setTimeout(() => {// 延时3秒后再获取更准确;
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
                domContentLoadedEventStart,
                domContentLoadedEventEnd,
                loadEventStart,
            } = performance.timing || PerformanceNavigationTiming;
            // 页面绘制; Render, -> paint , 双缓冲来回切,两个线程,不会出现卡顿
            tracker.send({
                kind: 'experience', // 用户体验指标
                time: 'timing', // 统计每个阶段的时间
                connectTime: connectEnd - connectStart, // 连接时间
                ttfbTime: responseStart - requestStart, // 首字节到达时间
                responseTime: responseEnd - responseStart, // 相应的读取时间
                parseDomTime: loadEventStart - domLoading, // dom解析时间
                domContentLoadedTime: domContentLoadedEventEnd - domContentLoadedEventStart,
                timeToInteractive: domInteractive - fetchStart, // 首次可交互的时间
                loadTime: loadEventStart - fetchStart  // 玩真的加载时间
            });

            let FP = performance.getEntriesByName('first-paint')[0];
            let FCP = performance.getEntriesByName('first-contentful-paint')[0];
            // let FMP = performance.getEntriesByName('first-meaningful-paint')[0];
            // let LCP = performance.getEntriesByName('largest-contentful-paint')[0];
            // 开始发送性能指标
            console.log('FP', FP);
            console.log('FCP', FCP);
            console.log('FMP', FMP);
            console.log('LCP', LCP);

            tracker.send({
                kind: 'experience', // 用户体验指标
                time: 'paint', // 统计每个阶段的时间
                firstPaint: FP.startTime,
                firstContentfulPaint: FCP.startTime,
                firstMeaningfulPaint: FMP.startTime,
                largestContentfulPaint: LCP.startTime,
            });

        }, 3000);
    })

}