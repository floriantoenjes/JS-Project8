"use strict";

const gulp = require("gulp"),
      concat = require("gulp-concat"),
      maps = require("gulp-sourcemaps"),
      uglify = require("gulp-uglify"),
      rename = require("gulp-rename"),
      sass = require("gulp-sass"),
      uglifycss = require("gulp-uglifycss"),
      imagemin = require('gulp-imagemin'),
      del = require("del"),
      runSequence = require("run-sequence"),
      useref = require("gulp-useref"),
      browserSync = require('browser-sync').create();


/**
* JavaScript
*/

gulp.task("concatScripts", function () {
    return gulp.src([
        "./js/*.js",
        "./js/circle/*.js"
    ])
    .pipe(maps.init())
    .pipe(concat("app.js"))
    .pipe(maps.write("./"))
    .pipe(gulp.dest("js"));
});

gulp.task("scripts", ["concatScripts"], function () {
    return gulp.src("js/app.js")
    .pipe(uglify())
    .pipe(rename("app.min.js"))
    .pipe(gulp.dest("./dist/scripts"));
});


/**
* CSS
*/

gulp.task("compileSass", function() {
    return gulp.src("./sass/global.scss")
    .pipe(maps.init())
    .pipe(sass())
    .pipe(maps.write("./"))
    .pipe(gulp.dest("css"));
});

gulp.task("concatStyles", ["compileSass"], function() {
    return gulp.src("./css/*.css")
    .pipe(concat("all.css"))
    .pipe(gulp.dest("css"));
});

gulp.task("styles", ["concatStyles"], function() {
    return gulp.src("./css/all.css")
    .pipe(uglifycss())
    .pipe(rename("all.min.css"))
    .pipe(gulp.dest("dist/styles"));
});


/**
* Images
*/

gulp.task("images", function () {
    return gulp.src("./images/*")
    .pipe(imagemin())
    .pipe(gulp.dest("dist/images"));
});


/**
* Main Tasks
*/

gulp.task("clean", function () {
    del(["./dist/*", "./css/*", "./js/app*.js*"]);
});


gulp.task("html", ["scripts", "styles"],function () {
    return gulp.src("./index.html")
    .pipe(useref({
        noAssets: true
    }))
    .pipe(gulp.dest("dist"));
});

gulp.task("build", function () {
    runSequence("clean", ["html", "images"]);
    return gulp.src("./index.html")
    .pipe(gulp.dest("dist"));
});


gulp.task("default", ["build"]);

/**
* Watch and Serve Tasks
*/

gulp.task("watch", function () {
    gulp.watch("./js/*", ["scripts"]);
    gulp.watch("./sass/*", ["styles"]);
});

gulp.task('scripts-watch', ["scripts"], function (done) {
    browserSync.reload();
    done();
});

gulp.task("styles-watch", ["styles"], function (done) {
    browserSync.reload();
    done();
});

gulp.task("serve", ["build"], function () {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

    gulp.watch("./js/*", ["scripts-watch"]);
    gulp.watch("./sass/*", ["styles-watch"]);
});
