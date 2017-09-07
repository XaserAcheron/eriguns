const gulp   = require('gulp');
const zip    = require('gulp-zip');
const rename = require('gulp-rename');
const merge  = require('merge-stream');
const config = {
	dir: {
		src: ['eriguns1', 'eriguns2'],
		dest: 'dist',
	},
	pkg: require('./package.json')
};

gulp.task('compress', () =>
	merge(config.dir.src.map(proj =>
		gulp.src(`${proj}/**`)
			.pipe(zip(`${proj}.pk3`))
			.pipe(gulp.dest(config.dir.dest))
	))
);

gulp.task('copy-wadinfo', () =>
	merge(config.dir.src.map(proj =>
		gulp.src(`${proj}/wadinfo.txt`)
			.pipe(rename(`${proj}.txt`))
			.pipe(gulp.dest(config.dir.dest))
	))
);

gulp.task('copy-dist', ['compress', 'copy-wadinfo'], () => {
	for(ext of ['pk3', 'txt']) {
		for(proj of config.dir.src) {
			gulp.src(`${config.dir.dest}/${proj}.${ext}`)
				.pipe(rename(`${proj}_${config.pkg.version}.${ext}`))
				.pipe(gulp.dest(config.dir.dest))
			;
		}
	}
});

gulp.task('build'  , ['compress', 'copy-wadinfo']);
gulp.task('dist'   , ['compress', 'copy-wadinfo', 'copy-dist']);
gulp.task('default', ['build']);
