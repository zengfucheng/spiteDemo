/**
 *
 * name: NextImage
 * date: 2018/11/22
 * author: cengfucheng
 * about: 帧动画js
 *
 */
import utils from '../../utils/Xk.utils';

import CanvasEngine from '../../canvas.lib/canvas.engine';

import Panel from '../Panel';

import config from './dataToImg';
import PlayImage from './PlayImage';

const POINTMODE = 'point';          // 换坐标模式
const SRCMODE = 'src';              // 换图片模式

let loadStep = 0;

class NextImage extends Panel {
    constructor (fn) {
        super();
        this.panel = this.doc.createElement('div');
        this.show();
        // 到时候根据分辨率进行兼容，目前设定 比例为 640
        this.dir = 640/utils.getScreenRect().width;

        this.config = config;
        this.name = this.config.name;
        this.uid = this.config.uid;
        this.animal = [];
        this._events = {};

        if(this._getObjectClass(this.config.module) !== 'Array')  throw new Error('帧动画数据不是数组格式。');
        this.moduleLength = this.config.module.length;
        this.isReady = false;                               //没有组装完成

        this.ready(fn);

        this.config.module.forEach( (v, i) => {
            this.newSlider(v, i);
        });

    }

    ready (fn) {
        this._on('joinComponent', (a,s,s1) => {
            loadStep++;
            if(loadStep >= this.moduleLength) {
                this.isReady = true;
                this._off('joinComponent');
                this.animal.forEach( (v, i) => {
                    v._isInit = false;
                    if(v.target) {
                        let _playList = v.target.playList;
                        let _img = {};
                        if(_playList) {
                            _img = _playList[v.state].animal[0];
                            v.target.canvas.width = _img.width;
                            v.target.canvas.height = _img.height;
                            v.target.ctx.drawImage(_img.img,_img.x,_img.y,_img.width,_img.height);

                        }
                    }
                })
                fn();
                this.play(0);
            }
        }, this.name);


    }

    play (num) {
        let _data = [];
        let _groupItem = this.config.group[num];
        let _target = {};
        let _playItem = {};
        _groupItem.forEach( (v, i) => {

            _data = v.data.split('-');
            _target = this.animal[_data[0]];
            if(!_target.runData) {
                _target.runData = {};
                Object.assign(_target.runData, v);
            };
            if(_target._playing) {
                if(_target.state == v.data) {
                    _playItem = _target.target.playList[_data[1]];
                    if(!Number.isNaN(_target.runData.count)) _target.runData.count++;
                    return;
                }else {
                    _target._playing = false;
                    _target.state = v.data;
                    _target.runData = {};
                    Object.assign(_target.runData, v);
                    _playItem = _target.target.playList[_data[1]];
                    setTimeout(() => {
                        _target._playing = true;
                        this._runtime(_target, _playItem);
                    },0);
                }
            }else{
                _target._playing = true;
                _target.state = v.data;
                Object.assign(_target.runData, v);
                _playItem = _target.target.playList[_data[1]];
                this._runtime(_target, _playItem);
            }


            // log(_target)

        });

        return this;
    }

    pause () {

    }

    /*
    *
    * 离开组件后，清除资源
    * */
    unload () {
        this.animal.forEach( (v, i) => {
            v._playing = false;
            setTimeout(() => {
                this.animal[i] = null;
                this.animal.splice(i,1);
            }, 0);
        });
    }

    /*
    *
    * 动画运行
    * */
    _runtime (target, list) {
        let index = 1;
        let that = this;
        let _time = this._getTime();
        let _newTime = null;
        let _imgItem = {};
        let _animalLen = list.animal.length;
        let _count = 0;
        let _state = target.state;
        function draw() {
            if(_state != target.state) return;

            if(target._playing == false) return;
            _newTime = that._getTime();

            if(_newTime - _time >= target.runData.time) {
                _imgItem = list.animal[index];
                // log(_imgItem)
                target.target.canvas.width = _imgItem.width;
                target.target.canvas.height = _imgItem.height;
                target.target.ctx.drawImage(_imgItem.img,_imgItem.x,_imgItem.y,_imgItem.width,_imgItem.height);
                if(!Number.isNaN(target.runData.count) && _count > target.runData.count) {
                    target._playing = false;
                    return;
                }
                index++;
                _time = _newTime;
                if(index >= _animalLen) {
                    index = 0;
                    _count++;
                    if(target.runData.wait) {
                        setTimeout( () => {
                            requestAnimationFrame(draw);
                        }, target.runData.wait);
                        return;
                    }
                }
            }
            requestAnimationFrame(draw);
        }
        requestAnimationFrame(draw)
    }

    _getTime () {
        return Date.now ? Date.now() : new Date().getTime();
    }

    _on (event, fn, target, once) {
        if (!this._events[event]) this._events[event] = [];
        ~~once ? this._events[event].push({id: target, fn:fn, once:1}) :
                this._events[event].push({id: target, fn:fn});
        return this;
    }

    _once (event, fn, target) {
        this._on(event, fn, target, 1);
        return this;
    }

    _off (event, fn, target) {
        if(fn) {
            this._events[event].forEach( (v, i, arr) => {
                if(v.id == target) {
                    arr.splice(i, 1);
                }
            });
        }else  if(event) {
            this._events[event] = [];
        }else {
            Object.keys(this._events).forEach( (v, i) => {
                this._events[v] = [];
            })
        }
        return this;
    }

    _emit (event, target, msg) {
        if(!this._events[event]) return this;
        this._events[event].forEach( (v, i) => {
            if(v.id == target) {
                setTimeout(() => {
                    v.fn(this, target, msg);
                },0);
                if(v.once) {
                    this._off(event, v.fn, target);
                }
            }
        })
        return this;
    }

    loadImg (src, fn) {
        let img = new Image();
        img.src = src;
        if(img.complete == 'complete') {
            if(typeof fn == 'function') fn(img);
            fn = null;
            return this;
        }
        img.onerror = () => {
            img.onload = img.onerror = null;
            img = null;
            fn = null;
            throw new Error(`图片加载错误: ${url}`);
        }
        img.onload = () => {
            if(typeof fn == 'function') fn(img);
            img.onload = img.onerror = null;
            img = null;
            fn = null;
            return this;
        }
    }

    /*
    *
    * 生成图片对象
    * */
    newSlider (_config, index) {
        // log(_config)
        let _targetType = '';
        let _targetData = _config.target.data;
        let _targetSource = _config.target.source;
        let _mode = _config.mode;

        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        canvas.style.position = 'absolute';
        this.panel.appendChild(canvas);
        this._getModuleImageLength(_config);
        switch (_mode) {
            case SRCMODE :
                // if(_targetData) {
                    // log(_config);
                    let _playImage = {
                        canvas: canvas,
                        ctx: ctx,
                        list: [],
                        playList: []
                    };
                    this._joinComponent(SRCMODE, _config, _playImage, () => {
                        this.animal[index] = {
                            _isInit: false,
                            _playing: false,
                            name: _config.name,
                            state: _config.state,
                            autoPlay: _config.autoPlay,
                            target: _playImage
                        }
                    });
                    // let _playImage = new PlayImage(SRCMODE, _targetData, canvas);
                    // this.animal[index] = {
                    //     name: _config.name,
                    //     target: _playImage
                    // }
                // }else {
                //     // 绘制单张无动画的图片
                //     _targetType = this._getObjectClass(_targetSource);
                //     if(_targetType === 'String') {
                //         this.loadImg(_targetSource,(img) => {
                //             canvas.width = img.width / this.dir;
                //             canvas.height = img.height / this.dir;
                //             ctx.drawImage(img,0,0,img.width / this.dir,img.height / this.dir);
                //             this.animal[index] = {
                //                 _isInit: false,
                //                 name: _config.name,
                //                 state: _config.state,
                //                 autoPlay: _config.autoPlay,
                //                 target: canvas
                //             }
                //             _config.isOk = true;
                //             this._emit('joinComponent',this.name,'join end')
                //         })
                //     }
                // }


                break;
            case  POINTMODE :

                break;
        }

        log(this.animal)

        return this;
    }

    /*
    *
    * 组合单个模块
    * */
    _joinComponent (_mode, _config, _obj, _fn) {
        let _data = _config.target.data;
        let index = 0;
        if(_data) {
            switch (_mode) {
                case SRCMODE :
                    _data.forEach( (v, i) => {
                        let _animal = [];
                        if(!_obj.playList[i]) {
                            _obj.playList[i] = {
                                tag: v.tag,
                                animal: _animal
                            }
                        }
                        v.source.forEach( (sv, si) => {
                            this.loadImg(sv, (img) => {

                                // 有相同且已加载好的图片，直接用
                                let imgItem = Object.keys(_obj.list).filter( (v, i) => {
                                    if(sv == _obj.list[v].url) return _obj.list[v];
                                });

                                if(imgItem[0]) {
                                    _animal[si] = _obj.list[imgItem[0]];
                                }else {
                                    _obj.list[`${i}|${si}`] = {
                                        url: sv,
                                        img: img,
                                        x: 0,
                                        y: 0,
                                        width: img.width / this.dir,
                                        height: img.height / this.dir
                                    }
                                    _animal[si] = {
                                        url: sv,
                                        img: img,
                                        x: 0,
                                        y: 0,
                                        width: img.width / this.dir,
                                        height: img.height / this.dir
                                    }
                                }

                                // 单个组件拼装完成
                                index++;
                                if(index >= _config.imgLength) {
                                    _config.isOk = true;
                                    this._emit('joinComponent',this.name,`${_config.name}load end`)
                                }

                            })
                        })

                    })
                    break;
                case POINTMODE :

                    break
            }
        }else {
            _data = _config.target.source;
            if(this._getObjectClass(_data) === 'String') {
                this.loadImg(_data, (img) => {
                    let _animal = [];
                    if(!_obj.playList[0]) {
                        _obj.playList[0] = {
                            tag: _config.name,
                            animal: _animal
                        }
                    }
                    _animal.push({
                        url: _data,
                        img: img,
                        x: 0,
                        y: 0,
                        width: img.width / this.dir,
                        height: img.height / this.dir
                    });

                    // 单个组件拼装完成
                    index++;
                    if(index >= _config.imgLength) {
                        _config.isOk = true;
                        this._emit('joinComponent',this.name,`${_config.name}load end`)
                    }
                });
            }
        }

        _fn();

        return this;
    }

    /*
    *
    * load 组件计数
    * ed 方法
    * */
    onLoadStep () {
        // loadStep++;
        // if(loadStep >= this.moduleLength) {
        //     this.isReady = true;
        //
        // }
        // return this;
    }

    /*
    *
    * 获取 并 设置 单个组件的图片总数
    * */
    _getModuleImageLength (data) {
        let index = 0;
        let _type = '';
        if(!data.target) return this;
        let compute = (obj) => {
            _type = this._getObjectClass(obj);
            if(_type === 'Array') {
                obj.forEach( (v, i) => {
                    _type = this._getObjectClass(v);
                    if(_type === 'Object') {
                        if(v['source']) {
                            _type = this._getObjectClass(v['source']);
                            if(_type === 'String') {
                                index++;
                            }else if(_type === 'Array') {
                                index += v['source'].length;
                            }
                        }
                    }
                });
            }else  if(_type === 'Object') {
                Object.keys(data.target).filter( (v, i) => {
                    if(v == 'data' || v == 'source') return v;
                }).forEach( (v, i) => {
                    _type = this._getObjectClass(data.target[v]);
                    if(_type === 'String') {
                        index++;
                    }else if(_type === 'Array') {
                        compute(data.target[v]);
                    }
                });
            }

        }
        compute(data.target);
        data.imgLength = index;
        data.isOk = false;
        return this;
    }

    /*
    *
    * 返回对象的类型
    * */
    _getObjectClass (obj) {
        let str = Object.prototype.toString.call(obj);
        return str.substring(8, str.length-1);
    }
}

export default NextImage;
