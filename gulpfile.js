/*
 * Created by Administrator on 2017/5/9.
 */
const gulp = require('gulp');
const uglify = require('gulp-uglify');//js压缩
const concat = require('gulp-concat');//合并
const rename = require('gulp-rename');//重命名
const browserify = require('gulp-browserify');//模块化打包
const sass = require('gulp-sass');//sass编译
const cleanCSS = require('gulp-clean-css');//css的压缩
const webserver = require('gulp-webserver');//web服务热启动
const imagemin = require('gulp-imagemin');//图片压缩
const rev = require('gulp-rev');//对文件名加MD5后缀
const revcollector = require('gulp-rev-collector');//路径替换
const url = require('url');
const datajson=require('./data/main.js');//请求的mock数据文件
//js压缩
gulp.task('jsmin', function () {
    gulp.src('src/js/*.js')
        .pipe(uglify())
        .pipe(rev())//MD5版本控制
        .pipe(gulp.dest('./build/js'))
        .pipe(rev.manifest())//生成一个rev-manifest.json
        .pipe(gulp.dest("./rev/js"));//将rev-manifest.json存放到的路径
});
//合并
gulp.task('concat', function () {
    gulp.src('src/js/*.js')
        .pipe(concat('common.js'))
        .pipe(gulp.dest('./build'));
});
//重命名
gulp.task('rename', function () {
    gulp.src('src/js/*.js')
        .pipe(concat('common.js'))
        .pipe(rename('renamecommon.js'))
        .pipe(gulp.dest('./build'));
});
//模块化打包
gulp.task('browser', function () {
    gulp.src('src/js/*.js')
        .pipe(uglify())
        .pipe(concat("common.js"))
        .pipe(browserify({
            insertGlobals: true,
            debug: !gulp.env.production
        }))
        .pipe(gulp.dest('./build/js'));
});
//sass编译
gulp.task('cssmin', function () {
    gulp.src('src/css/*.sass')
        .pipe(sass())
        .pipe(cleanCSS())//css压缩
        .pipe(rev())//MD5版本控制
        .pipe(gulp.dest('./build/css'))
        .pipe(rev.manifest())//生成一个rev-manifest.json
        .pipe(gulp.dest("./rev/css"));//将rev-manifest.json存放到的路径
});
//文件名替换
gulp.task('htmlrev', function () {
    gulp.src(['rev/**/*.json', './src/html/*.html'])
        .pipe(revcollector({
            replaceReved: true,
            dirReplacements: {
                'css': '../css',
                'js': '../js'
                //'cdn/': function(manifest_value) {
                //    return '//cdn' + (Math.floor(Math.random() * 9) + 1) + '.' + 'exsample.dot' + '/img/' + manifest_value;
                //}
            }//执行文件内css名的替换
        }))
        .pipe(gulp.dest('./build/html'));
});
//执行全部
gulp.task("build", ["jsmin", "cssmin", "htmlrev"]);

//启动服务
gulp.task("webserver", ["build"], function () {
    gulp.watch("./src/css/*.sass", ["cssmin"]);
    gulp.watch("./src/html/*.html", ["htmlrev"]);
    gulp.src('./build')
        .pipe(webserver({
            livereload: true,
            directoryListing: true,
            middleware: function (req, res, next) {
                const reqPath = url.parse(req.url).pathname;
                const routes = datajson.data();
                routes.forEach(function (i) {
                    console.log(i.route);
                    console.log(reqPath);
                    if (i.route == reqPath) {
                        i.handle(req, res, next)
                    }
                });
                next();
            },
            open: "/html/defer.html"
        }));
});
//压缩图片
gulp.task('imagemin', function () {
    gulp.src('src/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('build/images'))
});