/**
 *
 * name: webpack.prod
 * date: 2018/11/5
 * author: cengfucheng
 * about:
 *
 */

const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const cleanWebpackPlugin = require('clean-webpack-plugin');
const miniCssExtractPlugin = require('mini-css-extract-plugin');

const webpackBase = require('./webpack.base');

module.exports = merge(webpackBase,{
    mode: 'production',
    devtool: 'cheap-module-eval-source-map',
    output: {
        path: path.resolve(__dirname,'../','dist'),
        filename: 'js/[name].[chunkhash].js'
    },
    plugins: [
        new miniCssExtractPlugin({
            filename: 'css/[name].[chunkhash].css',
            chunkFilename: '[id].css'
        }),
    ],
    module: {
        rules: [
            {
                test: /\.(c|sc|sa)ss$/,
                use: [
                    miniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'
                ]
            }
        ]
    },
    optimization: {
        minimize: true,
        splitChunks: {
            chunks: 'all',                              //优化块，值： all,async,initial
            automaticNameDelimiter: '-',                //名称分隔符
            maxAsyncRequests: 5,                        //最大并行请求数
            maxInitialRequests: 3,                      //入口点处的最大并行请求数
            minChunks: 1,                               //分割前必须共享模块的最小块数
            minSize: 30000,                             //要生成的块的最小大小（以字节为单位)
            maxSize: 0,
            name: 'vendors',                            //名字，值：bool，function，string
            cacheGroups: {                              //缓存组
                default: false                          //暂不启用
            }
        }

    }
})
