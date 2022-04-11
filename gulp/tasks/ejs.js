const { src, dest } = require('gulp');
const plumber       = require('gulp-plumber');
const notify        = require('gulp-notify');
const rename        = require('gulp-rename');
const ejs           = require('gulp-ejs');
const data          = require('gulp-data');
const dir           = require('../dir');
const fs            = require('fs');

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

//ejs
const ejsBuild = () => {
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
    return src(
        `${dir.src.ejs}/**/*.ejs`,
        {
            ignore: [
                `${dir.src.ejs}/**/_*.ejs`
            ]
        }
    )
    .pipe(plumber({
        errorHandler: notify.onError({
            message: 'Error: <%= error.message %>',
            title: 'ejs'
        })
    }))
    .pipe(data((file) => {
        return { 'filename': file.path }
    }))
    .pipe(ejs({
        siteKeys: siteKeys, // 外部の値を EJS 内に持ち込む
    }))
    .pipe(rename({ extname: '.html' }))
    .pipe(dest(dir.dist.html));
};

//上記をまとめておく
module.exports = ejsBuild;
