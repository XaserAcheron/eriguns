const gulp    = require('gulp');
const zip     = require('gulp-zip');
const rename  = require('gulp-rename');
const replace = require('gulp-replace');
const filter  = require('gulp-filter');
const merge   = require('merge-stream');
const moment  = require('moment');

const config = {
	dir: {
		src: ['eriguns1', 'eriguns2'],
		dest: 'dist',
	},
	pkg: require('./package.json')
};
const today = moment.utc().format('MM/DD/YYYY');

gulp.task('compress', () =>
	merge(config.dir.src.map(proj => {
		const wadinfoFilter = filter(`${proj}/wadinfo.txt`, { restore: true });
		return gulp.src(`${proj}/**`)
			.pipe(wadinfoFilter)
			.pipe(replace('x.x.x', config.pkg.version))
			.pipe(replace('xx/xx/xxxx', today))
			.pipe(wadinfoFilter.restore)
			.pipe(zip(`${proj}.pk3`))
			.pipe(gulp.dest(config.dir.dest))
	}))
);

gulp.task('copy-wadinfo', () =>
	merge(config.dir.src.map(proj =>
		gulp.src(`${proj}/wadinfo.txt`)
			.pipe(replace('x.x.x', config.pkg.version))
			.pipe(replace('xx/xx/xxxx', today))
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
