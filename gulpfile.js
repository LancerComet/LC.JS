/*
 *  LancerFrame Build Tasks By LancerComet at 17:32, 2016.02.29.
 *  # Carry Your World #
 *  ---
 *  LancerFrame 构建任务.
 */
const gulp = require("gulp");
const util = require("gulp-util");
const rename = require("gulp-rename");

const browserify = require("browserify");
const sourcemaps = require("gulp-sourcemaps");
const watchify = require("watchify");
const uglify = require("gulp-uglify");

const webserver = require("gulp-webserver");

const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");


gulp.task("default", ["build", "dev-server"]);

(function buildTasks () {
    
    gulp.task("build", ["build-package"]);
    
    var bundler = browserify("./src/main.js", {
        debug: true,
        cache: {},
        packageCache: {},
        plugin: [watchify]
    }).transform("babelify", { presets: ["es2015"] });
    
    bundler.on("update", bundle);
    bundler.on("log", util.log);
    
    gulp.task("build-package", bundle);
    
     function bundle () {
         var compress = process.env.NODE_ENV === "production";
         return bundler
             .bundle()
             .on("error", function (err) {
                 console.error(err.toString());
                 this.emit("end");
             })
             .pipe(source("LancerFrame.js"))
             .pipe(buffer())
             .pipe(sourcemaps.init({ loadMaps: true }))
             .pipe(uglify({
                 compress: compress, mangle: compress
             }))
             .pipe(sourcemaps.write("."))
             .pipe(gulp.dest("./dist"));
    }
    
})();


(function devServer () {

    gulp.task("dev-server", function () {
        gulp.src("./")  // Root Path.
            .pipe(webserver({
                host: "0.0.0.0",
                port: 8080,
                livereload: true,
                directoryListing: true
            }));
    });

})();