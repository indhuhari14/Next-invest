
const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const terser = require('gulp-terser');
const browsersync = require('browser-sync').create();

//scss task
function scssTask() {
    return src('resources/scss/main.scss', {sourcemaps: true})
        .pipe(sass())
        .pipe(dest('app', {sourcemaps: '.'}));
}

function cssminifyTask() {
    return src('app/main.css',{sourcemaps: true})
        .pipe(sass())
        .pipe(postcss([cssnano()]))
        .pipe(dest('dist', { sourcemaps: '.' }));
}

//js task 
function jsTask() {
    return src('resources/js/script.js', {sourcemaps: true})
        .pipe(terser())
        .pipe(dest('dist', {sourcemaps: '.'}));
}

//browser syn
function browsersyncServer(cb) {
    browsersync.init ({
        server: {
            baseDir: '.'
        }
    });
    cb();
}

function browsersyncReload(cb) {
    browsersync.reload();
    cb();
}

function watchTask() {
    watch('*.html', browsersyncReload);
    watch(['resources/scss/**/*.scss', 'resources/js/**/*.js'], series(scssTask, cssminifyTask, jsTask, browsersyncReload));
}

//default tasks
exports.default = series(
    scssTask,
    jsTask,
    browsersyncServer,
    watchTask
)
