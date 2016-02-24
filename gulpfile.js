'use strict';

var autoprefixer = require('gulp-autoprefixer');
var browserify = require('browserify');
var browserSync = require('browser-sync');
var es = require('event-stream');
var fs = require('fs');
var gulp = require('gulp');
var gutil = require('gulp-util');
var httpProxy = require('http-proxy');
var ngAnnotate = require('gulp-ng-annotate');
var os = require('os');
var path = require('path');
var pkg = require('./package.json');
var replace = require('gulp-replace');
var rev = require('gulp-rev');
var stylus = require('gulp-stylus');
var uglify = require('gulp-uglify');
var watchify = require('watchify');
var notifier = require('node-notifier');
var sourcemaps = require('gulp-sourcemaps');
// Stream transformer for browserify
var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify');
var inject = require('gulp-inject');

var paths = {
  styles: {
    source: 'app/styles/styles.styl',
    destination: 'dist/styles/',
    watch: 'app/**/*.styl'
  },
  scripts: {
    source: './app/scripts/app.js',
    destination: './dist/scripts/',
    filename: 'scripts.js'
  },
  templates: {
    source: './app/*.html',
    watch: './app/*.html',
    destination: './dist/',
    revision: './dist/**/*.html'
  },
  assets: {
    source: [
      './app/assets/**/*.*',
      './app/assets/.*',
      './node_modules/bootstrap/dist/fonts*/*.*'
    ],
    watch: './app/assets/**/*.*',
    destination: './dist/'
  },
  copy: [{
    source: './node_modules/ng-file-upload/dist/*.swf',
    destination: './dist/scripts/ie9/'
  },
    {
      source: './node_modules/ng-file-upload/dist/FileAPI.min.js',
      destination: './dist/scripts/ie9/'
    },
    {
      source: './node_modules/es5-shim/es5-shim.min.js',
      destination: './dist/scripts/ie9/'
    },
    {
      source: './node_modules/json3/lib/json3.min.js',
      destination: './dist/scripts/ie9/'
    }],

  // TODO: Ainoastaan scripts hakemiston js-tiedostot uudelleennimetaan.
  // Sen alla olevaa ie9:a ei voi uudelleennimeta koska latauskomponentti
  // kayttaa suoraan FileAPI.min.js tiedostoa (JEG)
  inject: {
    resources: ['./dist/**/*.css', '!./dist/pdf/**/*.css', './dist/**/*.js', '!./dist/scripts/ie9/*.js', '!./dist/pdf/**/*.js']
  }
};

var production = process.env.NODE_ENV === 'production';

function getBrowserify() {
  return browserify({
    entries: [paths.scripts.source],
    extensions: paths.scripts.extensions,
    debug: !production,
    cache: {},
    packageCache: {},
    fullPaths: true,
    insertGlobalVars: {
      __VERSION__: function () {
        var pkgVersion = pkg.version;
        var isCandidate = pkgVersion.split('-').length > 1;
        var buildDetails = new Date().toISOString() + ' ' + os.hostname();

        var version = isCandidate ? pkgVersion + ' ' + buildDetails : pkgVersion;

        return JSON.stringify(version);
      }
    }
  });
}

function handleError(err) {
  gutil.log(err);
  gutil.beep();

  if (production) {
    throw err;
  }

  notifier.notify({
    title: 'Compile Error',
    message: err.message
  });

  return this.emit('end');
};

gulp.task('templates', ['styles', 'scripts'], function () {
  var resources = gulp.src(paths.inject.resources, {read: false});
  var pipeline = gulp.src(paths.templates.source)
    .pipe(inject(resources, {ignorePath: 'dist', removeTags: true, addRootSlash: false}))
    .pipe(gulp.dest(paths.templates.destination));

  return pipeline;
});

gulp.task('assets', function () {
  return gulp.src(paths.assets.source)
    .pipe(gulp.dest(paths.assets.destination));
});

gulp.task('copy', function () {
  return es.merge(paths.copy.map(function (file) {
    return gulp.src(file.source)
      .pipe(gulp.dest(file.destination));
  }));
});

gulp.task('scripts', function () {

  var bundle = getBrowserify()
    .bundle()
    .on('error', handleError)
    .pipe(source(paths.scripts.filename));

  if (production) {
    bundle = bundle
      .pipe(ngAnnotate())
      .pipe(streamify(uglify()))
      .pipe(streamify(rev()));
  }

  return bundle
    .pipe(gulp.dest(paths.scripts.destination));
});

gulp.task('server', function () {

  var proxy = httpProxy.createProxyServer({
    changeOrigin: true,
    target: 'http://localhost:8082'
  });

  proxy.on('error', handleError);

  function proxyAPIRequests(req, res, next) {
    if (req.url.match(/^\/api/)) {
      req.url = req.url.replace('/api', '');
      proxy.web(req, res);
      return;
    }
    next();
  }

  function parseCookies(request) {
    var list = {},
      rc = request.headers.cookie;

    rc && rc.split(';').forEach(function (cookie) {
      var parts = cookie.split('=');
      list[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    return list;
  }

  function addAuthenticationHeaders(req, res, next) {
    var cookies = parseCookies(req);

    var cookieKeys = [
      'oam-remote-user',
      'oam-groups',
      'oam-user-first-name',
      'oam-user-last-name',
      'oam-user-organization',
      'oam-user-department'
    ];

    cookieKeys.forEach(function (key) {
      if (cookies[key]) {
        req.headers[key] = cookies[key];
      }
    });

    next();
  }

  return browserSync({
    port: 9000,
    open: false,
    notify: false,
    ghostMode: false,
    server: {
      baseDir: './dist',
      middleware: [addAuthenticationHeaders, proxyAPIRequests]
    }
  });
});

gulp.task('styles', function () {
  var pipeline = gulp
    .src(paths.styles.source)
    .pipe(sourcemaps.init())
    .pipe(stylus({
      'include css': true
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions', 'ie >= 9'],
      cascade: false
    }))
    .pipe(sourcemaps.write())
    .on('error', handleError);

  if(production) {
    pipeline = pipeline.pipe(rev());
  }

  pipeline = pipeline.pipe(gulp.dest(paths.styles.destination));

  if(!production) {
    pipeline.pipe(browserSync.reload({stream: true}));
  }

  return pipeline;
});

gulp.task('watch', ['scripts'], function () {
  gulp.watch(paths.styles.watch, ['styles']);
  gulp.watch(paths.templates.watch, ['templates']);

  var bundle = watchify(getBrowserify());

  return bundle.on('update', function () {
    gutil.log('Rebundling...');

    bundle.bundle()
      .on('error', handleError).pipe(source(paths.scripts.filename))
      .pipe(gulp.dest(paths.scripts.destination))
      .pipe(browserSync.reload({stream: true}));
  }).emit('update');
});

gulp.task('build', ['styles', 'assets', 'copy', 'scripts', 'templates']);
gulp.task('default', ['styles', 'assets', 'copy', 'templates', 'watch', 'server']);
