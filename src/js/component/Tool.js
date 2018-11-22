/**
 *
 * name: Tool
 * date: 2018/11/15
 * author: 三
 * about:扩展工具
 *
 */

import Utils from "../utils/Xk.utils";
import '../../css/Tool.css';

class Tool{
    constructor(){
        if(new.target === Tool) throw new Error('本类不支持实例化');
    }
    static alertWindow(obj){
        /*
        * obj对象={
        *       type：弹窗内容分类 custom为图片或按钮选项，option为有对话选项，
        *       list：选择option时传入[xxx,xxx]，custom时传入[[xxx,fn],[xxx,fn]]
        *       close：选择option后取消按钮回调函数
        *       apply: 选择option后确定按钮回调函数
        * }
        *
        */
        let nav = obj;
        let div = document.createElement('div');//遮罩
        div.style.cssText = 'width:100%;height:100%;background: rgba(0, 0, 0, 0.5);z-index:998;position:absolute;top:0';
        let div1 = document.createElement('div');//弹窗
        div1.id = "alertWindow";
        let txt = document.createElement('div');
        txt.id = 'txt';
        if (nav.txt){
            txt.innerText = nav.txt;
            div1.appendChild(txt)
        }
        div1.style.cssText = "max-width:400px;height:200px;max-height:300px;border:1px solid #000;margin:auto;position:absolute;top:0;bottom:0;left:0;right:0;background:#f6f6f6";
        if (nav.type === 'custom'){
            div1.appendChild(this.cusTom(nav,div,div1));
        }
        if (nav.type === 'option') {
            div1.appendChild(this.optIon(nav,div));
        }
        div.appendChild(div1);
        document.body.appendChild(div);
    }
    static cusTom(obj,div,div1){
        let nav = obj
        let arr = [];
        let but_p = document.createElement('div');
        let len = nav.list.length
        but_p.classList.add('but');
        for (let i = 0;i<len;i++){
            if (/.(png|jpg|jpeg|gif)$/g.test(nav.list[i][0])) {
                arr.push([document.createElement('img'),nav.list[i][1]]);
                arr[i][0].src = nav.list[i][0];
                console.log(div1)
                arr[i][0].height = parseInt(div1.style.height)/len;
            }else {
                arr.push([document.createElement('input'),nav.list[i][1]]);
                arr[i][0].value = nav.list[i][0];
                arr[i][0].type = 'button';
            }
            Utils.addEvent(arr[i][0],'click',()=>{
                arr[i][1]();
                document.body.removeChild(div)
            },false);
            but_p.appendChild(arr[i][0]);
        }
        return but_p;
    }
    static optIon(obj,div){
        let nav = obj;
        let div3 = document.createElement('div');
        let check_div = document.createElement('from');
        let p = document.createElement('p');
        let but_yes = document.createElement('input');
        let but_no = document.createElement('input');
        if (nav.list){
            let str = '';
            for (let i = 0;i<nav.list.length;i++){
                str+='<input type="radio" name="radio">'+nav.list[i]+'</br>'
            }
            check_div.innerHTML = str;
            div3.appendChild(check_div);
        }
        but_no.type = 'button';
        but_yes.type = 'button';
        but_no.value = '取消';
        but_yes.value = '确定';
        p.appendChild(but_yes);
        p.appendChild(but_no);
        div3.appendChild(p);
        Utils.addEvent(but_no,'click',()=>{
            nav.close();
            document.body.removeChild(div)
        },false);
        Utils.addEvent(but_yes,'click',()=>{
            nav.apply();
            document.body.removeChild(div)
        },false)
        return div3;
    }
    static Sibing(ev){//获取元素所有兄弟元素
        let ele = ev.parentNode.children;
        let arr = [];
        for (let i = 0;i<ele.length;i++){
            if (ele[i] !== ev) arr.push(ele[i]);
        }
        return arr;
    }
    static setStyle(el,style){//设置css
        let str = '';
        if (typeof style === "string") {
            str = style
        }else if (typeof style === 'object') {
            for (let i in style){
                str += i +':'+style[i]+';';
            }
        }
        el.style.cssText += ';'+ str;
    }
    static Ajax(obj){
        /*
        * obj,tyoe:get或者post
        * url请求路径
        * obj.aysn：false为同步true为异步，默认为异步
        * obj.fn请求成功后回调函数
        * */
        let xhr;
        if (window.ActiveXObject){//兼容IE
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }else {
            xhr = new XMLHttpRequest();
        }
        xhr.open(obj.type,obj.url,obj.aysn || true);
        if (obj.type === 'post') {
            xhr.setRequestHeader("Content-type",obj.contType || "application/x-www-form-urlencoded")
        }
        xhr.send(obj.data||null);
        xhr.onreadystatechange = ()=>{
            if (xhr.readyState === 4&&xhr.status === 200) {
                obj.fn(xhr.response);
            }
        }
    }

}

export default Tool
