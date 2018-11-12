/**
 *
 * name: initAnimal
 * date: 2018/11/8
 * author: cengfucheng
 * about: 初始化config类
 *
 */

import CanvasEngine, { CanvasBase } from '../canvas.lib/canvas.engine';

import ImagePanel from '../component/image.panel';              // 绘制img的组件

class InitProtopyte {
    constructor () {
        if(new.target === InitProtopyte) throw new Error('本类不支持实例化。')
    }

    on (event, fn, id, once) {
        this.event[event] ? this.event[event] : this.event[event] = [];
        ~~once ? this.event[event].push( {id: id, fn: fn, once: once} ) :
                this.event[event].push( {id: id, fn: fn} );
        return this;
    }

    once (event, fn, id) {
        this.on(event, fn, id, 1);
        return this;
    }

    off (event, fn ,id) {
        let events = this.event[event];
        if(fn){
            events.forEach( (v, i) => {
                if(v.id == id){
                    events.splice(i,1);
                }
            })
        }else if(event){
            this.event[event] = [];
        }else{
            Object.keys(this.event).forEach( (v, i) => {
                this.event[v] = [];
            })
        }
        return this;
    }

    emit (event, id, msg) {

        if(!this.event[event]) return;

        this.event[event].forEach( (v, i) => {

            if(v.id == id){
                setTimeout( () => {
                    v.fn(id, msg);
                },0);

                if(v.once) {
                    this.off(event, v.fn, v.id);
                }
            }
        });
        return this;
    }

    get event () {
        return this._event ? this._event : this._event = {};
    }
}


class InitAnimal extends InitProtopyte{
    constructor (obj, step = 0) {
        super();

        // 存储 配置数据 对象
        this.loadList = {};                         // 加载队列
        this._animal = {};                          // 存储解析的内容数据对象
        this.startItem = undefined;                 // 启动项 id

        this.stepIndex = Array.from(obj)[step].id;  // 游戏进度的对象id

        this.ready();                               // 启动
        this.entry(obj);                            // 解析

        this.isNext = true;                         // 是否可以进行一步，就是点击交互的下一步
        log('-123');
    }

    /*
    *
    * 将 config 解析为 正常数组数据。config可以是完整的配置信息，也可以是子节点的配置，甚至单个~~~
    * 以后要怎么改 config，或者要怎么解析config，都只改这个函数就形了。
    * */
    entry (config) {

        this.output(config);
        log(this._animal);
        this.emit('read-end', 'read', '解析config完毕');
        // log(this.event);
        return this;
    }

    output (config) {
        Array.from(config).forEach( (v, i) => {
            let _id = v.id;
            this._animal[_id] = {
                loadState: 'before'
            };
            Object.assign(this._animal[_id],v);
            // this.emit('addNext',v.id,'fuck');
            //设定启动项
            if(this.startItem === undefined) {
                this.startItem = this._animal[_id];
            }
            if(v.child) {
                this.output(v.child);
            }

            // this.once('addNext',function (id) {
            //     v.next = id;
            // },v.next);

        });

        return this;
    }

    play () {
        let that = this;
        let currItem = this._animal[this.stepIndex];
        if(currItem.loadState != 'loaded') {
            log('未加载完成');
        }
        if(this.isNext) {
            if(currItem.loadState != 'loaded') {
                // 如果并未加载，则进入加载序列
                if(currItem.loadState == 'before') {
                    this.loading(currItem);
                }

                this.on('loaded', function (id) {
                    log('加载完成', that.event);
                    that.isNext = true;
                }, currItem.id);
                this.isNext = false;

                // 加载下一步
                if(currItem.next && this._animal[currItem.next]){
                    let nextItem = this._animal[currItem.next];
                    if(nextItem.loadState == 'before') {
                        this.loading(nextItem);
                    }
                }

            }else{

            }
        }



    }

    ready () {

        // 不加载子节点，当开始游戏后，进入当前父节点，会自行判断子节点加载与否，下一节点加载与否
        this.once('read-end', () => {
            let one = this._animal[this.stepIndex];
            let next = one.next ? this._animal[one.next] : null;
            let three = ( next && next.next ) ? this._animal[next.next] : null;
            this.load([one, next, three],false);
        }, 'read')
    }

    load (item, child = false) {
        let that = this;
        log(item);
        Array.from(item).forEach( (v, i) => {
            if(v.loadState == 'before') {
                v.loadState = 'loading';
                v.loadStep = 0;
                this.on('nodeLoaded', function () {
                    v.loadStep++;
                    if(v.loadStep >= v.dataLenght){
                        v.loadState = 'loaded';
                        that.emit('loaded', v.id, 'is loaded');
                        that.off('nodeLoaded', this, v.id);
                        log(that._animal)
                    }

                }, v.id);

                this.loading(v);
            }
        });
    }

    loading (item) {
        let that = this;

        // 子节点也在这里进行处理,,,目前先不考虑子节点 2018.11.12

        // 获取自身 img，音频，视频等资源个数。然后侦听一个加载消息
        // 假设 资源个数 为 5
        // 假设 资源 存放 在 data
        if(item.component){
            item.dataLenght = item.component.length;
            item.components = {};
            item.component.forEach( (v, i) => {
                let img = new Image();
                img.src = v.config.src;
                img.onload = function () {
                    let imgPanel = new ImagePanel(img,v.config.width,v.config.height);
                    item.components[i] = imgPanel;

                    // 模拟加载状态
                    setTimeout(function () {
                        that.emit('nodeLoaded', item.id, 'loaded');
                    },2000)

                }
            })
        }else{
            item.dataLenght = 0;
            that.emit('nodeLoaded', item.id, 'loaded');
        }


    }
}

export default InitAnimal;
