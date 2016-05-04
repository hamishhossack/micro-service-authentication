var gulp = require('gulp');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var watch = require('gulp-watch');
var path = require('path');
var argv = require('yargs').argv;
var fs = require('fs');

var env = argv.env || 'development';

var isProduction = (/prod/.test(env));
var paths = {
    app: './app/**/*.js'
};

/**
 *  Default Batch call for Less and JS
 */
gulp.task('default', ['js']);

/**
 *  Lint JS Code
 */
gulp.task('lint', function() {
    return gulp.src(paths.app)
        .pipe(jshint())
        .pipe(jshint.reporter(stylish))
        .pipe(jshint.reporter('fail'));
});

/**
 * Build the Server
 */
gulp.task('serve', function () {
    // build server
});

/**
 * Build the javascript
 */
gulp.task('js', ['lint'], function () {
    // Rebuild serve
});

/**
 *  Watch JS and Less files for changes are re-build files
 */
gulp.task('watch', ['js'], function () {

    if (isProduction) return;
    var onChange = function (event) {
        console.log('File ' + event.path + ' has been ' + event.type);
    };
    gulp.watch([paths.javascripts.root + '/**/*.js', '!' + paths.javascripts.root + '/vendors'], ['js'])
        .on('change', onChange);
});
