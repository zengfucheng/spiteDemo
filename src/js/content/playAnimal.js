/**
 *
 * name: playAnimal
 * date: 2018/11/8
 * author: cengfucheng
 * about: 主要就是解析传入的对象，然后一条条展开其data数据
 *
 */

import utils from '../utils/Xk.utils';
import Data from './data';

// debug
let { log } = console;

let index = Symbol('index');
let nextBool = Symbol('nextBool');
const ITEM_LIST = {
    [index]: 0,
    [nextBool]: true
}

class PlayAnimal {
    constructor () {
        if(new.target === PlayAnimal) {
            throw new Error('本类不支持实例');
        }
    }

    static play (obj ) {
        log(ITEM_LIST[index], Data);
        let n = getNext(Data[obj.index].data);
        log(n.next());

    }
}

function getNext(arr) {
    let i = 0, len = arr.length;
    return {
        next () {
            return i < len ?
                {value: arr[i++], done: false} :
                {value: undefined, done: true}
        }
    }
}

export default PlayAnimal;
