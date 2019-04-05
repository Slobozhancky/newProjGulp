var gulp 			= require('gulp'),
	sass 			= require('gulp-sass'),
	browserSync 	= require('browser-sync'),
	concat 			= require('gulp-concat'),
	uglify 			= require('gulp-uglifyjs'),
	cssnano 		= require('gulp-cssnano'),
	concatCss 		= require('gulp-concat-css'),
	rename 			= require('gulp-rename'),
	clean 			= require('gulp-clean'),
	autoPrefixer	= require('gulp-autoprefixer'),
	sourcemaps 		= require('gulp-sourcemaps');

//================================
// Конкатинация SASS 
//================================
gulp.task('sass', () => {
	gulp.src('app/sass/**/*.+(sass|scss)')
		.pipe(sourcemaps.init())
		.pipe(sass({outputStyle: 'expanded'}).on('error',sass.logError))
		.pipe(autoPrefixer(['last  15 version','>1%','ie 8', 'ie 7']))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.reload({stream: true}));
});

//================================
// Live Reload
//================================
gulp.task('watch', ['sass'] , () =>{
	browserSync.init({
		server: {
			baseDir: 'app'
		},
		notify: false
	});
	gulp.watch('app/sass/**/*.+(sass|scss)', ['sass']);
	gulp.watch('app/**/*.+(html|js)', browserSync.reload);
});
//================================
// Конкатенация библиотек
//================================

gulp.task('concat-js',() => {
	gulp.src([
			'node_modules/jquery/dist/jquery.min.js',
			'node_modules/slick-carousel/slick/slick.min.js',
			'node_modules/@fancyapps/fancybox/dist/jquery.fancybox.min.js'
		])
		.pipe(concat('libs.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('app/js'));
});

gulp.task('concat-css',() => {
	gulp.src([
			'node_modules/slick-carousel/slick/slick.css',
			'node_modules/@fancyapps/fancybox/dist/jquery.fancybox.min.css'
		])
		.pipe(concatCss('libs.min.css'))
		.pipe(cssnano())
		.pipe(gulp.dest('app/css'));
});

gulp.task('concat-all', ['concat-css','concat-js']);
//================================
// Минификация своих JS,CSS
//================================
gulp.task('css-min',['sass'],() => {
	gulp.src('app/css/style.css')
		.pipe(cssnano())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('app/css'));
});

gulp.task('js-min',() => {
	gulp.src('app/js/main.js')
		.pipe(uglify())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('app/js'));
});

gulp.task('all-min',['css-min','js-min']);

//================================
// Очистить папку Dist
//================================

gulp.task('clean', ()=>{
	gulp.src('dist', {read: false}).pipe(clean());
});
// ===============================================
// Сборка проекта
// ===============================================

gulp.task('build',['sass','all-min','clean'],()=>{
	gulp.src('app/css/**/*').pipe(gulp.dest('dist/css'));
	gulp.src('app/js/**/*').pipe(gulp.dest('dist/js'));
	gulp.src('app/fonts/**/*').pipe(gulp.dest('dist/fonts'));
	gulp.src('app/img/**/*').pipe(gulp.dest('dist/img'));
	gulp.src(['app/*.html','app/favicon.*']).pipe(gulp.dest('dist'));

});
// ===============================================
// Переиминовать оптимизированные картинки и удалить исходники 
// ===============================================

gulp.task('img-rr', ()=>{
	gulp.src('app/img/**/*-min.*')
		.pipe(rename(function(opt,file){
			opt.basename = opt.basename.slice(0, -4);
			gulp.src('app/img/**/'+file).pipe(clean());
			gulp.src(file.history[0], {read: false}).pipe(clean());
			return opt;
		}))
		.pipe(gulp.dest('app/img'));
});
