/**
 *
 * name: PlayImage
 * date: 2018/11/22
 * author: cengfucheng
 * about: 帧动画js
 *
 */

const POINTMODE = 'point';          // 换坐标模式
const SRCMODE = 'src';              // 换图片模式

import utils from '../../utils/Xk.utils';

class PlayImage {
    constructor (mode, config, canvas, fn) {
        this._list = {};
        this._playList = [];
        this.canvas = canvas;
        this.canvas.style.position = 'absolute';
        this.ctx = this.canvas.getContext('2d');
        // 到时候根据分辨率进行兼容，目前设定 比例为 640
        this.dir = 640/utils.getScreenRect().width;
        switch (mode) {
            case SRCMODE :
                config.forEach( (v, i) => {
                    let _animal = [];

                    if(!this._playList[i]) this._playList[i] = {
                        tag: v.tag,
                        animal: _animal
                    };

                    v.source.forEach( (sv, si) => {
                        utils.loadImage(sv,(img) => {
                            // 检测是否有相同的图片已经存在
                            let imgItem = Object.keys(this._list).filter( (v, i) => {
                                if(sv == this._list[v].url) {
                                    return this._list[v];
                                }
                            });
                            if(imgItem[0]) {
                                _animal[si] = this._list[imgItem[0]];
                            }else {
                                this._list[`${i}|${si}`] = {
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

                        })
                    })

                })
                break;
            case POINTMODE :

                break
        }

        document.addEventListener('click', (e) => {
            this.canvas.width = this._playList[0].animal[0].width;
            this.canvas.height = this._playList[0].animal[0].height;
            this.ctx.drawImage(this._playList[0].animal[0].img,this._playList[0].animal[0].x,this._playList[0].animal[0].y,
                this._playList[0].animal[0].width,this._playList[0].animal[0].height);
        })
        // log(this._list, this._playList)

    }

    play () {

    }

    wait () {

    }

    end () {

    }

    repeat () {

    }

    clean () {

    }


}

export default PlayImage;
