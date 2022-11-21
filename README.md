## 为什么要做前端监控

## 前端监控目标

## 前端监控流程

## 编写监控采集脚本
```js
const log = {
    'title': "前端监控系统",// 页面标题
    'url':"http://localhost:8080", //页面url
    'timeStamp':"1590815288710",// 访问时间戳
    'userAgent':"Chrome",//用户浏览器类型
    'kind':"stability",//大类
    'type':"error",//小类
    'errorType':"jsError",//错误类型
    'message':"Uncaught TypeError: Cannot set property 'error' of undefined",//类型详情
    'filename':"http://localhost:8080/",// 访问的文件名
    'position':"0:0",//行列信息
    'stack':"btnClick (http://localhost:8080/:20:39)^HTMLInputElement.onclick (http://localhost:8080/:14:72)",// 堆栈信息
    'selector':"HTML BODY #container .content INPUT"//选择器
}

```

## 白屏
```json
{
    "title":"前端监控系统",
    "url": "http://localhost:8080",
    "timestamp": "1645891221002",
    "userAgent":"chrome",
    "kind": "stability",  // 大类
    "type":"blank",// 小类
    "emptyPoints":"0",// 空白点
    "screen":"2049*1052",// 分辨率
    "viewPoint":"2048*994",// 视口
    "selector": "HTML BODY #container" //选择器
}

获取方法
screen
innerWidth
innerHeight
layout_viewpoint
elementFromPoint //  可以获取到当前是口内指定座标出，由里到外排列的所有元素
```
## 接口异常采集脚本

## 加载时间

## 性能指标

指标的标准 找阿里的最核心产品看看 对比一下


## 后面内容
- 1. 如何统计卡顿
- 2. 如何统计 pu uv页面停留时间


## 如何可视化展示
- 如何写各种各样的查询语句出那些最实用的上报
- 设备占比
- 浏览器占比
- PV PU 停留时间
- pv增长情况 今天比昨天增加多少
- SLS


pv
netinfo
RTT  Round Trip Time 一个链接的往返时间
navigator.sendBeacon()  // 谷歌才有，兼容性不好

can i use网站上 看兼容性

监听页面跳转

## 报警
- 设置各种各样的条件触发邮件 短信报警

## 现在主流的开源产品
- 监控 刚开始不可能自己研发
- 一般会用一些系统
- sentry搭配 vue.react一起使用,开箱即用
- dingta
- 神策


## 用户体验指标
FP 首次绘制 包括任何用户自定义的北京获知，他是首先将像素绘制到屏幕的时刻
FCP first content paint 将第一个dom元素渲染到页面的时间
FMP first meaningful paint 首次有意义的内容绘制  页面有意义的内容渲染的时间，需要用户提供dom的标识
LCP largest Content paint 最大内容渲染时间 
DCL domCOntentLoaded
L loaded
TTI  time to interactive
FID  First INPUT delay   用户首次输入或者点击交互的延迟时间