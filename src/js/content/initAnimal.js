/**
 *
 * name: initAnimal
 * date: 2018/11/8
 * author: cengfucheng
 * about: 初始化config类
 *
 */

import utils from '../utils/Xk.utils';

import EventEmiter from '../event/xk.event';

import ImagePanel from '../component/image.panel';              // 绘制img的组件

import DataAnimal from './dataAnimal';                          // 数据组件

import LoadPanel from '../component/Load.panel';

import NextImage from '../component/nextImage/NextImage';

class InitAnimal extends EventEmiter{
    constructor (obj, step = 0) {
        super();

        // 存储 配置数据 对象
        this._animal = {};                          // 存储解析的内容数据对象
        this.startItem = undefined;                 // 启动项 id

        this.stepIndex = Array.from(obj)[step].id;  // 游戏进度的对象id
        this.loadPanel = new LoadPanel();
        this.loadPanel.show();

        // 到时候根据分辨率进行兼容，目前设定 比例为 640
        this.dir = 640/utils.getScreenRect().width;

        this.ready();                               // 启动
        this.entry(obj);                            // 解析

        let _testImage = new NextImage();

        document.addEventListener('touchstart', function (e) {
            _testImage.play(1)
        }, false)

        this.isNext = true;                         // 是否可以进行一步，就是点击交互的下一步

        this.loadStep = 0;

        this.on('loadStep', (item, id, msg) => {
            if(msg != 'node') return;
            if(this.loadStep >= 3) this.loadPanel.hidden();
            this.loadStep++;
        }, this)
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

    output (config, parent) {
        let that = this;
        Array.from(config).forEach( (v, i) => {
            let _id = v.id;
            // this._animal[_id] = {
            //     loadState: 'before'
            // };


            // 以后有开发工具，这里就要删除
            //------------
            if(parent) {
                // 子节点才有父级，乃至祖先，兄弟则只是先后顺序
                if(v.type == 'child'){
                    v.parent = parent;
                }
            }
            // 目前因为设计，不回到子节点，直接回到父节点。所以不考虑子节点的后继性
            if(v.next && typeof v.next === 'number') {
                if(v.type == 'node') {
                    this.once('prevNode', function (id) {
                        that._animal[v.next].prev = _id;
                    }, _id);
                }
            }
            //------------

            this._animal[_id] = new DataAnimal(v);
            // Object.assign(this._animal[_id],v);
            log('zfc is great');

            // this.emit('addNext',v.id,'fuck');
            //设定启动项
            if(this.startItem === undefined) {
                this.startItem = this._animal[_id];
            }
            if(v.child) {
                this.output(v.child, _id);
            }
            this.emit('prevNode', _id, 'my brother');
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
                this.loadPanel.show();
                this.once('loaded', function (id) {
                    log('加载完成1111', that._event);
                    that.loadState = 'loaded';
                    that.isNext = true;
                    that.emit('loadStep', that, currItem.type);

                    currItem.start();                               // 完成的时候，调用对象初始化函数
                }, currItem.id);
                // 如果并未加载，则进入加载序列
                if(currItem.loadState == 'before') {
                    this.load(currItem);
                    log('未加载111');
                }

                this.isNext = false;

                // 加载下一步
                if(currItem.next && this._animal[currItem.next]){
                    let nextItem = this._animal[currItem.next];
                    if(nextItem.loadState == 'before') {
                        this.load(nextItem);
                    }
                }

            }else{
                log(currItem)
                if(currItem.nexts()) {
                    if(typeof currItem.next === 'number') {
                        this.stepIndex = currItem.next;
                        // this.play();
                        let nextItem = this._animal[this.stepIndex];
                        nextItem.nexts();
                    }else{
                        log('game over!');
                        return;
                    }


                }

                if(currItem.into) {
                    if( currItem.next && typeof currItem.next === 'number' &&
                        this._animal[currItem.next] &&
                        this._animal[currItem.next].loadState != 'loaded') {
                        log(this._animal[currItem.next], 'zzzz')
                        this.load(this._animal[currItem.next]);
                    }
                }

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
        if(Array.isArray(item)){
            item.forEach( (v, i) => {
                _load(v);
            });
        }else{
            _load(item);
        }
        function _load(v) {
            if(v.loadState == 'before') {
                v.loadStep = 0;
                v.dataLength = 0;
                that.on('nodeLoaded', function () {
                    v.loadStep++;
                    if(v.loadStep >= v.dataLength){
                        v.loadState = 'loaded';
                        that.emit('loaded', v.id, 'is loaded');
                        that.emit('loadStep', that, v.type);
                        that.off('nodeLoaded', this, v.id);
                        if(v.type == 'child') {
                            that.emit('nodeLoaded', v.parent, 'child is loaded');
                        }
                    }

                }, v.id);

                that.loading(v);
            }
        }
    }

    loading (item) {
        let that = this;
        // item.groupStep = 0;                 // 下一步步进
        item.loadState = 'loading';
        // 子节点也在这里进行处理,,,目前先不考虑子节点 2018.11.12

        // 获取自身 img，音频，视频等资源个数。然后侦听一个加载消息
        // 假设 资源个数 为 5
        // 假设 资源 存放 在 data
        if(item.component){
            item.dataLength = item.component.length;
            item.components = {};
            item.component.forEach( (v, i) => {
                // 到时候，根据 v.fileType 来判断

                Object.keys(v.config).forEach( (_v, i) => {
                    if(typeof v.config[_v] == 'number') {
                        v.config[_v] = Math.round( Math.round( ( v.config[_v]/this.dir ) * 1000) / 1000);
                    }
                });
                let img = new Image();
                img.src = v.config.src;
                img.onload = function () {
                    let imgPanel = new ImagePanel(img,v.config.width,v.config.height);
                    item.components[i] = imgPanel;

                    // that.emit('nodeLoaded', item.id, 'loaded');
                    // 模拟加载状态
                    setTimeout(function () {
                        that.emit('nodeLoaded', item.id, 'loaded');
                    },2000)

                }
            })
        }else{
            that.emit('nodeLoaded', item.id, 'loaded');
        }

        // 目前还是存在无限加载子节点 11.22
        if(item.child){
            item.dataLength += item.child.length;
            this.load(item.child.map( (v, i) => {
                return this._animal[v.id];
            }));
        }

    }
}

export default InitAnimal;
