const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const pump = require('pump');
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');
const liveserver = require('gulp-live-server');

// Tarefas que serão exeutadas por padrão
gulp.task('default', ['minify-css','sass','concat-css','concat-js','uglify-js','image-min','minify-html','watch','liveserver']);

// Tarefa para minificar um arquivo .css
gulp.task('minify-css', () => {
	return gulp.src('src/css/*.css')
	.pipe(cleanCSS({compatibility: 'ie8'}))
	.pipe(gulp.dest('css'));
});

// Tarefa para compilar arquivos sass e já gerar compactado
gulp.task('sass', function () {
	return gulp.src('src/sass/*.scss')
	.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
	.pipe(gulp.dest('css'));
});

// Tarefa para juntar arquivos .css em um só
gulp.task('concat-css', function() {
	return gulp.src('src/css/pages/*.css')
	.pipe(concat('pages.css'))
	.pipe(gulp.dest('css'));
});

// Tarefa para juntar arquivos .js em um só
gulp.task('concat-js', function() {
	return gulp.src('src/js/pages/*.js')
	.pipe(concat('pages.js'))
	.pipe(gulp.dest('js'));
});

// Tarefa para minificar um arquivo .js
// O pump é utilizado para que no caso de ocorrer algum erro poder mostrar em qual js e linha ocorreu erro na hora de compilar
// Obs.: Não funiona com ES6 (verificar na documentação sobre como configurar outro módulo)
gulp.task('uglify-js', (cb) => {
	pump([
		gulp.src('src/js/*.js'),
		uglify(),
		gulp.dest('js')
	], cb);
});

// Tarefa para diminuir o tamanho das imagens
// Ver na documentação as opções para outros tipos de imagens (GIF, JPEG, PNG e SVG)
gulp.task('image-min', function() {
	return gulp.src('src/images/**/*.jpg')
	.pipe(imagemin([
		imagemin.jpegtran({
			progressive: true
		})
	]))
	.pipe(gulp.dest('images'));
});

// Tarefa para minificar arquivos HTML
gulp.task('minify-html', function() {
  return gulp.src('src/html/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('.'));
});

// Utilizando a função watch do gulp para recompilar todas as tarefas se houver alteração de arquivos
gulp.task('watch', function() {
	gulp.watch('src/css/*.css', ['minify-css']);
	gulp.watch('src/sass/*.scss', ['sass']);
	gulp.watch('src/css/pages/*.css', ['concat-css']);
	gulp.watch('src/js/pages/*.js', ['concat-js']);
	gulp.watch('src/js/*.js', ['uglify-js']);
	gulp.watch('src/images/**/*.jpg', ['image-min']);
	gulp.watch('src/html/*.html', ['minify-html']);
});

// Servidor web com livereload
gulp.task('liveserver', function() {
	// Inicia o servidor
	var server = liveserver.static("./", 8000);
	server.start();

	// Habilita o livereload
	gulp.watch(['*.html','css/*.css','js/*.js','images/*.jpg'], function(file) {
		server.notify.apply(server, [file]);
	});
});