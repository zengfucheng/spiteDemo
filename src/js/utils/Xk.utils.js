/**
 *
 * name: Xk.utils
 * date: 2018/11/2
 * author: cengfucheng
 * about: 基本工具类库
 *
 */

class XkUtils {
    constructor () {
        if( new.target == XkUtils ) {
            throw new Error('不支持实例化，仅供静态调用.');
        }
    }


    static uid () {
        return Math.round(this.getTime() * Math.random());
    }

    /*
    *
    * 生成uuid 字符串
    * groupNum 组，indexNum 组内个数
    * */
    static uuid (groupNum = 4, indexNum = 4) {
        let uid, list = '0123456789', arr = [], i = 0;
        for(; i < groupNum; i++){
            arr[i] = i << 1;
        }
        uid = arr.map( () => {
            let num = indexNum;
            let id = '';
            while (num--) {
                id += list[Math.random() * 10 << 0];
            }
            return id;
        }).join('-');
        return uid;
    }

    /*
    *
    * 获取节点的子节点，主要是兼容
    * */
    static children (el) {
        let list = [];
        if(el.hasChildNodes()){
            list = Array.from(el.childNodes).filter( (v, i) => {
                if( v.nodeType === 1) return v;
            })
        }
        return list;
    }

    /*
    *
    * 加载图片
    * */
    static loadImage (url,callback) {
        let img = new Image();
        img.src = url;
        if(img.complete) {
            if(callback && typeof callback === 'function') callback(img);
            callback = null;
            return;
        }
        img.onerror = () => {
            img = img.onerror = img.onload = null;
            throw new Error(`load error: ${url}`);
        }
        img.onload = () => {
            if(callback && typeof callback === 'function') callback(img);
            img = img.onerror = img.onload = null;
            callback = null;
            return;
        }
    }

    /*
    *
    * 检测是否含有css类名
    * */
    static hasClass (el,c) {
        let re = new RegExp("(^|\\s)" + c + "(\\s|$)");
        return re.test(el.className);
    };

    /*
    *
    * 添加css类名
    * */
    static addClass (el, c) {
        if ( XkUtils.hasClass(el, c) ) {
            return;
        }
        let newclass = el.className.split(' ');
        newclass.push(c);
        el.className = newclass.join(' ');
    }

    /*
    *
    * 移除css类名
    * */
    static removeClass (el) {
        if ( !XkUtils.hasClass(el, c) ) {
            return;
        }
        let reg = new RegExp("(^|\\s)" + c + "(\\s|$)", 'g');
        el.className = el.className.replace(reg, ' ');
    }

    /*
    *
    * 获取时间戳
    * */
    static getTime () {
        return Date.now ? Date.now() : new Date().getTime();
    }


    /*
    *
    * 获取屏幕可用宽高
    * */
    static getScreenRect () {
        return {
            width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
            height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
        }
    }

    static getRect (ele) {
        let rect = ele.getBoundingClientRect();
        // return {width, height, top, left, right, bottom} = rect;
        return rect;
    }

    /*
    *
    * 添加事件
    * */
    static addEvent (el, type, fn, capture) {
        el.addEventListener(type, fn, !!capture);
    }

    /*
    *
    * 移除事件
    * */
    static removeEvent (el, type, fn, capture) {
        el.removeEventListener(type, fn, !!capture);
    }

}

export default XkUtils;
