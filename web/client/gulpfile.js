var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefix = require('gulp-autoprefixer');
var browserify = require('browserify');
var babelify = require('babelify');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var shell = require('gulp-shell');

gulp.task('css', function() {
  gulp.src('app/css/**/*.scss')
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(autoprefix({ browsers: ['last 2 versions'] }))
    .pipe(gulp.dest('public/'));
});

gulp.task('js', function() {
  browserify(['app/js/main.js'])
    .transform(babelify, { presets: ['react', 'es2015'] })
    .bundle()
    .on('error', function(e) { console.log(e.message); this.emit('end'); })
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('public/'));
});

gulp.task('minify-js', ['js'], function() {
  gulp.src('public/bundle.js')
    .pipe(uglify())
    .pipe(rename('bundle.min.js'))
    .pipe(gulp.dest('public/'));
});

gulp.task('watch', ['css', 'js'], function() {
  gulp.watch('app/css/**/*.scss', ['css']);
  gulp.watch('app/js/**/*.js*', ['js']);
});

gulp.task('shrinkwrap', shell.task(['npm shrinkwrap']));
gulp.task('prod', ['css', 'js', 'minify-js', 'shrinkwrap'])

gulp.task('default', ['css', 'js']);
