/**
 *
 * name: add.support
 * date: 2018/11/4
 * author: cengfucheng
 * about: 主要是添加ie8，9等。dom操作的支持
 *
 */

;(function(constructor) {

    if (constructor && constructor.prototype) {
        // firstElementChild
        if (constructor.prototype.firstElementChild == null) {
            Object.defineProperty(constructor.prototype, 'firstElementChild', {
                get () {
                    let node = Array.from(this.childNodes).filter( (v, i) => {
                        if( v && v.nodeType === 1) {
                            return v;
                        }
                    });
                    if(node !== null){
                        return node[0];
                    }else{
                        return null;
                    }
                }
            });
        }


        //lastElementChild
        if(constructor.prototype.lastElementChild == null) {
            Object.defineProperty(constructor.prototype, 'lastElementChild', {
                get () {
                    let node = this.lastChild;
                    while (node && node.nodeType !== 1)
                        node = node.previousSibling;
                    return node;

                }
            })
        }

    }

    if(!('nextElementSibling' in document.documentElement)) {
        Object.defineProperty(Element.prototype, 'nextElementSibling', {
            get () {
                let node = this.nextSibling;
                while (node && node.nodeType !== 1)
                    node = node.nextSibling;
                return node;
            }
        })
    }

    if(!('previousElementSibling' in document.documentElement)) {
        Object.defineProperty(Element.prototype, 'previousElementSibling', {
            get () {
                let node = this.lastChild;
                while (node && node.nodeType !== 1)
                    node = node.previousSibling;
                return node;
            }
        })
    }

})(window.Node || window.Element)


;(function (window) {
    let lastTime = 0;
    if(window.requestAnimationFrame) {
        let vendors = ['webkit','moz','ms'];
        vendors.forEach((v, i) => {
            if(window[v + 'RequestAnimationFrame']) {
                window.requestAnimationFrame = window[v + 'RequestAnimationFrame'];
                window.cancelAnimationFrame = window[v + 'CancelAnimationFrame'] || window[v + 'CancelRequestAnimationFrame'];
                return;
            }
        });
    }
    if(!window.requestAnimationFrame){
        window.requestAnimationFrame = (fn, element) => {
            let currTime = +new Date,
                timeToCall = Math.max(0, 16.7 - (currTime + lastTime)),
                id = window.setTimeout(function () {
                    fn(currTime+timeToCall);
                },timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        }
    }
    if(!window.cancelAnimationFrame){
        window.cancelAnimationFrame = (id) => {
            clearTimeout(id);
        }
    }

})(window)



// class AddSupport {
//     constructor () {
//         // if(new.target == AddSupport) throw new Error('不支持实例化');
//         this.inits();
//     }
//
//     inits (constructor) {
//         let _constructor = constructor || window.Node || window.Element;
//         this.FirstElementChild(_constructor);
//         this.LastElementChild(_constructor);
//     }
//
//     FirstElementChild (constructor) {
//         if(constructor &&
//            constructor.prototype &&
//            constructor.prototype.firstElementChild == null) {
//             Object.defineProperty(constructor.prototype, 'firstElementChild', {
//                 get: function() {
//                     let node = null;
//                     console.log(this)
//                     node = Array.from(this.childNodes).filter( (v, i) => {
//                         if( v && v.nodeType === 1) {
//                             return v;
//                         }
//                     });
//
//                     if(node !== null){
//                         return node[0];
//                     }else{
//                         return node;
//                     }
//                 }
//             })
//         }
//     }
//
//     LastElementChild (constructor) {
//         if(constructor &&
//            constructor.prototype &&
//            constructor.prototype.lastElementChild == null) {
//             Object.defineProperty(constructor.prototype, 'lastElementChild', {
//                 get () {
//                     let node = null, childNodes, i = 0;
//                     childNodes = Array.from(constructor.childNodes);
//                     i = childNodes.length;
//                     while (i--){
//                         node = childNodes[i];
//                         if(node.nodeType === 1) return node;
//                     };
//
//                     return node;
//                 }
//             })
//         }
//     }
// }
//
// export default AddSupport;
