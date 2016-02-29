/*
 *  LancerFrame Build Tasks By LancerComet at 17:32, 2016.02.29.
 *  # Carry Your World #
 *  ---
 *  LancerFrame 构建任务.
 */

var gulp = require("gulp");
var browserify = require("gulp-browserify");

gulp.task("default", ["build"]);

(function buildTasks () {
    
    gulp.task("build", ["build-package", "build-watch"]);
    
    gulp.task("build-package", function () {
        gulp.src("./src/LancerFrame.js")
            .pipe(browserify())
            .pipe(gulp.dest("./dist/"))
    });
    
    gulp.task("build-watch", function () {
        gulp.watch("./src/**/*.js", ["build-package"]);
    });
    
})();