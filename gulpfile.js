const gulp = require("gulp");
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");
const ts = require("gulp-typescript");
const tsProject = ts.createProject("tsconfig.json");
const nodemon = require("gulp-nodemon");

gulp.task("views", function() {
  return gulp.src(["src/views/**/*"]).pipe(gulp.dest("dist/views"));
});

gulp.task("sass", function() {
  return gulp
    .src("src/styles/**/*")
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        outputStyle: "expanded"
      })
    )
    .on("error", sass.logError)
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("dist/styles"));
});

gulp.task("typescript", function() {
  return gulp
    .src("src/**/*.ts")
    .pipe(sourcemaps.init()) // This means sourcemaps will be generated
    .pipe(tsProject())
    .pipe(sourcemaps.write(".", { includeContent: false, sourceRoot: "../src" }))
    .pipe(gulp.dest("dist"));
});

// pulling everything together
gulp.task("build", ["typescript", "views", "sass"]);

// watch stuff
gulp.task("watch-assets", ["build"], function() {
  gulp.watch("src/styles/**/*", ["sass"]);
  gulp.watch("src/views/**/*", ["views"]);
  gulp.watch("src/**/*.ts", ["typescript"]);
  gulp.watch("gulpfile.js", ["build"]);
});

gulp.task("default", ["watch-assets"], function() {
  nodemon({
    watch: [".env", "**/*.js", "**/*.json"],
    script: "dist/server.js",
    ignore: ["node_modules/**/*"]
  }).on("quit", () => process.exit(0));
});
