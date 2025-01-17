const {
    src,
    dest,
    watch,
    parallel,
    series,
    lastRun
} = require('gulp');
const config = require('./config')();
const imagemin = require('gulp-imagemin');
const fileinclude = require('gulp-file-include');
const htmlbeautify = require('gulp-html-beautify');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
sass.compiler = require('node-sass');
const csso = require('gulp-csso');
const autoprefixer = require('gulp-autoprefixer');
const del = require('del');
const spritesmith = require('gulp.spritesmith');
const replace = require('gulp-replace');
const copy = require('gulp-copy');
// const rename = require('gulp-rename');

function bSync() {
    browserSync.init({
        // watch: true,
        port: 3030,
        startPath: '/views_m/main',
        // startPath: '/views/main',
        // startPath: '/views_app/pagelist',
        server: {
            baseDir: './dist',
        },
    });
}

function bSyncTest() {
    browserSync.init({
        // watch: true,
        port: 3050,
        startPath: '/views/main',
        server: {
            baseDir: './dist',
        },
    });
}

function template() {
    return src(config.template.src, {
            since: lastRun(template)
        })
        .pipe(
            fileinclude({
                prefix: '@@',
                // basepath: 'src'
                basepath: '@file',
                // basepath: '@root'
            })
        )
        .pipe(htmlbeautify(config.htmlbeautify))
        .pipe(dest(config.template.dest))
        .pipe(browserSync.stream({
            match: '**/*.html'
        }));
}

function templateAll() {
    return src(config.template.src)
        .pipe(
            fileinclude({
                prefix: '@@',
                basepath: '@file',
                // basepath: '@root'
            })
        )
        .pipe(htmlbeautify(config.htmlbeautify))
        .pipe(dest(config.template.dest))
        .pipe(browserSync.stream({
            match: '**/*.html'
        }));
}

function templateM() {
    return src(config.template.src_m, {
            since: lastRun(template)
        })
        .pipe(
            fileinclude({
                prefix: '@@',
                basepath: '@file',
                // basepath: '@root'
            })
        )
        .pipe(htmlbeautify(config.htmlbeautify))
        .pipe(dest(config.template.dest_m))
        .pipe(browserSync.stream({
            match: '**/*.html'
        }));
}

function templateMAll() {
    return src(config.template.src_m)
        .pipe(
            fileinclude({
                prefix: '@@',
                basepath: '@file',
                // basepath: '@root'
            })
        )
        .pipe(htmlbeautify(config.htmlbeautify))
        .pipe(dest(config.template.dest_m))
        .pipe(browserSync.stream({
            match: '**/*.html'
        }));
}

function templateApp() {
    return src(config.template.src_app, {
            since: lastRun(template)
        })
        .pipe(
            fileinclude({
                prefix: '@@',
                basepath: '@file',
                // basepath: '@root'
            })
        )
        .pipe(htmlbeautify(config.htmlbeautify))
        .pipe(dest(config.template.dest_app))
        .pipe(browserSync.stream({
            match: '**/*.html'
        }));
}

function templateAppAll() {
    return src(config.template.src_app)
        .pipe(
            fileinclude({
                prefix: '@@',
                basepath: '@file',
                // basepath: '@root'
            })
        )
        .pipe(htmlbeautify(config.htmlbeautify))
        .pipe(dest(config.template.dest_app))
        .pipe(browserSync.stream({
            match: '**/*.html'
        }));
}
// {outputStyle: nested} expanded, compact, compressed
function sassDev() {
    return src(config.sass.src, {
            since: lastRun(sassDev),
            sourcemaps: true
        })
        .pipe(sass({
            outputStyle: 'compact'
        }).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(dest(config.sass.dest, {
            sourcemaps: true
        }))
        .pipe(browserSync.stream({
            match: '**/*.css'
        }));
}

function sassDevAll() {
    return src(config.sass.src, {
            sourcemaps: true
        })
        .pipe(sass({
            outputStyle: 'compact'
        }).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(dest(config.sass.dest, {
            sourcemaps: true
        }))
        .pipe(browserSync.stream({
            match: '**/*.css'
        }));
}

function sassPrd() {
    return src(config.sass.src, {
            since: lastRun(sassPrd)
        })
        .pipe(sass({
            outputStyle: 'compact'
        }).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(csso())
        .pipe(dest(config.sass.dest))
        .pipe(browserSync.stream({
            match: '**/*.css'
        }));
}

function sassPrdAll() {
    return src(config.sass.src)
        .pipe(sass({
            outputStyle: 'compact'
        }).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(csso())
        .pipe(dest(config.sass.dest))
        .pipe(browserSync.stream({
            match: '**/*.css'
        }));
}

function css() {
    return (
        src(config.css.src, {
            since: lastRun(css)
        })
        // .pipe(autoprefixer())
        // .pipe(csso())
        // .pipe(rename({ suffix: '.min' }))
        .pipe(dest(config.css.dest))
        .pipe(browserSync.stream({
            match: '**/*.css'
        }))
    );
}

function js() {
    return src(config.js.src, {
            since: lastRun(js)
        })
        .pipe(dest(config.js.dest))
        .pipe(browserSync.stream({
            match: '**/*.js'
        }));
}

function img() {
    return src(config.img.src, {
            since: lastRun(img)
        })
        .pipe(imagemin())
        .pipe(dest(config.img.dest));
}

function sprite(cb) {
    // var spriteData = src('src/img/sprite/login/*') // custom grouping
    var spriteData = src(config.img.src_sprite).pipe(
        spritesmith({
            imgName: 'sprite.png',
            padding: 6,
            cssName: 'sprite.css',
        })
    );
    spriteData.img.pipe(dest(config.img.dest + '/sprite'));
    // spriteData.css.pipe(dest(config.sass.dest + '/sprite'));
    spriteData.css.pipe(dest(config.sass.src_sprite)); // 생성 후 scss로 변경
    cb();
}

function etc() {
    return src(config.etc.src, {
        since: lastRun(etc)
    }).pipe(
        dest(config.etc.dest)
    );
}

function watchingDev() {
    watch([config.template.src], template);
    watch(
        [config.template.parts, config.src + '/template/layer/**'],
        templateAll
    );
    watch([config.template.src_m], templateM);
    watch([config.template.parts_m], templateMAll);
    watch([config.template.src_app], templateApp);
    watch([config.template.parts_app], templateAppAll);
    watch(config.sass.src, sassDev);
    watch(config.sass.parts, sassDevAll);
    watch(config.css.src, css);
    watch(config.js.src, js);
    watch(config.img.src, img);
    watch(config.etc.src, etc);
}

function watchingPrd() {
    watch([config.template.src], template);
    watch(
        [config.template.parts, config.src + '/template/layer/**'],
        templateAll
    );
    watch([config.template.src_m], templateM);
    watch([config.template.parts_m], templateMAll);
    watch([config.template.src_app], templateApp);
    watch([config.template.parts_app], templateAppAll);
    watch(config.sass.src, sassPrd);
    watch(config.sass.parts, sassPrdAll);
    watch(config.css.src, css);
    watch(config.js.src, js);
    watch(config.img.src, img);
    watch(config.etc.src, etc);
}

// util
function cleanDist(cb) {
    del(config.dev);
    cb();
}

function cleanTemplate(cb) {
    del([config.template.dest, config.template.dest_m]);
    // del([config.template.dest]);
    cb();
}

function cleanParts(cb) {
    del([config.template.dest_parts, config.template.dest_m_parts]);
    // del([config.template.dest_parts]);
    cb();
}

function cleanSass(cb) {
    del(config.sass.dest);
    cb();
}

function cleanCss(cb) {
    del(config.css.dest);
    cb();
}

function cleanJs(cb) {
    del(config.js.dest);
    cb();
}

function cleanImg(cb) {
    del(config.img.dest);
    cb();
}

const assets_local = '/public';
const assets_server = 'http://toxnsldxn.cafe24.com/template/assets';
const views_local = '/views';
const views_server = 'http://toxnsldxn.cafe24.com/template/views';

function copyTest() {
    return src(config.dev + '/**/*').pipe(dest(config.test));
}

function testPathServer() {
    return src(config.test + '/**/*')
        .pipe(replace(assets_local, assets_server))
        .pipe(replace(views_local, views_server))
        .pipe(dest(config.test));
}

function testPathLocal() {
    return src(config.test + '/**/*')
        .pipe(replace(assets_server, assets_local))
        .pipe(replace(views_server, views_local))
        .pipe(dest(config.test));
}

exports.cleanTemplate = cleanTemplate;
exports.cleanDist = cleanDist;
exports.cleanParts = cleanParts;
exports.img = img;
exports.sprite = sprite;
exports.etc = etc;
exports.testPathServer = testPathServer;
exports.testPathLocal = testPathLocal;
exports.templateM = templateM;
exports.css = css;
exports.js = js;
exports.serve = parallel(
    series(
        parallel(template, templateM, templateApp),
        sassDev,
        css,
        js,
        img,
        etc,
        bSync
    ),
    watchingDev
);
exports.build = parallel(
    series(
        parallel(template, templateM, templateApp),
        sassPrd,
        css,
        js,
        img,
        etc
    )
);
exports.default = parallel(bSync, watchingPrd);
exports.test = series(copyTest, testPathServer, bSyncTest);