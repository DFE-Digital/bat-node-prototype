var gulp = require("gulp");
var sass = require("gulp-sass");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");

gulp.task("views", function() {
  return gulp.src(["src/views/**/*"]).pipe(gulp.dest("dist/views"));
});

gulp.task("sass", function() {
  return gulp
    .src("src/styles/**/*")
    .pipe(sass())
    .pipe(gulp.dest("dist/styles"));
});

gulp.task("typescript", function() {
  return tsProject
    .src()
    .pipe(tsProject())
    .js.pipe(gulp.dest("dist"));
});

// pulling everything together
gulp.task("default", ["typescript", "views", "sass"]);

//
gulp.task("watch", ["default"], function() {
  gulp.watch("src/styles/**/*", ["sass"]);
  gulp.watch("src/views/**/*", ["views"]);
  gulp.watch("src/**/*.ts", ["typescript"]);
});
