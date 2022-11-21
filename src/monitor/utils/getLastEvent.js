let lastEvent;
['click','touchstart','mousedown','keydown','mouseover'].forEach(eventType=>{
    document.addEventListener(eventType,(event)=> {
        lastEvent = event;
    },{
        capture: true, // 他会控制你是在捕获阶段执行
        passive: true, // 默认不阻止默认事件
    });
});
export default function(){
    return lastEvent
};