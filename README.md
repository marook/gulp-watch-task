# gulp-watch-task

1. Introduction
1. Usage

## Introduction

gulp-watch-task simplifies combining gulp.watch(...) and the
gulp-connect module. It tries to rebuild as less as possible and reload
the gulp-connect browser after all builds are done.

## Usage

Use gulp-watch-task in your gulpfile.js like the following:

    var connect = require('gulp-connect');
    var gulp = require('gulp');
    var watchTask = require('gulp-watch-task').env(gulp, connect);

    gulp.task('default', ['allWatches']);

    // configure gulp-connect here

    watchTask.task('js', ['file1.js', 'file2.js'], function(src){
        return gulp.src(src)
            .pipe(concat('my.js'))
            .pipe(gulp.dest('www'));
    });

    watchTask.task('css', [file1.css', 'file2.css'] function(src){
        return gulp.src(src)
            .pipe(concat('my.css'))
            .pipe(gulp.dest('www'));
    });

    watchTask.watch('allWatches');
