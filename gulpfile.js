/*
 *  LancerFrame Build Tasks By LancerComet at 17:32, 2016.02.29.
 *  # Carry Your World #
 *  ---
 *  LancerFrame 构建任务.
 */

const gulp = require("gulp");
const browserify = require("gulp-browserify");
const uglify = require("gulp-uglify");
const rename = require("gulp-rename");
const webserver = require("gulp-webserver");  // https://www.npmjs.com/package/gulp-webserver

gulp.task("default", ["build", "testServer"]);

(function buildTasks () {
    
    gulp.task("build", ["build-package", "build-watch"]);
    
    gulp.task("build-package", function () {
        gulp.src("./src/LancerFrame.js")
            .pipe(browserify())
            .pipe(gulp.dest("./dist/"))
            .pipe(uglify({
                compress: true,
                mangle: true
            }))
            .pipe(rename({ suffix: ".min" }))
            .pipe(gulp.dest("./dist/"))
    });
    
    gulp.task("build-watch", function () {
        gulp.watch("./src/**/*.js", ["build-package"]);
    });
    
})();


(function testServer () {

    gulp.task("testServer", function () {
        gulp.src("./")  // Root Path.
            .pipe(webserver({
                host: "0.0.0.0",
                parth: "/",
                port: 8080,
                livereload: false,
                directoryListing: false
            }));
    });

})();