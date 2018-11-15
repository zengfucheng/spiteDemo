import './css/style.css';

import utils from './js/utils/Xk.utils';
import './js/utils/add.support';

import { CanvasBase } from './js/canvas.lib/canvas.engine';
import CanvasEngine from './js/canvas.lib/canvas.engine.js';

import Data from './js/content/data';
import InitAnimal from './js/content/initAnimal';
import PlayAnimal from './js/content/playAnimal';

import messagePanel from './js/utils/MessagePanel';

import imagePanel from './js/component/image.panel';
import Panel from './js/component/Panel';
import LoadPanel from './js/component/Load.panel';

// 下面二条已out
// 鉴于canvas本身没有层级，这就很麻烦。
// 因此，如果要进行大量交互，那么必须分级别。也就是，分镜。背景图片一个canvas，中间人物一个canvas。如果还有前景，那么一样

// 现在已采用性能处理，全部操作成canvas。也就是说，图片都画成canvas，然后存储，用的时候再绘制该canvas。
// 也就是canvas作为一个基元容器，存储一个绘制对象。然后再存入一个总列表。再进行其他操作

;(function () {
    window.log = console.log;
})();

/*
*
* 判断页面存在viewport设定没有，没有就强制添加；
* */
let viewport = function () {
    let doc = document;
    let docEle = doc.firstElementChild;
    let headEle = docEle.firstElementChild;
    let title = headEle.querySelector('title');
    let httpEquiv = headEle.querySelector('meat[name="X-UA-Compatibl"]');
    let nameRenderer = headEle.querySelector('meat[name="renderer"]');
    let viewPort = headEle.querySelector('meat[name="viewport"]');
    if(!httpEquiv) {
        httpEquiv = doc.createElement('meta');
        httpEquiv.setAttribute('http-equiv', 'X-UA-Compatible');
        httpEquiv.setAttribute('content',['IE=edge', 'chrome=1'].join('; '));
        if(title){
            headEle.insertBefore(httpEquiv, title.firstElementChild);
        }else{
            headEle.appendChild(httpEquiv);
        }
    }
    if(!nameRenderer) {
        nameRenderer = doc.createElement('meta');
        nameRenderer.setAttribute('name', 'renderer');
        nameRenderer.setAttribute('content', 'webkit');
        headEle.insertBefore(nameRenderer, httpEquiv.nextElementSibling)
    }
    if(!viewPort) {
        viewPort = doc.createElement('meta');
        viewPort.setAttribute('name', 'viewport');
        viewPort.setAttribute('content', ['initial-scale', 'minimum-scale', 'maximum-scale', 'user-scalable=no'].join(`=1.0,`));
        headEle.insertBefore(viewPort, httpEquiv.nextElementSibling);
    }
}




let XkAnimation = function ({id = '',doc=window.document} = {}) {
    viewport();

    let { width: w, height: h} = utils.getScreenRect();

    let app = doc.querySelector(`#${id}`);
    let changeBtn = document.querySelector('#changeBtn');

    let playItem = {
        index: 0,
    }

    let appCanvas = doc.createElement('div');
    appCanvas.style.width = app.offsetWidth;
    appCanvas.style.height = app.offsetHeight;
    appCanvas.style.position = 'absolute';
    app.appendChild(appCanvas);
    // 绑定舞台
    CanvasBase.Stage(appCanvas);
    Panel.Stage(app);

    let initAnimal = new InitAnimal(Data);

    initAnimal.play();
    app.addEventListener('click',function (e) {
        initAnimal.play();
    },false);
}



class XkEngine {
    constructor () {

    }

    /*
    *
    * 将组件作为app的子方法
    * */
    use (fn) {
        let _name = fn.constructor.name;
        this[_name] = fn;
        return this;
    }
}








// 对外接口
if(typeof  defind === 'function' && defind.amd){
    defind('XkAnimation',XkAnimation);
}
if(typeof  module === 'object'){
    module.exports = XkAnimation;
}
if(typeof window !=='undefined'){
    window.XkAnimation = XkAnimation;
}else if(typeof globel !== 'undefined'){
    globel.XkAnimation = XkAnimation;
}

