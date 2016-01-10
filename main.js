function env(opts){
    var gulp = opts.gulp
    var connect = opts.connect;
    var gutil = opts.gutil;

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
            gutil && gutil.log('Reloading...');

            return opts.reload();
        }
    }

    function watch(taskId){
        gulp.task(taskId, watchTaskIds);
    }

    return {
        task: task,
        watch: watch
    };
}

module.exports = {
    env: env
};
