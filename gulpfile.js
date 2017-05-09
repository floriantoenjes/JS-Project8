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
      runSequence = require("run-sequence");

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


gulp.task("images", function () {
    return gulp.src("./images/*")
    .pipe(imagemin())
    .pipe(gulp.dest("dist/content"));
});


gulp.task("clean", function () {
    del("./dist/*");
});


gulp.task("build", function() {
    runSequence("clean", ["scripts", "styles", "images"]);
});

gulp.task("default", ["build"]);

gulp.task("serve", ["build"]);
