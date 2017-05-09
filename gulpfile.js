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
      webserver = require('gulp-webserver'),
      useref = require("gulp-useref");


/* JavaScript */
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

gulp.task("minifyScripts", ["concatScripts"], function () {
    return gulp.src("js/app.js")
    .pipe(uglify())
    .pipe(rename("app.min.js"))
    .pipe(gulp.dest("js"));
});

gulp.task("scripts", ["minifyScripts"], function () {
    return gulp.src("./js/app.min.js")
    .pipe(gulp.dest("dist/scripts"));
});


/* CSS */
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

gulp.task("minifyStyles", ["concatStyles"], function() {
    return gulp.src("./css/all.css")
    .pipe(uglifycss())
    .pipe(rename("all.min.css"))
    .pipe(gulp.dest("css"));
});

gulp.task("styles", ["minifyStyles"], function() {
    return gulp.src("./css/all.min.css")
    .pipe(gulp.dest("dist/styles"));
});


/* Images */
gulp.task("images", function () {
    return gulp.src("./images/*")
    .pipe(imagemin())
    .pipe(gulp.dest("dist/images"));
});


/* Main Tasks */
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

gulp.task("serve", ["build"], function () {
    gulp.src("./dist/")
    .pipe(webserver({
        open: true
    }));
});
