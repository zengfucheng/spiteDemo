/**
 *
 * name: Dialog.panel
 * date: 2018/11/22
 * author: 三
 * about:
 *
 */
import '../../css/Tool.css';
import Panel from './Panel';



class Dialog extends Panel{
    constructor(){
        super();
    }
    static DialogBox(txt){
        let div1 = document.createElement('div');//弹窗
        div1.id = "alertWindow";
        div1.classList.add('dolagbox');
        let text = document.createElement('div');
        text.id = 'txt';
        if (txt){
            text.innerText = txt;
            div1.appendChild(text)
        }
        this.prototype.panel = div1;
        this.prototype.show();
    }

    static close(){
        this.prototype.close();
    }
}

export default Dialog;