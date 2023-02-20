const {src, dest, watch, parallel, series} = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const bulk = require('gulp-sass-bulk-importer')
const prefixer = require('gulp-autoprefixer')
const clean = require('gulp-clean-css')
const concat = require('gulp-concat')
const map = require('gulp-sourcemaps')
const browserSync = require('browser-sync').create()
const uglify = require('gulp-uglify-es').default
const babel = require('gulp-babel')
const deletefiles = require('gulp-clean')

async function startServer() {
    browserSync.init({
        server: {
            baseDir: './dist/',
            serveStaticOptions: {
            extensions: ['html'],
            },
        },
        port: 8080,
        ui: { port: 8081 },
        open: true,
    })
}

function pages() {
    return src('./src/pages/*.html')
        .pipe(dest('./dist/'))
        .pipe(browserSync.stream())
  }

function styles(){
    return src('src/styles/sass/*.sass')
        .pipe(map.init())
        .pipe(bulk())
        .pipe(sass().on('error', sass.logError))
        .pipe(prefixer({
            overrideBrowserList: ['last 3 version'], grid: true, flex: true
        }))
        .pipe(clean())
        .pipe(concat('index.min.css'))
        .pipe(map.write('../sourcemaps/'))
        .pipe(dest('dist/styles/css/'))
        .pipe(browserSync.stream())
}

function dev_js() {
	return src(['src/components/**/*.js', 'src/js/index.js'])
        .pipe(map.init())
        .pipe(uglify())
        .pipe(concat('index.min.js'))
        .pipe(map.write('../sourcemaps'))
        .pipe(dest('dist/js/'))
        .pipe(browserSync.stream())
}

function build_js() {
	return src(['src/components/**/*.js', 'src/js/index.js'])
		.pipe(uglify())
		.pipe(babel({
			presets: ['@babel/env']
		}))
		.pipe(concat('index.min.js'))
		.pipe(dest('dist/js/'))
}

function watching(){
    watch('src/pages/*.html', pages)
    watch('src/**/*.sass', styles)
    watch(['src/**/*.js', '!src/js/*.min.js'], dev_js)
    watch('src/images/**/*.+(png|jpg|jpeg|gif|svg|ico)', copyImg)
    watch('src/fonts/**/*.+(otf|ttf)', copyFonts)
}

function copyImg(){
    return src('src/images/**/*.+(png|jpg|jpeg|gif|svg|ico)')
        .pipe(dest('dist/images'))
}

function copyVideo(){
    return src('src/video/**/*.+(MP4)')
        .pipe(dest('dist/video'))
}

function copyFonts(){
    return src('src/fonts/**/*.+(otf|ttf)')
        .pipe(dest('dist/fonts'))
}

function copySvg(){
    return src('src/svg/**/*.svg')
        .pipe(dest('dist/svg'))
}

async function copyResources(){
    copyImg()
    copyFonts()
    copySvg()
    copyVideo()
}

function cleanDistImg() {
    return src('dist/images/*')
        .pipe(deletefiles())
}

function cleanDist() {
    return src('dist/*')
        .pipe(deletefiles())
}

module.exports.cleanimg = cleanDistImg

module.exports.cleandist = cleanDist

module.exports.start = series(
    cleanDist,
    styles, 
    dev_js,
    pages, 
    copyResources,
    startServer, 
    watching
)

module.exports.build = series(
    cleanDist,
    styles, 
    build_js,
    pages,
    copyResources
)

//Что можно добавить в сборку:
//Склейка и сжатие файлов компонентов JS/SASS/HTML (модуль gulp-include)
//Объединение svg в спрайт для меньшего количества запросов к серверу
//Конвертация шрифтов в .woff .woff2