var
gulp = require('gulp'),
coffee = require('gulp-coffee'),
sass = require('gulp-sass'),
autoprefixer = require('gulp-autoprefixer'),
browser = require('browser-sync'),
plumber = require("gulp-plumber"),

// gifsicle = require('imagemin-gifsicle'),
// jpegtran = require('imagemin-jpegtran'),
// optipng = require('imagemin-optipng'),
// svgo = require('imagemin-svgo'),
spritesmith = require('gulp.spritesmith'),
fileinclude = require('gulp-file-include'),
prettify = require('gulp-prettify'),
cssbeautify = require('gulp-cssbeautify'),
jsprettify = require('gulp-jsbeautifier'),
changed = require('gulp-changed'),
del = require('del')
;

var paths = {
    base:'/project/',
    src_scss  :'app/**/*.scss',
    src_js    :'app/**/*.js',
    src_coffee:'app/**/*.coffee',
    src_html  :'app/**/*.html',
    src_image :'app/**/img/*',
    dist  :'dist/',
    dist_html: "dist/",
    dist_css: "dist/",
    dist_js: "dist/",
    dist_image: "dist/image/"
};

gulp.task('server', function() {
    browser({server: {baseDir: paths.dist}});
});

gulp.task('image', function() {
    gulp
    .src(paths.src_image)
    .pipe(plumber())
    .pipe(changed(paths.dist))
    // .pipe(gifsicle())
    // .pipe(jpegtran())
    // .pipe(optipng())
    // .pipe(svgo())
    .pipe(gulp.dest(paths.dist_image))
    .pipe(browser.reload({stream:true}));
});

gulp.task('sass', function() {
    gulp
    .src(paths.src_scss)
    .pipe(plumber())
    .pipe(changed(paths.dist_css))
    .pipe(fileinclude({basepath: paths.base}))
    //（2014.11.20追記）
    .pipe(sass({
        errLogToConsole: true,
        sourceComments: 'normal'
    }))
    .pipe(autoprefixer())
    .pipe(cssbeautify())
    .pipe(gulp.dest(paths.dist_css))
    .pipe(browser.reload({stream:true}));
});

gulp.task('coffee', function() {
    gulp
    .src(paths.src_coffee)
    .pipe(plumber())
    .pipe(changed(paths.dist))
    .pipe(fileinclude({basepath: paths.base}))
    .pipe(coffee())
    .pipe(gulp.dest(paths.dist))
    .pipe(browser.reload({stream:true}));
});

gulp.task('js', function() {
    gulp
    .src(paths.src_js)
    .pipe(plumber())
    .pipe(changed(paths.dist_js))
    .pipe(fileinclude({basepath: paths.base}))
    .pipe(jsprettify())
    .pipe(gulp.dest(paths.dist_js))
    .pipe(browser.reload({stream:true}));
});

gulp.task('html', function() {
    gulp
    .src(paths.src_html)
    .pipe(plumber())
    .pipe(changed(paths.dist_html))
    .pipe(fileinclude({basepath: paths.base}))
    .pipe(prettify())
    .pipe(gulp.dest(paths.dist_html))
    .pipe(browser.reload({stream:true}));
});

// gulp.task('clean', function(cb) {
//   del(paths.dist, cb);
// });

gulp.task('sprite', function () {
  var spriteData = gulp.src('app/img/sprite/*.png') //スプライトにする愉快な画像達
  .pipe(spritesmith({
    imgName: 'sprite.png', //スプライトの画像
    cssName: '_sprite.scss', //生成されるscss
    imgPath: '/img/sprite.png', //生成されるscssに記載されるパス
    cssFormat: 'scss', //フォーマット
    cssVarMap: function (sprite) {
      sprite.name = 'sprite-' + sprite.name; //VarMap(生成されるScssにいろいろな変数の一覧を生成)
    }
  }));
  spriteData.img.pipe(gulp.dest('dist/img/')); //imgNameで指定したスプライト画像の保存先
  spriteData.css.pipe(gulp.dest('app/scss/')); //cssNameで指定したcssの保存先
});

gulp.task('watch', function() {
    gulp.watch(paths.src_scss,['sass']);
    gulp.watch(paths.src_coffee,['coffee']);
    gulp.watch(paths.src_html,['html']);
    gulp.watch(paths.src_js,['js']);
    // gulp.watch(paths.image,['image']);
});

gulp.task('build', function(){
    gulp.start('create');
});

gulp.task('create', ['sass','coffee','html','js']);
gulp.task('default', ['build','watch','server']);
