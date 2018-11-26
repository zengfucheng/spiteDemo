/**
 *
 * name: NextImage
 * date: 2018/11/22
 * author: cengfucheng
 * about: 帧动画js
 *
 */
import utils from '../../utils/Xk.utils';

import Panel from '../Panel';

import config from './dataToImg';

const POINTMODE = 'point';          // 换坐标模式
const SRCMODE = 'src';              // 换图片模式

class NextImage extends Panel {
    constructor () {
        super();
        this.panel = this.doc.createElement('div');
        this.panel.innerHTML = 'test';
        this.panel.style.color = 'red';
        this.show();


        this.config = config;
        this.name = this.config.name;
        this.uid = this.config.uid;

        if(this.getObjectClass(this.config.module) !== 'Array')  throw new Error('帧动画数据不是数组格式。');
        this.config.module.forEach( (v, i) => {
            log(v);
            this.newSlide(v);
        });

    }

    newSlide (_config) {
        // 生成图片对象

    }

    getObjectClass (obj) {
        let str = Object.prototype.toString.call(obj);
        return str.substring(8, str.length-1);
    }
}

export default NextImage;
