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

// 11。08 来设计 canvas 放到 页面上，自行设定层级，也就是 add(zindex);可以插入到某层。需要更新数组。

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
        let tIndex = {};
        if(this.zIndex != index) {
            tIndex = STAGELIST[index];
            STAGELIST[index] = STAGELIST[this.zIndex];
            STAGELIST[this.zIndex] = tIndex;
        }
        // STAGELIST.forEach( (v, i) => {
        //     if(v.zIndex != i) {
        //         v.zIndex = i;
        //         v.getCanvas.style.zIndex = v.zIndex;
        //     }
        // });
        log(STAGELIST)
        index > this.zIndex ? this.stageListSort(this.zIndex, index) : this.stageListSort(index, this.zIndex);
    }

    /*
    *
    * 舞台层级排序，STAGELIST数组排序，start 起点索引，end 结束索引
    * */
    stageListSort (start, end) {
        // while (start <= end) {
        //     STAGELIST[start].zIndex = start;
        //     STAGELIST[start].getCanvas.style.zIndex = start;
        //     start++;
        // }
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
    * 移除单个canvas对象
    * */
    static removeCnavas (canvasSprite) {
        log(this.prototype,'zfc');
        canvasSprite.getCanvas.parentNode.removeChild(canvasSprite.getCanvas);
        STAGELIST[canvasSprite.zIndex] = null;
        STAGELIST.splice(canvasSprite.zIndex,1);
        canvasSprite = null;
        STAGELIST.forEach( (v, i) => {
            if(v.zIndex != i) {
                v.zIndex = i;
                v.getCanvas.style.zIndex = v.zIndex;
            }
        });
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
        this[CANVAS].style.position = 'absolute';
        this[CTX] = this[CANVAS].getContext('2d');
        this[CANVAS].id = utils.uuid(3);

        this.addCanvas = () => {
            this.zIndex = this.stageListlenght;
            this[CANVAS].style.zIndex = this.zIndex;
            this[PUSH]();
            return this[CANVAS];
        }


    }

    /*
    *
    * 添加到 舞台
    * */
    get addCanvs () {
        this.zIndex = this.stageListlenght;
        this[CANVAS].style.zIndex = this.zIndex;
        this[PUSH]();
        return this[CANVAS];
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

    set x (number) {
        this[CANVAS].style.transform = `translate3d(${number}px,0px,0px)`;
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
