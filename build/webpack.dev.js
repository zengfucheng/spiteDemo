/**
 *
 * name: webpack.dev
 * date: 2018/11/5
 * author: cengfucheng
 * about:
 *
 */
const path = require('path');

const merge = require('webpack-merge');
const webpack = require('webpack');

const webpackBase = require('./webpack.base');
let FriendlyErrorsPlugin = require("friendly-errors-webpack-plugin");       // 友好提示插件
let portfinder = require('portfinder');                                     // 端口配置插件

const webpackDevconfig = merge(webpackBase, {
    mode: 'development',
    devtool: 'source-map',
    devServer: {
        contentBase: false,                      // 绑定静态资源用
        historyApiFallback: true,
        hot: true,
        // hotOnly: true,                      //只热更新，意思就是 禁止自动刷新页面
        inline: true,                          //必须，实时刷新。不配置的话，不生效热更
        host: 'localhost',
        compress: true,                         // gip压缩
        port: 3000,
        open: false,                            // 不自动打开浏览器
        quiet: true                             // 屏蔽打包启动信息
    },
    output: {
        filename: 'js/[name].js',
        publicPath: '/',                            // 相对路径，针对css内图片引用的补充。必须～～～
        path: path.resolve(__dirname,'../','dist')
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
});

// 返回一个promise对象，是为了检测可用端口～～
module.exports = new Promise( (resolve, reject) => {
    portfinder.basePort = webpackDevconfig.devServer.port;      // 获取预设端口
    portfinder.getPort( (err, port) => {
        if(err) {
            reject(err);
        }else{
            webpackDevconfig.devServer.port = port; // 可以使用的port
            webpackDevconfig.plugins.push(new FriendlyErrorsPlugin({
                compilationSuccessInfo: {
                    messages: [`开发环境启动成功，项目运行在: http://${webpackDevconfig.devServer.host}:${port}`],
                },
                onErrors () {
                    console.log("打包失败")
                }
            }));
            resolve(webpackDevconfig);
        }
    })
})


