const { dest, series, src, watch } = require("gulp");

const autoprefixer = require("autoprefixer");
const babel = require("gulp-babel");
const browserSync = require("browser-sync").create();
const combineMediaquery = require("postcss-combine-media-query");
const cssnano = require("cssnano");
const del = require("del");
const htmlmin = require("gulp-htmlmin");
const inline = require("gulp-inline");
const imagemin = require("gulp-imagemin");
const plumber = require("gulp-plumber");
const postcss = require("gulp-postcss");
const pugjs = require("gulp-pug");
const sass = require("gulp-sass");
const sitemap = require("gulp-sitemap");
const uglify = require("gulp-uglify");
const uncss = require("postcss-uncss");

function clean() {
  return del(["www"]);
}

function pug() {
  return src("src/index.pug")
    .pipe(plumber())
    .pipe(
      pugjs({
        doctype: "html",
        pretty: true
      })
    )
    .pipe(dest("www/"));
}

function html() {
  const options = {
    collapseInlineTagWhitespace: true,
    collapseWhitespace: true,
    collapseBooleanAttributes: true,
    removeComments: true,
    removeEmptyAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true
  };

  return src("www/index.html")
    .pipe(htmlmin(options))
    .pipe(dest("www/"));
}

function css() {
  const plugins = [
    autoprefixer(),
    combineMediaquery(),
    uncss({
      html: ["www/index.html"],
      htmlroot: "www/"
    }),
    cssnano()
  ];

  return src("src/scss/*.scss")
    .pipe(plumber())
    .pipe(sass().on("error", sass.logError))
    .pipe(postcss(plugins))
    .pipe(dest("www/css/"))
    .pipe(browserSync.stream());
}

function js() {
  return src("src/js/*.js")
    .pipe(plumber())
    .pipe(babel())
    .pipe(uglify())
    .pipe(dest("www/js/"))
    .pipe(browserSync.stream());
}

function img() {
  return src("src/img/*.*")
    .pipe(imagemin())
    .pipe(dest("www/img/"));
}

function assets() {
  return src(["src/favicon.ico", "src/robots.txt", "src/time.php"]).pipe(dest("www/"));
}

function serve() {
  browserSync.init({
    notify: false,
    server: {
      baseDir: "www/"
    }
  });

  watch("src/*.pug", pug);
  watch("src/scss/*.scss", css);
  watch("src/js/*.js", js);
}

function inlineSources() {
  return src("www/index.html")
    .pipe(
      inline({
        base: "www/"
      })
    )
    .pipe(dest("www/"));
}

function deleteSources() {
  return del(["www/css", "www/img/*.svg", "www/js"], { force: true });
}

function sitemapXml() {
  return src("www/*.html", {
    read: false
  })
    .pipe(
      sitemap({
        siteUrl: "http://dejuistetijd.be/",
        lastmod: false
      })
    )
    .pipe(dest("www/"));
}

exports.default = series(clean, pug, js, css, img, assets, serve);
exports.build = series(clean, pug, js, css, img, assets, inlineSources, deleteSources, html, sitemapXml);
