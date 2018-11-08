/**
 *
 * name: canvas.engine
 * date: 2018/11/2
 * author: cengfucheng
 * about: canvas基本引擎库
 *
 */

import utils from '../utils/Xk.utils';

const STAGELIST = [];               // 存放舞台canvas数量
const STAGE = Symbol('stage');      // 存放舞台对象

//debug
let { log } =console;


// 警告：启用本插件，必须设定 舞台。
class CanvasBase {
    constructor () {
        if(new.target === CanvasBase) throw new Error('本类不允许实例化。');
    }

    /*
    *
    * 绑定舞台，必须操作。。。否则等着报错吧你
    * stageApp 为 dom 对象（容器）
    * */
    static Stage (stageApp) {
        if(!this.prototype[STAGE]) {
            this.prototype[STAGE] = stageApp;
        }
    }

    /*
    *
    * 设定当前canvas层级，并刷新整个舞台其他canvas层级
    * */
    stageListLayer (index) {
        if(index >= this.stageListlenght) throw new Error('超过舞台实例堆栈上限。');
        STAGELIST.splice(this.zIndex, 1);
        if(this.zIndex < index) index--;
        STAGELIST.splice(index, 0, this);
        index > this.zIndex ? this.stageListSort(this.zIndex, index) : this.stageListSort(index, this.zIndex);
    }

    /*
    *
    * 舞台层级排序，STAGELIST数组排序，start 起点索引，end 结束索引
    * */
    stageListSort (start, end) {
        if(!STAGELIST[start]) return;
        while (start <= end) {
            STAGELIST[start].zIndex = start;
            STAGELIST[start].getCanvas.style.zIndex = start;
            start++;
        }
    }

    static addChild (canvasSprite, zIndex) {
        if(typeof zIndex == 'number') {
            if(!STAGELIST[zIndex]) throw new Error('超过舞台实例数。');
            this.prototype.getStage.insertBefore(canvasSprite.getCanvas, STAGELIST[zIndex].getCanvas);
            if(zIndex == canvasSprite.stageListlenght - 1) {
                STAGELIST[canvasSprite.stageListlenght] = canvasSprite;
            }else{
                STAGELIST.splice(zIndex, 0, canvasSprite);
            }
            canvasSprite.stageListSort(zIndex,this.prototype.stageListlenght - 1);

        }else{
            this.prototype.getStage.appendChild(canvasSprite.getCanvas);
            canvasSprite.addCanvas();
        }
    }

    /*
    *
    * 移除单个canvas对象
    * */
    static removeCanvas (canvasSprite) {
        canvasSprite.getCanvas.parentNode.removeChild(canvasSprite.getCanvas);
        STAGELIST[canvasSprite.zIndex] = null;
        STAGELIST.splice(canvasSprite.zIndex,1);
        this.prototype.stageListSort(canvasSprite.zIndex + 1, this.prototype.stageListlenght);
        canvasSprite = null;
    }

    /*
        *
        * 获取舞台对象
        * */
    get getStage () {
        return this[STAGE];
    }

    /*
    *
    * 获取舞台总canvas数
    * */
    get stageListlenght () {
        return STAGELIST.length;
    }
}


let PUSH = Symbol('push');
let CANVAS = Symbol('canvas');
let CTX = Symbol('ctx');
class CanvasEngine extends CanvasBase {
    constructor () {
        super();
        if(new.target !== CanvasEngine) throw new Error('必须实例或者静态使用某些方法。');
        let doc = document;
        this[CANVAS] = doc.createElement('canvas');
        // this[CANVAS].innerHTML = ' 您的浏览器不支持canvas.';
        this[CANVAS].style.position = 'absolute';
        this[CTX] = this[CANVAS].getContext('2d');
        this[CANVAS].id = utils.uuid(3);

        /*
        *
        * 添加到舞台
        * */
        this.addCanvas = (zIndex) => {
            this.zIndex = this.stageListlenght;
            this[CANVAS].style.zIndex = this.zIndex;
            this[PUSH]();
            return this[CANVAS];
        }


    }


    /*
    *
    * 私有方法，添加到舞台数组
    * */
    [PUSH] () {
        STAGELIST.push(this);
    }

    draw ({width = 0, height = 0, x = 0, y =0, bgColor = ''} = {}) {
        this[CTX].save();
        this[CTX].fillStyle = bgColor;
        this[CTX].fillRect(x, y, width, height);
        this[CTX].restore();
    }

    // drawImage ({img, sx=0, sy=0, sw=0, sh=0, dx=0, dy=0, dw=0, dy=0} = {}) {
    drawImage (...data) {
        if(typeof data[0] === 'object') {
            this[CTX].drawImage(...data);
        }else{
            utils.loadImage(data[0],(img) => {
                data[0] = img;
                this[CTX].drawImage(...data);
            })
        }
    }

    /*
    *
    * 返回 x
    * */
    get x () {
        return utils.getRect(this[CANVAS]).left;
    }

    /*
    *
    * 设定 x
    * */
    set x (number) {
        this[CANVAS].style.transform = `translate3d(${number}px,0px,0px)`;
    }

    get y () {
        return utils.getRect(this[CANVAS]).top;
    }

    set y (number) {
        this[CANVAS].style.transform = `translate3d(0px,${number}px,0px)`;
    }

    get width () {
        return utils.getRect(this[CANVAS]).width;
    }

    set width (number) {
        this[CANVAS].width = number;
    }

    get height () {
        return utils.getRect(this[CANVAS]).height;
    }

    set height (number) {
        this[CANVAS].height = number;
    }

    /*
    *
    * 返回canvas 对象
    * */
    get getCanvas () {
        return this[CANVAS];
    }

    /*
    *
    * 返回 ctx 对象
    * */
    get getCanvasCtx () {
        return this[CTX];
    }

    clean () {

    }

    cleanBoth () {

    }

}

export { CanvasBase };
export default CanvasEngine;
