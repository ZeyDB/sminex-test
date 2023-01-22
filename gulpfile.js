const
    concat = require('gulp-concat'),
    cssnano = require('gulp-cssnano'),
    gulp = require('gulp'),
    envify = require('envify'),
    replace = require('gulp-replace'),
    sass = require('gulp-dart-sass'),
    terser = require('gulp-terser'),
    vueify = require('vueify'),

    babelify = require('babelify'),
    browserify = require('browserify'),
    vinyl_buffer = require('vinyl-buffer'),
    source = require('vinyl-source-stream')
;

//--------------------------------------------------------------------------------------------------------------------//

const config = {
    src: {
        css: [
            './src/sass/main.sass',
        ],
        js: [
            './node_modules/@babel/polyfill/dist/polyfill.js',
            './src/js/main.js'
        ]
    },
    build: {
        css: './public/css/',
        js: './public/js/'
    },
    bundles: {
        css: 'app.min.css',
        js: 'app.min.js'
    }
};

//--------------------------------------------------------------------------------------------------------------------//

gulp.task('fix', function () {
    return gulp.src([
        "./node_modules/vueify/lib/compiler.js",
        "./node_modules/vueify/lib/compilers/babel.js"
    ], {base: "./"})
        .pipe(replace("'babel-core'", "'@babel/core'"))
        .pipe(gulp.dest('./'));
});

//--------------------------------------------------------------------------------------------------------------------//

function buildCss(source, bundle, build) {
    return gulp.src(source)
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(concat(bundle))
        .pipe(cssnano([
            'default', {
                cssDeclarationSorter: false,
                discardOverridden: false,
                discardComments: true,
                mergeIdents: true,
            }
        ]))
        .pipe(gulp.dest(build))
}

gulp.task('css:build', function () {
    return buildCss(config.src.css, config.bundles.css, config.build.css);
})


gulp.task('js:build', function () {
    return browserify({
        entries: config.src.js,
    })
        .transform(envify, {"global": true, "NODE_ENV": process.env.NODE_ENV})
        .transform(vueify)
        .transform(babelify, {
            global: true,
            compact: false,
            presets: [
                ["@babel/preset-env"]
            ]
        })
        .transform(babelify)
        .bundle()
        .pipe(source(config.bundles.js))
        .pipe(vinyl_buffer())
        .pipe(
            terser({
                output: {
                    comments: false,
                    beautify: false
                }
            })
        )
        .pipe(gulp.dest(config.build.js));
})

//--------------------------------------------------------------------------------------------------------------------//

gulp.task('build', gulp.series(
    gulp.parallel(
        'css:build',
        'js:build'
    )
))

gulp.task('watch', function () {
    gulp.watch(
        './src/sass/**/*.sass',
        {
            usePolling: true
        },
        gulp.parallel(
            'css:build'
        )
    );

    gulp.watch(
        [
            './src/js/**/*.js',
            './src/**/*.vue'
        ], {
            usePolling: true
        }, gulp.series(
            'js:build',
        )
    );
})
//--------------------------------------------------------------------------------------------------------------------//

gulp.task('default', gulp.series(
    'build',
))
