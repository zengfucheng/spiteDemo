/**
 *
 * name: build
 * date: 2018/11/15
 * author: cengfucheng
 * about: 打包js
 *
 */

const ora = require('ora');             // 进度插件
const rm = require('rimraf');           // 命令操作插件
const chalk = require('chalk');         // 控制台输出字体颜色插件
const path = require('path');

const webpack = require('webpack');
const webpackProdConfig = require('./webpack.prod');

const spinner = ora('pack waiting...');
spinner.start();

rm(path.join(path.resolve(__dirname,'../','dist')), err => {
    if(err) throw err;
    webpack(webpackProdConfig, (err, state) => {
        spinner.stop();
        if(err) throw err;
        process.stdout.write(state.toString({
            colors: true,
            modules: false,
            children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
            chunks: false,
            chunkModules: false
        }) + '\n\n');
        if(state.hasErrors()) {
            console.log(chalk.red('pack is error.\n'));
            process.exit(1);
        }

        console.log(chalk.cyan('  Build complete.\n'));
        console.log(chalk.yellow(
            '  Tip: built files are meant to be served over an HTTP server.\n' +
            '  Opening index.html over file:// won\'t work.\n'
        ));
    });
})
