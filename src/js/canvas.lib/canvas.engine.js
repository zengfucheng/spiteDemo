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

//debug
let { log } =console;

class CanvasBase {
    constructor () {
        if(new.target === CanvasBase) throw new Error('仅供继承。');
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
        STAGELIST.forEach( (v, i) => {
            if(v.zIndex != i) {
                v.zIndex = i;
                v.canvas.style.zIndex = v.zIndex;
            }
        });
    }

    get stageListlenght () {
        return STAGELIST.length;
    }
}


let PUSH = Symbol('push');
class CanvasEngine extends CanvasBase {
    constructor () {
        super();
        if(new.target !== CanvasEngine) throw new Error('必须实例或者静态使用某些方法。');
        let doc = document;
        this.canvas = doc.createElement('canvas');
        this.canvas.style.position = 'absolute';
        this.ctx = this.canvas.getContext('2d');
        this.canvas.id = utils.getTime();

        this.addCanvas = () => {
            this.zIndex = this.stageListlenght;
            this.canvas.style.zIndex = this.zIndex;
            this[PUSH]();
            return this.canvas;
        }

    }

    /*
    *
    * 添加到 舞台
    * */
    get addCanvs () {
        this.zIndex = this.stageListlenght;
        this.canvas.style.zIndex = this.zIndex;
        this[PUSH]();
        return this.canvas;
    }

    /*
    *
    * 私有方法，添加到舞台数组
    * */
    [PUSH] () {
        STAGELIST.push(this);
    }

    draw ({width = 0, height = 0, x = 0, y =0, bgColor = ''} = {}) {
        this.ctx.save();
        this.ctx.fillStyle = bgColor;
        this.ctx.fillRect(x, y, width, height);
        this.ctx.restore();
    }

    // drawImage ({img, sx=0, sy=0, sw=0, sh=0, dx=0, dy=0, dw=0, dy=0} = {}) {
    drawImage (...data) {
        if(typeof data[0] === 'object') {
            this.ctx.drawImage(...data);
        }else{
            utils.loadImage(data[0],(img) => {
                data[0] = img;
                this.ctx.drawImage(...data);
            })
        }
    }

    set x (number) {
        this.canvas.style.transform = `translate3d(${number}px,0px,0px)`;
    }


    clean () {

    }

    cleanBoth () {

    }

}

export default CanvasEngine;
