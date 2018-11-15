/**
 *
 * name: xk.event.js
 * date: 2018/11/13
 * author: cengfucheng
 * about: 通信基础架构, 不具备直接交互能力，只是子类内部通信的接口
 *
 */

class EventEmiter {
    constructor () {
        if(new.target === EventEmiter) throw new Error('本类不支持实例化');
        this._event = {};
    }

    /*
    *
    * target 不限任何形式，只要 侦听和触发，两者校验为true，就调用回调。
    * */
    on (event, fn, target, once) {
        this._event[event] ? this._event[event] : this._event[event] = [];
        ~~once ? this._event[event].push({id: target, fn: fn, once: once}) :
            this._event[event].push({id: target, fn: fn});
        return this;
    }

    once (event, fn, target) {
        this.on(event, fn, target, 1);
        return this;
    }

    off (event, fn, target) {
        let envets = this._event[event];
        if(fn) {
            // 关闭单个事件
            envets.forEach( (v, i, arr) => {
                if(v.id == target){
                    arr.splice(i, 1);
                }
            });
        }else if(event){
            // 关闭单个事件组
            this._event[event] = [];
        }else{
            // 关闭整个事件组流
            Object.keys(this._event).forEach( (v ,i) => {
                this._event[v] = [];
            });
        }

        return this;
    }

    emit (event, target, msg) {
        if(!this._event[event]) return this;
        let events = this._event[event];
        events.forEach( (v, i) => {
            if(v.id == target){
                setTimeout(() => {
                    v.fn(this, target, msg);
                },0);
                if(v.once) this.off(event, v.fn, target);
            }
        });
        return this;
    }

}

export default EventEmiter;
