const { series, watch } = require('gulp');
const browserSync       = require('browser-sync').create();
const connect           = require('gulp-connect-php');
const dir               = require('../dir');
const ejs               = require('./ejs');
const phpcopy           = require('./phpcopy');
const jsBuild           = require('./js');
const sass              = require('./sass');

//自動リロード
const browsersync = () => {
    connect.server({
        port: 8001,
        base: dir.dist.html,
    }, () => {
        browserSync.init({
            proxy: `localhost:8001`,
            https: true
        });
    });

    const sEjs = series(ejs, browserSync.reload);
    watch(
        `${dir.src.ejs}/**/*.ejs`
    )
        .on('add',    sEjs)
        .on('change', sEjs)
        .on('unlink', sEjs);
    const sPhp = series(phpcopy, browserSync.reload);
    watch(
        `${dir.src.php}/**/*.php`
    )
        .on('add',    sPhp)
        .on('change', sPhp)
        .on('unlink', sPhp);
    const sSass = series(sass, browserSync.reload);
    watch(
        `${dir.src.scss}/**/*.scss`,
        {
            ignored: [
                `${dir.src.scss}/util/_var.scss`
            ]
        }
    )
        .on('add',    sSass)
        .on('change', sSass)
        .on('unlink', sSass);
    const sJs = series(jsBuild, browserSync.reload);
    watch(
        `${dir.src.js}/**/*.js`,
        {
            ignored: [
                `${dir.src.js}/concat/**/*.js`
            ]
        }
    )
        .on('add',    sJs)
        .on('change', sJs)
        .on('unlink', sJs);
};

module.exports = browsersync;
