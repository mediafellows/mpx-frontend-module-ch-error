const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const del = require('del');

gulp.task('compile',['clean:dist'], function () {
  return gulp.src(['src/module.coffee', 'src/**/*.coffee'])
    .pipe($.coffee({bare: false}, {sourceMap: false}).on('error', $.util.log))
    .pipe($.ngAnnotate())
    .pipe($.concat('index.js'))
    .pipe(gulp.dest('./'))
});

gulp.task('copy',['clean:dist'], function () {
  return gulp.src('src/**/*.html')
    .pipe(gulp.dest('dist'))
});
gulp.task('clean:dist', function () {
  return del('dist');
});
gulp.task('build', ['clean:dist', 'compile', 'copy']);
gulp.task('default', ['build']);
