import { blankScreen } from './lib/blankScreen';
import { injectJsError } from './lib/jsError';
import { injectXHR } from './lib/xhr';
import { timing } from './lib/timing'

injectJsError();
injectXHR();
blankScreen(); // 插在document.head，dom还没渲染，不能判断白屏，那么应该什么时候插入呢？
timing();