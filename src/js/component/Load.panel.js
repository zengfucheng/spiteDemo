/**
 *
 * name: Load.panel
 * date: 2018/11/13
 * author: cengfucheng
 * about: loading 组件
 *
 */
import '../../css/load.panel.css';
import utils from '../utils/Xk.utils';
import Panel from './Panel';


class LoadPanel extends Panel{
    constructor () {
        super();
        this.panel = this.doc.createElement('div');
        this.img = this.doc.createElement('img');
        utils.addClass(this.panel, 'xk-loading');
        this.img.src = 'assets/other/loading.gif';
        this.panel.appendChild(this.img);
        // this.getStage.appendChild(this.panel);
    }




}

export default LoadPanel;
