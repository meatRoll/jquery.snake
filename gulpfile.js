var gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	del = require('del');

// 清空文件夹中内容
gulp.task('clean', function (cb) {
	return del(['dist'], cb);
});

// 压缩js
gulp.task('minifyjs', function () {
	return gulp.src('src/*.js')
		.pipe(rename({
			suffix: '.min'
		})) //rename压缩后的文件名
		.pipe(uglify()) //压缩
		.pipe(gulp.dest('dist')); //输出
});

// 默认命令
// gulp.task('default', ['clean', 'minifyjs']);
gulp.task('default', ['clean'], function () {
	gulp.start('minifyjs');
});