var gulp = require('gulp');
var minifyCSS = require('gulp-minify-css');
var htmlmin = require('gulp-html-minifier');
var plumber = require('gulp-plumber');
var clean = require('gulp-clean');
var ejs = require("gulp-ejs");
var browserify = require('gulp-browserify');
var connect = require('gulp-connect');

var cleanDirectory = function (directory){
    return function (){
        return gulp.src(directory, {
                read: false
            })
            .pipe(clean());
    }
};

var paths = {
    scripts: 'src/scripts/*.js',
    stylesheets: 'src/stylesheets/*.css',
    templates: 'src/templates/*.ejs'
};

var distPaths = {
    scripts: 'dist/scripts',
    stylesheets: 'dist/stylesheets'
};

gulp.task('watch', function () {
    gulp.watch(paths.scripts, ['scripts']);
    gulp.watch(paths.stylesheets, ['stylesheets']);
    gulp.watch(paths.templates, ['templates']);
});

gulp.task('scripts', ['clean-dist-scripts'], function() {

    gulp.src('src/scripts/index.js')
        .pipe(plumber())
        .pipe(browserify({
          insertGlobals : true
        }))
        .pipe(gulp.dest(distPaths.scripts))
        .pipe(connect.reload());
});

gulp.task('stylesheets', ['clean-dist-stylesheets'], function () {
    gulp.src(paths.stylesheets)
        .pipe(plumber())
        .pipe(minifyCSS({
            keepBreaks: true
        }))
        .pipe(gulp.dest(distPaths.stylesheets))
        .pipe(connect.reload());
});

gulp.task('templates', ['clean-dist-templates'], function () {
    gulp.src('src/templates/index.ejs')
        .pipe(plumber())
        .pipe(ejs())
        .pipe(htmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest("./"))
        .pipe(connect.reload());
});

gulp.task('connect', function() {
  connect.server({
    livereload: true
  });
});

gulp.task('clean-dist-scripts', cleanDirectory(distPaths.scripts));

gulp.task('clean-dist-stylesheets', cleanDirectory(distPaths.stylesheets));

gulp.task('clean-dist-templates', cleanDirectory('index.html'));

gulp.task('default', ['connect', 'watch']);
