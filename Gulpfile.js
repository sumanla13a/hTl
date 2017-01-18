'use strict';
var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    spawn = require('child_process').spawn,
    config = require('./configurations/config.json'),
    node;

gulp.task('server', function() {
  if (node) {
    node.kill();
  }
  node = spawn('node', ['./bin/www']);
  node.on('close', function (code) {
    if (code === 8) {
      gulp.log('Error detected, waiting for changes...');
    }
  });
});

gulp.task('lint', function () {
  gulp.src('./**/*.js')
    .pipe(jshint());
});


gulp.task('default', function() {
  gulp.run('lint');
  gulp.run('server');
  gulp.watch(['./app.js', `./${config.modelFolder}/**/*`], function() {
    gulp.run('server');
  });
});

// clean up if an error goes unhandled.
process.on('exit', function() {
    if (node) {
      node.kill();
    }
});