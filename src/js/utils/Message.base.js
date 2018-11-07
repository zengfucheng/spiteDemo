/**
 *
 * name: Message.base
 * date: 2018/11/2
 * author: cengfucheng
 * about: 弹框基本面板
 *
 */
import utils from './Xk.utils';
import '../../css/message.panel.scss';


class MessageBase {
    constructor () {
        if(new.target == MessageBase){
            throw new Error('不支持实例化, 仅供继承.');
        }
        let doc = document;
        this.msgBox = doc.createElement('div');

        utils.addClass(this.msgBox, 'msg-base');
        doc.firstElementChild.appendChild(this.msgBox);
    }

}

export default MessageBase;
