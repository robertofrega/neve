var gulp = require('gulp'),
    gutil = require('gulp-util'),
    clean = require('gulp-clean'),
    sass = require('gulp-sass'),
    rubysass = require('gulp-ruby-sass'),
    fileinclude = require('gulp-file-include'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify'),
    livereload = require('gulp-livereload'),
    lr = require('tiny-lr'),
    connect = require('gulp-connect'),
    plumber = require('gulp-plumber'),
    autoprefixer = require('gulp-autoprefixer'),
    server = lr(),
    path = require("path"),
    runSequence = require('run-sequence');

var working = "banheiros/" || "neve/";

var paths = {
  dev: working + 'dev',
  prod: working + 'preview',
  templates: working + 'dev/templates/',
  sass: working + 'dev/css/',
  css: working + 'preview/css',
};

gulp.task('clean', function(){
    return gulp.src(paths.prod, {read: false})
        .pipe(clean());
});

gulp.task('copy', function(){
    return gulp.src( [
        paths.dev + '/font/**/*',
        paths.dev + '/js/**/*',
        paths.dev + '/css/**/*.css',
        paths.dev + '/images/**/*',
        paths.dev + '/*.*',

    ], {'base' : paths.dev })
        .pipe(gulp.dest(paths.prod));
});

// fileinclude: grab partials from templates and render out html files
// ==========================================
gulp.task('fileinclude', function() {
  return  gulp.src(path.join(paths.templates, '*.html'))
  	.pipe(fileinclude({
        prefix: '@@',
        basepath: '@file'
    }))
    .pipe(fileinclude())
    .pipe(gulp.dest(paths.prod))
    .pipe(livereload(server));
});

//  Sass: compile sass to css task - uses Libsass
//===========================================
gulp.task('sass', function() {
  return gulp.src(path.join(paths.sass, '*.scss'))
    .pipe(sass({ style: 'expanded', sourceComments: 'map', errLogToConsole: true}))
    .pipe(autoprefixer('last 2 version', "> 1%", 'ie 8', 'ie 9'))
    .pipe(gulp.dest(paths.css))
    .pipe(livereload(server));
});



//  Connect: sever task
//===========================================
gulp.task('connect', function(){
	connect.server({
	  port: 1337,
	  root: [__dirname],
	  livereload: true
	});
});

gulp.task('html', function () {
  gulp.src(paths.dev + '/**/*')
    .pipe(connect.reload());
});

gulp.task('connect-reload', function(){
    runSequence('fileinclude', 'sass', 'copy', 'html');
});



//  Watch and Livereload using Libsass
//===========================================
gulp.task('watch', function() {
  gulp.watch(paths.dev + '/**/*', function(){
    runSequence('connect-reload');
  });
});

//  Default Gulp Task
//===========================================
gulp.task('default', ['fileinclude', 'sass', 'copy', 'connect', 'watch'], function() {

});
