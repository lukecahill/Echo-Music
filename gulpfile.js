var gulp = require('gulp');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var jshint = require('gulp-jshint');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var livereload = require('gulp-livereload');

gulp.task('minify', function() {
	gulp.src('./public/javascripts/*.js')
    .pipe(uglify())
	.pipe(rename({
		suffix: '.min'
	}))
    .pipe(gulp.dest('./public/javascripts/build/'))
    .pipe(livereload());
});

gulp.task('jsLint', function () {
	gulp.src('./public/javascripts/*.js')
	.pipe(jshint())
	.pipe(jshint.reporter());
});

gulp.task('sass', function() {
	gulp.src('./public/stylesheets/*.scss')
	.pipe(sass())
	.pipe(gulp.dest('./public/stylesheets/'))
    .pipe(livereload());
});

gulp.task('watch-js', function() {
	livereload.listen();
	gulp.watch(['./public/javascripts/*.js', './public/stylesheets/*.scss'], ['minify', 'jsLint', 'sass']);
});