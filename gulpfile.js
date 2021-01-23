var gulp         = require('gulp');
var autoprefixer = require('autoprefixer');
var cssnano      = require('cssnano');
var concat       = require('gulp-concat');
var postcss      = require('gulp-postcss');
var sourcemaps   = require('gulp-sourcemaps');
var browserSync  = require('browser-sync').create();
var sass         = require('gulp-sass');
var babel        = require('gulp-babel');
var uglify       = require('gulp-uglify');
var rename       = require('gulp-rename');
var htmlmin      = require('gulp-htmlmin');

const files ={
    scssPath:'./src/scss/**/*.scss',
    jsPath:'./src/js/**/*.js',
    htmlPath:'./src/*.html'
}

function style(){
    return gulp.src(files.scssPath)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error',sass.logError))
        .pipe(postcss([ autoprefixer(),cssnano() ]))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest("./dist/css"))
        .pipe(browserSync.stream())
}
function jsout(){
    return gulp.src(files.jsPath)
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat('all.js'))
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest('./dist/js'))
}
function htmlout(){
    return gulp.src('./src/*.html')
    .pipe(htmlmin({
        collapseWhitespace: true,
        removeComments: true
    }))
    .pipe(gulp.dest('./dist'))
}
function watch(){
    browserSync.init({
        server:{
            baseDir:'./dist' 
        }        
    })
    gulp.watch(files.scssPath,style);
    gulp.watch(files.jsPath,jsout);
    gulp.watch(files.htmlPath,htmlout);
    gulp.watch(files.scssPath).on('change',browserSync.reload);
    gulp.watch(files.jsPath).on('change',browserSync.reload);
    gulp.watch(files.htmlPath).on('change',browserSync.reload);
    
}
exports.htmlout = htmlout;
exports.jsout = jsout;
exports.style = style;
exports.watch = watch;