const { src, dest } = require('gulp');
const plumber       = require('gulp-plumber');
const notify        = require('gulp-notify');
const sass          = require('gulp-sass')(require('sass'));
const autoprefixer  = require('gulp-autoprefixer');
const dir       = require('../dir');

//scssコンパイルタスク
const scss = () => {
    return src(`${dir.src.scss}/**/*.scss`)
        .pipe(plumber({
            errorHandler: notify.onError({
                message: 'Error: <%= error.message %>',
                title: 'scss'
            })
        }))
        .pipe(sass({
            outputStyle: 'compressed',
            quietDeps: true
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(dest(dir.dist.css));
};

module.exports = scss;
