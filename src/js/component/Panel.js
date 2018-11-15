import utils from "../utils/Xk.utils";

/**
 *
 * name: Panel
 * date: 2018/11/13
 * author: cengfucheng
 * about: 组件基本
 *
 */

const STAGE = Symbol('stage');

class Panel {
    constructor () {
        if(new.target === Panel) throw new Error('本类不支持实例化');
        this._show = false;
        this._close = false;
        this.panel = {};
    }

    /*
    *
    * 绑定舞台，必须操作。。。否则等着报错吧你
    * stageApp 为 dom 对象（容器）
    * */
    static Stage (app) {
        if(!this.prototype[STAGE]) this.prototype[STAGE] = app;
    }

    show () {
        if(!this._show) {
            this.panel.style.visibility = 'visible';
            this._show = true;
        }
        if(!this._close) {
            this.getStage.appendChild(this.panel);
            this._close = true;
        }
    }

    hidden () {
        if(this._show) {
            this.panel.style.visibility = 'hidden';
            this._show = false;
        }
    }

    close () {
        if(this._close) {
            this.getStage.removeChild(this.panel);
            this._close = false;
        }
    }

    point (x=0, y=0, z=0) {
        this.panel.style.transform = `translate3d(${x}px,${y}px,${z}px)`;
    }

    get x () {
        return utils.getRect(this.panel).left;
    }

    set x (number) {
        this.panel.style.transform = `translate3d(${number}px,0px,0px)`;
    }

    get y () {
        return utils.getRect(this.panel).top;
    }

    set y (number) {
        this.panel.style.transform = `translate3d(0px,${number}px,0px)`;
    }

    get width () {
        return utils.getRect(this.panel).width;
    }

    set width (number) {
        this.panel.style.width = number;
    }

    get height () {
        return utils.getRect(this.panel).height;
    }

    set height (number) {
        this.panel.style.height = number;
    }

    get doc () {
        return window.document || document;
    }

    get getStage () {
        return this[STAGE];
    }
}

export default Panel;
