/**
 *
 * name: image.panel
 * date: 2018/11/12
 * author: cengfucheng
 * about: 绘制人物，背景等等图片的组件
 *
 */
import { CanvasBase } from '../canvas.lib/canvas.engine';
import canvasEngine from '../canvas.lib/canvas.engine';

class ImageBase {
    constructor () {
        if(new.target === ImageBase) throw new Error('不支持实例化');
    }

    show () {
        if(!this._showBool) {
            CanvasBase.addChild(this.panel);
            this._showBool = true;
        }
    }

    close () {
        if(this._showBool) {
            CanvasBase.removeChild(this.panel);
            this._showBool = false;
        }
    }
}

class ImagePanel extends ImageBase{
    constructor (src, width, height) {
        super();


        this._showBool = false;
        this.panel = new canvasEngine();
        this.panel.width = width;
        this.panel.height = height;
        this.panel.drawImage(src,0,0,width,height);
    }

    get showBool () {
        return this._showBool;
    }

    set showBool (bool) {
        this._showBool = bool;
    }


}

export default ImagePanel;
