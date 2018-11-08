import './css/style.css';
import './js/style';

import utils from './js/utils/Xk.utils';
import './js/utils/add.support';

import { CanvasBase } from './js/canvas.lib/canvas.engine';
import CanvasEngine from './js/canvas.lib/canvas.engine.js';

import messagePanel from './js/utils/MessagePanel';

// 下面二条已out
// 鉴于canvas本身没有层级，这就很麻烦。
// 因此，如果要进行大量交互，那么必须分级别。也就是，分镜。背景图片一个canvas，中间人物一个canvas。如果还有前景，那么一样

// 现在已采用性能处理，全部操作成canvas。也就是说，图片都画成canvas，然后存储，用的时候再绘制该canvas。
// 也就是canvas作为一个基元容器，存储一个绘制对象。然后再存入一个总列表。再进行其他操作

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

    //debug
    let { log } = console;

    // let { width: w, height: h} = utils.getScreenRect();
    let app = document.querySelector(`#${id}`);
    let changeBtn = document.querySelector('#changeBtn');

    // 绑定舞台
    CanvasBase.Stage(app);


    let c0 = new CanvasEngine();
    let c1 = new CanvasEngine();
    app.appendChild(c1.addCanvs);
    log(c1);
    let c2 = new CanvasEngine();
    log(c2);
    app.appendChild(c2.addCanvs);
    c1.draw({x:0,y:0,width:200,height:200,bgColor:'black'});
    // c2.draw({x:0,y:0,width:100,height:100,bgColor:'red'});
    // c2.drawImage('assets/css3.png');
    c2.drawImage('assets/css3.png',0,0);
    let c3 = new CanvasEngine();
    app.appendChild(c3.addCanvs);

    // let ctx = new CanvasEngine(canvas);
    // ctx.draw({width: appRect.width/2, height: appRect.height/2, x: appRect.x, y: appRect.y, bgColor: 'blue'});
    //
    // let canvas1 = doc.createElement('canvas');
    // canvas1.innerHTML = '您的浏览器不支持canvas。';
    // app.appendChild(canvas1);
    // canvas1.id = 'Xk-canvass';
    // canvas1.width = appRect.width;
    // canvas1.height = appRect.height;
    //
    // let ctx1 = new CanvasEngine(canvas1);
    // ctx1.draw({width: appRect.width/2, height: appRect.height/2, x: appRect.width/2, y: appRect.height/2, bgColor: 'blue'});

    let x = 10;
    app.addEventListener('click', function (e) {
        // c1.stageListLayer(c1.stageListlenght-1);
        c2.x = x;
        // CanvasEngine.removeCnavas(c2);
        x += 10;
        // console.log(c2.getStage);
        // c2.canvas.style.animation ='trans1XY 0.25s infinite ease-in';
        //     console.log(1)
    //     let msg = new messagePanel({type: 'alert', content: '对不起，您不是会员。'});
    },false);
    changeBtn.addEventListener('click', function (e) {
        c1.zIndex > c2.zIndex ? c2.stageListLayer(c1.stageListlenght-1) : c1.stageListLayer(c1.stageListlenght-1);
    },false);
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

