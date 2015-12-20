var connect = require('gulp-connect');
var gulp = require('gulp');
var gutil = require('gulp-util');

var watchTaskIds = [];

function task(taskId, srcPaths, task, taskDependencies){
    taskDependencies = taskDependencies || [];

    var reloadTaskId = 'reload-' + taskId;
    var watchTaskId = 'watch-' + taskId;
    var watchWorkerTaskId = 'worker-' + taskId;

    gulp.task(taskId, taskDependencies, function(){
        return task(srcPaths);
    });

    /**
     * This task locks the automatic reload and executes the actual job
     * afterwards.
     */
    gulp.task(watchWorkerTaskId, [taskId], function(){
        blockReloads(taskId);

        return task(srcPaths);
    });

    /**
     * This task informs the central reload mechanism that the task is
     * finished.
     */
    gulp.task(reloadTaskId, [watchWorkerTaskId], function(){
        return doReload(taskId);
    });

    /**
     * This task registers the watch which triggers a rebuild.
     */
    gulp.task(watchTaskId, function(){
        gulp.watch(srcPaths, [reloadTaskId]);
    });

    watchTaskIds.push(watchTaskId);
}

var reloadBlocks = 0;

function blockReloads(taskId){
    reloadBlocks += 1;
}

function doReload(taskId){
    reloadBlocks -= 1;

    if(reloadBlocks === 0){
        gutil.log('Reloading...');

        return gulp.src('target/www/**/*.html', { read: false })
            .pipe(connect.reload());
    }
}

function watch(taskId){
    gulp.task(taskId, watchTaskIds);
}

module.exports = {
    task: task,
    watch: watch
};
