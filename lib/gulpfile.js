let concat = require('gulp-concat');
const minify = require('gulp-minify');
let gulp = require('gulp');
 
gulp.task('compile', function() {
  return gulp.src('./dev/*.js')
    .pipe(concat('sattee.js'))
    .pipe(minify())
    .pipe(gulp.dest('./bin/'));
});