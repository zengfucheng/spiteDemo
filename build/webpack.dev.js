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
const miniCssExtractPlugin = require('mini-css-extract-plugin');

const webpackBase = require('./webpack.base');



module.exports = merge(webpackBase,{
    mode: 'development',
    devtool: 'source-map',
    devServer: {
        contentBase: '/',
        historyApiFallback: true,
        hot: true,
        // hotOnly: true,                      //只热更新，意思就是 禁止自动刷新页面
        inline: true,                       //必须，实时刷新。不配置的话，不生效热更
        host: 'localhost',
        port: 8080
    },
    output: {
        filename: 'js/[name].js',
        path: path.resolve(__dirname,'../','dist')
    },
    plugins: [
        new miniCssExtractPlugin({
            filename: 'css/[name].css',
            chunkFilename: '[id].css'
        }),
        new webpack.HotModuleReplacementPlugin(),
    ]
})


