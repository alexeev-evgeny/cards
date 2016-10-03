'use strict';

var debug = require('gulp-debug'),
    gulp = require('gulp'),
    sass = require('gulp-sass'),
    coffee = require('gulp-coffee'),
    sourcemaps = require('gulp-sourcemaps'),
    changed = require('gulp-changed'),
    util = require('gulp-util'),
    inject = require('gulp-inject'),
    webserver = require('gulp-webserver');

// ==========
// COMPILE SCSS 
// ==========
gulp.task('compile-sass', function () {
    return gulp
        .src('./src/css/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(debug({title: 'compile-scss:'}))
        .pipe(gulp.dest('./build/css/'));
});

// ==========
// COMPILE COFFEE
// ==========
gulp.task('compile-coffee', function() {
    return gulp
        .src(['src/js/**/*.coffee'])
        .pipe(sourcemaps.init())
        .pipe(changed('build/js/', {extension: '.js'}))
        .pipe(coffee())
        .on('error', function(message) {
            util.log(message);
            this.end();
        })
        .pipe(sourcemaps.write())
        .pipe(debug({title: 'compile-coffee:'}))
        .pipe(gulp.dest('./build/js/'));
});

// ==========
// COPY VENDOR CSS 
// ==========
gulp.task('copy-vendor-css', function() {
    return gulp
        .src([
            'node_modules/normalize-css/normalize.css',
        ])
        .pipe(gulp.dest('./build/css/'));
});

// ==========
// COPY VENDOR JS 
// ==========
gulp.task('copy-vendor-js', function() {
    return gulp
        .src([
            'src/js/*.js',
            'node_modules/jquery/dist/jquery.js',
            'node_modules/handlebars/dist/handlebars.js',
        ])
        .pipe(gulp.dest('./build/js/vendor/'));
});

// ==========
// COMPILE INDEX 
// ==========
gulp.task('compile-index', function(){
    var injectOptions = {ignorePath: '/build', addRootSlash: false};
    return gulp
        .src('./src/views/index.html')
        .pipe(inject(
            gulp.src([
                './build/js/vendor/*.js',
                './build/js/*.js',
                './build/css/**/*.css',
                ], {read: true}),
                injectOptions
        ))
        .pipe(gulp.dest('./build/'))
});

// ==========
// START WEBSERVER 
// ==========
gulp.task('webserver', function() {
  gulp.src(['build'])
    .pipe(webserver({
        livereload: false,
        open: true,
        port: 8080
    }));
});

// ==========
// COMPILE ALL
// ==========
gulp.task('compile', [
        'compile-sass',
        'compile-coffee',
        'copy-vendor-js',
        'copy-vendor-css',
    ], 
    function(){
        gulp.start(['compile-index'])
    }
);

// ==========
// COMPILE ALL & START WEBSERVER 
// ==========
gulp.task('start', function () {
    gulp.start('compile');
    gulp.watch('./src/views/**/*', ['compile-index']);
    gulp.watch('./src/css/**/*', ['compile-sass']);
    gulp.watch('./src/js/**/*', ['compile-coffee']);
    gulp.start('webserver');
});
