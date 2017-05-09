"use strict";

const gulp = require("gulp"),
      concat = require("gulp-concat"),
      maps = require("gulp-sourcemaps"),
      uglify = require("gulp-uglify"),
      rename = require("gulp-rename");

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
