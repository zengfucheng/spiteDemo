const glob = require('glob');
const path = require('path');
const spritesmithPlugin = require('webpack-spritesmith');

function getGlobUrl(url, dir) {
    let urlPath = glob.sync(url);
    let config = {};
    let dirname, basename, extname, pathname;
    // console.log(urlPath)
    urlPath.forEach( (v, i) => {
        dirname = path.dirname(v);
        basename = path.basename(v);
        extname = path.extname(v);
        pathname = path.join(dirname,basename)
        if(extname.length != 0) return;
        // console.log(pathname);
        config[basename] = pathname;
    })
    return config;
}

function templateFunction(data){
    //生存的精灵图片jsonmob
    let node = {
        root: {
            url: '',
            width: 0,
            height: 0
        },
        com: 'px',
        list: []
    }
    let url =  'I'
        .replace('I', data.spritesheet.image);
    let bg = data.sprites.map( (value, index) => {
        return JSON.parse( '{"id": I, "width": W, "height": H, "px": X, "py": Y}'
            .replace('I', index)
            .replace('W', value.width)
            .replace('H', value.height)
            .replace('X', value.offset_x)
            .replace('Y', value.offset_y) ) ;
    } )

    // console.log(data.spritesheet);
    node.root.url = url;
    node.root.width = data.spritesheet.width;
    node.root.height = data.spritesheet.height;
    node.list = bg;
    return JSON.stringify(node);
}
let spriteOption = getGlobUrl('src/spriteImg/*', 'src');
let spriteImg =  Object.keys(spriteOption);
function newSprite(){
    let arr = [];
spriteImg.forEach( (v, i) => {
    let spriteConfig = {
        src: {
            cwd: path.resolve(__dirname, '../', spriteOption[v]),
            glob: '**/*'
        },
        target: {
            image: path.resolve(__dirname, '../', `./dist/sprite/${v}/${v}.png`),
            css: [
                // path.resolve(__dirname, `./dist/sprite/${v}/${v}.css`)
                [
                    path.resolve(__dirname, '../', `./dist/sprite/${v}/${v}.json`),
                    {
                        format: 'function_based_template'
                    }
                ]
            ]
        },
        customTemplates: {
            'function_based_template': templateFunction,
        },
        apiOptions: {
            cssImageRef: `./${v}.png`
        },
        spritesmithOptions: {
            // algorithm: 'top-down',
            padding: 10
        },
    };
    // module.exports.plugins.push(new spritesmithPlugin(spriteConfig));
    arr.push(new spritesmithPlugin(spriteConfig));

    // console.log(spriteOption[v])
});
    return arr;
}
module.exports = newSprite;
