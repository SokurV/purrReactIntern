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
const changed = require('gulp-changed')
const webpConv = require('gulp-webp')
const plumber = require('gulp-plumber')
const ttf2woff2 = require('gulp-ttftowoff2')
const ttf2woff = require('gulp-ttf2woff')

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
}

function copyImg(){
    return src('src/assets/**/*.+(png|jpg|jpeg|gif|ico)')
        .pipe(dest('dist/assets'))
}

function webpConvert(){
	return src('src/assets/**/*.+(png|jpg|jpeg|gif|ico)')
		.pipe(plumber())
		.pipe(changed('dist/assets', {
			extension: '.webp'
		}))
		.pipe(webpConv())
		.pipe(dest('src/assets'))
		.pipe(dest('dist/assets'))
}

function copySvg(){
    return src('src/assets/**/*.svg')
        .pipe(dest('dist/assets'))
}

function copyFonts(){
    return src('src/fonts/**/*.+(woff|woff2)')
        .pipe(dest('dist/fonts'))
}

function fontsConvertToWoff(){
    return src('src/fonts/**/*.+(ttf|otf)')
        .pipe(changed('dist/fonts', {
                extension: '.woff',
                hasChanged: changed.compareLastModifiedTime
            }))
        .pipe(ttf2woff())
        .pipe(dest('dist/fonts'))
}

function fontsConvertToWoff2(){
    return src('src/fonts/**/*.+(ttf|otf)')
        .pipe(changed('dist/fonts', {
                extension: '.woff2',
                hasChanged: changed.compareLastModifiedTime
            }))
        .pipe(ttf2woff2())
        .pipe(dest('dist/fonts'))
}

async function copyResources(){
    copyFonts()
    fontsConvertToWoff()
    fontsConvertToWoff2()
    copySvg()
    await copyImg()
    webpConvert()
}

function cleanDist() {
    return src('dist/*')
        .pipe(deletefiles())
}

function deleteWebp() {
    return src('src/assets/**/*.webp')
        .pipe(deletefiles())
}

module.exports.cleandist = cleanDist

module.exports.deletewebp = deleteWebp

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

module.exports.faststart = series(
    styles, 
    dev_js,
    pages,
    startServer, 
    watching
)

module.exports.fastbuild = series(
    styles, 
    build_js,
    pages,
)