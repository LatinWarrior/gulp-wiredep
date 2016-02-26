var gulp = require('gulp'),
    args = require('yargs').argv,
    Config = require('./gulp.config'),
    del = require('del');

var config = new Config();

// gulp plugin to get all gulp plugins.
var $ = require('gulp-load-plugins')({
    lazy: true
});

//var jshint = require('gulp-jshint'),
//    jscs = require('gulp-jscs'),
//    util = require('gulp-util'),
//    gulpprint = require('gulp-print'),
//    gulpif = require('gulp-if');

gulp.task('print', function () {
    gulp
        .src(config.alljs)
        .pipe($.print());
});

gulp.task('vet', function () {

    log('Analyzing source with JSHint and JSCS.');

    //log(config.alljs);

    return gulp
        .src(config.alljs)
        .pipe($.if(args.verbose, $.print()))
        .pipe($.jscs())
        .pipe($.jshint('.jshintrc'))
        .pipe($.jshint.reporter('jshint-stylish', {
            verbose: true
        }))
        .pipe($.jshint.reporter('fail'));
});

gulp.task('styles', ['clean-styles'], function () {

    log('Compiling less --> css');

    return gulp
        .src(config.less)
        .pipe($.plumber())
        .pipe($.less())
        //.on('error', errorLogger)
        .pipe($.autoprefixer({
            browsers: ['last 2 version', '> 5%']
        }))
        .pipe(gulp.dest(config.temp));
});

// Since this function has no stream, we should use a callback, which is 'done'.
gulp.task('clean-styles', function (done) {

    log('Deleting css files from temp folder.');

    var files = config.temp + '**/*.css';
    clean(files, done);

    log('Back in clean-styles.');
});

gulp.task('less-watcher', function () {
    log('In less-watcher.');
    gulp.watch([config.less], ['styles']);
});

gulp.task('wiredep', function () {
    log('In wiredep.');
    var options = config.getWiredepDefaultOptions(); // TODO:
    var wiredep = require('wiredep').stream;
    //var clip = require('gulp-clip-empty-files');
    //var clean = require('gulp-clean');
    
    log('options.bowerJson: ' + options.bowerJson);
    log('options.directory: ' + options.directory);
    log('options.ignorePath: ' + options.ignorePath);
    log('config.index: ' + config.index);
    log('config.js: ' + config.js);
    log('config.client: ' + config.client);

    return gulp
        .src(config.index) // TODO: index.html
        //.pipe(clean())
        .pipe(wiredep(options))        
        .pipe($.inject(gulp.src(config.js)))
        .pipe(gulp.dest(config.client));
});

//gulp.task('hello-world', function () {
//    console.log('Our first Hello World task!');
//});

//// Custom functions

function errorLogger(error) {
    log('*** Start of Error ***');
    log(error);
    log('*** End of Error ***');
    this.emit('end');
}

function clean(path, done) {
    log('Cleaning: ' + $.util.colors.blue(path));
    // del takes a callback as a second parameter.
    del(path, done);
    log('After deleting');
}

function log(msg) {
    if (typeof (msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}