let concat = require('gulp-concat');
let minify = require('gulp-minify');
let gulpDocumentation = require('gulp-documentation');
let clean = require('gulp-clean');
let gulp = require('gulp');
let runSequence = require('run-sequence');

//generates the sattee.js file and the minified version of it
gulp.task('compile', function () {
  return gulp.src('./dev/*.js')
    .pipe(concat('sattee.js'))
    .pipe(minify())
    .pipe(gulp.dest('./bin/'));
});

//generates the documentation
gulp.task('docs', function () {
  process.chdir("../");

  //delete the previous one
  gulp.src("./API.md", { read: false,allowEmpty:true })
    .pipe(clean());

  //add the new one
  return gulp.src('./lib/bin/sattee.js')
    .pipe(gulpDocumentation('md'))
    .pipe(gulp.dest('./'));
});

gulp.task('save', gulp.series('compile', 'docs',function(done){
  done();
}));