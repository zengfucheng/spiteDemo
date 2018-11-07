/**
 *
 * name: MessagePanel
 * date: 2018/11/3
 * author: cengfucheng
 * about: 弹框组件
 *
 */

import '../../css/message.panel.scss';
import utils from './Xk.utils';
import MessageBase from './Message.base';

let ID = Symbol('id');
class MessagePanel extends MessageBase {
    constructor (options) {
        super ()
        if(new.target != MessagePanel){
            throw new Error('不支持直接调用, 仅供实例化.')
        }
        this.id = this[ID] ();
        let { type, content } = options;
        if(!type) {
            throw new Error('弹框未指定类型。')
        }
        this[type]({content});
        console.log(this);
    }

    [ID] () {
        return utils.getTime();
    }

    show () {
        this.msgBox.style.transform = 'scale(1)';
    }

    hidden () {
        console.log(123);
        this.msgBox.style.transform = 'scale(0)';
    }

    close (fn) {

        this.hidden();
        if(fn){
            fn();
        }
    }

    /*
    *
    * 普通弹框
    * */
    alert ({content}) {
        let doc = document;
        let alert = doc.createElement('div');
        let child = doc.createElement('div');
        let msg = doc.createElement('div');
        let bottomBox = doc.createElement('div');
        let sure = doc.createElement('span');
        utils.addClass(alert, 'msg-base-box');
        utils.addClass(child, 'msg-base-box-con');
        utils.addClass(msg, 'msg-base-box-con-mid');
        utils.addClass(bottomBox, 'msg-base-box-con-bottom');

        sure.innerHTML = '确定';
        bottomBox.appendChild(sure);

        let click = (e) => {
            this.close( () => {
                utils.removeEvent(e.target, click)
                console.log(e.target)
            });
        }

        utils.addEvent(sure,'click',click)

        msg.innerHTML = content;
        alert.appendChild(child);
        child.appendChild(msg);
        child.appendChild(bottomBox);
        this.msgBox.appendChild(alert);
        this.show(alert);
    }

    /*
    *
    * 确认弹框
    * */
    comfirm () {

    }


    /*
    *
    * 输入弹框
    * */
    prompt () {

    }


}

// export { MessagePanel }
export default MessagePanel;
