/**
 *
 * name: dataAnimal
 * date: 2018/11/12
 * author: cengfucheng
 * about: 封装数据对象，供 initAnimal 调用
 *
 */

import EventEmiter from '../event/xk.event';

class DataAnimal extends EventEmiter{
    constructor (config) {
        super();
        this.loadState = 'before';
        Object.assign(this, config);
        this.into = false;                                      // 每次进入该模块/离开该模块
        this._nextStep = NaN;
        this.groupLenght = this.group ? this.group.length : 0;
    }

    start (fn) {
        if(Number.isNaN(this._nextStep)) {
            this._nextStep = 0;
            this.into = true;
            // 初始化本节点数据
            if(typeof fn === 'function') fn();

            // 初始化本节点图片组件
            if(this.components) {
                Object.keys(this.components).forEach( (v, i) => {
                    if(this.component[v]){
                        if(this.component[v].render == 0){
                            this.components[v].show();
                        }
                    }

                })
            }

        }
    }

    nexts () {

        this.start();
        // log(this.into, this)
        if(this._nextStep < this.groupLenght) {
            log(this.group[this._nextStep]);
            if(this.group[this._nextStep].component) {
                this.components[this.group[this._nextStep].component].show();
            }

            this._nextStep++;
            return false;
        }else{
            this.end();
            return true;
        }

    }

    end () {

        this.close();
    }

    close () {
        setTimeout(() => {
            this._nextStep = 0;
            this.into = false;
        }, 0);

    }

}

export default DataAnimal;
