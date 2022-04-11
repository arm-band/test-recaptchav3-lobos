const { DefinePlugin }       = require("webpack");
const webpackTerser          = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path                   = require('path');
const glob                   = require('glob');
const fs                     = require('fs');
const dir                    = require('./gulp/dir');

const devFlag = true;

const mode = () => {
    return devFlag ? 'development' : 'production';
};
const modeFlag = () => {
    return devFlag ? false : true;
};
const isExistFile = (file) => {
    try {
        fs.statSync(file);
        return true;
    } catch(err) {
        if(err.code === 'ENOENT') {
            return false;
        }
    }
};
const configFile = `${dir.src.php}/config/config.php`;
    if(!isExistFile(configFile)) {
        throw new Error('設定ファイルが存在しません。');
    }
    const strOrigin = fs.readFileSync(configFile, 'utf8');
    const regex = /'SITEKEY[\d]+'[\s]+=> '(.*)'/ig;
    let siteKeys = [];
    while (result = regex.exec(strOrigin)) {
        siteKeys.push(RegExp.$1);
}
const entry = () => {
    const entries = glob
        .sync(
            '**/*.js',
            {
                cwd: dir.src.js,
                ignore: [
                    '**/_*.js'
                ]
            }
        )
        .map(function (key) {
            return [key, path.resolve(dir.src.js, key)];
        });
    return Object.fromEntries(entries)
};
const configs = {
    mode: mode(),
    entry: entry(),
    output: {
        filename: '[name]'
    },
    plugins: [
        new DefinePlugin({
            'window.siteKeys': JSON.stringify(siteKeys), // 外部の値を Webpack でバンドルする JS 内に持ち込む
        }),
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: [
                `${dir.dist.js}/**/*.js`
            ],
        }),
    ],
    optimization: {
            minimizer: [
            new webpackTerser({
                extractComments: 'some',
                terserOptions: {
                    compress: {
                        drop_console: modeFlag(),
                    },
                },
            }),
        ],
    }
};
if (devFlag === 'dev') {
    configs.devtool = 'inline-source-map';
}

module.exports = configs;
