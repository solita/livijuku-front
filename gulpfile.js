  'use strict';

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
var protractor = require('gulp-protractor');
var replace = require('gulp-replace');
var rev = require('gulp-rev');
var rimraf = require('rimraf');
var stylus = require('gulp-stylus');
var uglify = require('gulp-uglify');
var watchify = require('watchify');

// Stream transformer for browserify
var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify');

var paths = {
  styles: {
    source: 'app/styles/styles.styl',
    destination: 'dist/styles/',
    watch: 'app/**/*.styl',
  },
  scripts: {
    source: './app/scripts/app.js',
    destination: './dist/scripts/',
    filename: 'scripts.js'
  },
  templates: {
    source: './app/**/*.html',
    watch: './app/**/*.html',
    destination: './dist/',
    revision: './dist/**/*.html'
  },
  assets: {
    source: [
      './app/assets/**/*.*',
      './app/assets/.*',
      './bower_components/bootstrap/dist/fonts*/*.*'
    ],
    watch: './app/assets/**/*.*',
    destination: './dist/'
  },
  copy: [{
    source: './bower_components/ng-file-upload-shim/*.swf',
    destination: './dist/scripts/ie9/'
  },
  {
    source: './bower_components/ng-file-upload-shim/FileAPI.min.js',
    destination: './dist/scripts/ie9/'
  },
  {
    source: './bower_components/es5-shim/es5-shim.min.js',
    destination: './dist/scripts/ie9/'
  },
  {
    source: './bower_components/json3/lib/json3.min.js',
    destination: './dist/scripts/ie9/'
  }],

  // TODO: Ainoastaan scripts hakemiston js-tiedostot uudelleennimetaan. Sen alla olevaa ie9:a ei voi uudelleennimeta koska latauskomponentti
  // kayttaa suoraan FileAPI.min.js tiedostoa (JEG)
  revision: {
    source: ['./dist/**/*.css', './dist/**/*.js', '!./dist/scripts/ie9/FileAPI.min.js'],
    base: path.join(__dirname, 'dist'),
    destination: './dist/'
  },
  version: {
    destination: './dist/buildversion.html'
  }
};

var production = process.env.NODE_ENV === 'production';

function handleError(err) {
  gutil.log(err);
  gutil.beep();

  if(production) {
    throw err;
  }

  return this.emit('end');
};

gulp.task('templates', function() {
  var pipeline = gulp.src(paths.templates.source)
    .pipe(gulp.dest(paths.templates.destination))

  if(!production) {
    pipeline.pipe(browserSync.reload({stream: true}));
  }
  return pipeline;
});

gulp.task('revision-templates', ['revision', 'templates'], function() {
  var revisions = require('./rev-manifest.json');

  var source = gulp.src(paths.templates.revision);

  for(var key in revisions) {
    source = source.pipe(replace(key, revisions[key]));
  }
  return source.pipe(gulp.dest(paths.templates.destination));
});

gulp.task('assets', function() {
  return gulp.src(paths.assets.source)
    .pipe(gulp.dest(paths.assets.destination));
});

gulp.task('copy', function() {
  return es.merge(paths.copy.map(function(file) {
    return gulp.src(file.source)
      .pipe(gulp.dest(file.destination));
  }));
});

gulp.task('scripts', function() {

  var bundle = browserify({
    entries: [paths.scripts.source],
    debug: !production
  })
  .bundle()
  .on('error', handleError)
  .pipe(source(paths.scripts.filename));

  if (production) {
    bundle
      .pipe(ngAnnotate())
      .pipe(streamify(uglify()));
  }

  return bundle
    .pipe(gulp.dest(paths.scripts.destination));
});

gulp.task('server', function() {

  var proxy = httpProxy.createProxyServer({
    changeOrigin: true,
    target: 'http://localhost:8082',
  });

  proxy.on('error', handleError);

  function proxyAPIRequests(req, res, next) {
    if(req.url.indexOf('/api') > -1) {
      req.url = req.url.replace('/api', '');
      proxy.web(req, res);
      return;
    }
    next();
  }

  function parseCookies (request) {
    var list = {},
      rc = request.headers.cookie;

    rc && rc.split(';').forEach(function( cookie ) {
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
      'oam-user-organization'
    ];

    cookieKeys.forEach(function(key) {
      if(cookies[key]) {
        req.headers[key] = cookies[key];
      }
    });

    next();
  }

  return browserSync({
    port: 9000,
    open: false,
    server: {
      baseDir: './dist',
      middleware: [addAuthenticationHeaders, proxyAPIRequests]
    }
  });
});

gulp.task('styles', function() {
  var pipeline = gulp
    .src(paths.styles.source)
    .pipe(stylus({
      'include css': true
    }))
    .on('error', handleError)
    .pipe(gulp.dest(paths.styles.destination));

  if(!production) {
    pipeline.pipe(browserSync.reload({stream: true}));
  }

  return pipeline;
});

// Templates task riippuvuutena, jotta voidaan olla varmoja dist/ hakemiston olemassaolosta
gulp.task('version', ['templates'], function() {
  var today = new Date();

  fs.writeFileSync(
    paths.version.destination,
    '<h5 class="navbartxt">' + today.toISOString() + ' (' + os.hostname() + ')</h5>');
});

gulp.task('watch', ['scripts'], function() {
  gulp.watch(paths.styles.watch, ['styles']);
  gulp.watch(paths.templates.watch, ['templates']);

  var bundle = watchify(browserify({
    entries: [paths.scripts.source],
    extensions: paths.scripts.extensions,
    debug: !production,
    cache: {},
    packageCache: {},
    fullPaths: true
  }));

  return bundle.on('update', function() {
    gutil.log('Rebundling...');

    bundle.bundle()
      .on('error', handleError).pipe(source(paths.scripts.filename))
      .pipe(gulp.dest(paths.scripts.destination))
      .pipe(browserSync.reload({stream: true}));
  }).emit('update');
});

gulp.task('e2e', ['webdriver_update'], function() {
  gulp.src('./src/tests/e2e/*.js').pipe(protractor.protractor({
    configFile: 'protractor.conf.js'
  })).on('error', handleError);
});

// TODO
gulp.task('e2e-no-selenium-server', ['webdriver_update'], function() {
  gulp.src('./src/tests/e2e/*.js').pipe(protractor.protractor({
    configFile: 'protractor.conf.js'
  })).on('error', handleError);
});

gulp.task('webdriver_standalone', protractor.webdriver_standalone);
gulp.task('webdriver_update', protractor.webdriver_update);

var buildTasks = ['styles', 'templates', 'assets', 'version', 'copy'];

// TODO poista revisioimattomat
gulp.task('revision', buildTasks, function() {
  return gulp.src(paths.revision.source, {base: paths.revision.base})
      .pipe(rev())
      .pipe(gulp.dest(paths.revision.destination))
      .pipe(rev.manifest())
      .pipe(gulp.dest('./'));
});

gulp.task('build', function() {
  rimraf.sync('./dist');
  gulp.start(buildTasks.concat(['scripts', 'revision', 'revision-templates']));
});

gulp.task('default', buildTasks.concat(['server', 'watch']));
