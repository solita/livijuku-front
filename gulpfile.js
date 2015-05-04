var browserify = require('browserify');
var browserSync = require('browser-sync');
var gulp = require('gulp');
var gutil = require('gulp-util');
var stylus = require('gulp-stylus');
var uglify = require('gulp-uglify');
var httpProxy = require('http-proxy');
var watchify = require('watchify');

// Stream transformer for browserify
var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify');

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
    source: './app/**/*.html',
    watch: './app/**/*.html',
    destination: './dist/'
  },
  assets: {
    source: './app/assets/**/*.*',
    watch: './app/assets/**/*.*',
    destination: './dist/'
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
  return gulp.src(paths.templates.source)
    .pipe(gulp.dest(paths.templates.destination));
});

gulp.task('assets', function() {
  return gulp.src(paths.assets.source)
    .pipe(gulp.dest(paths.assets.destination));
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
    bundle.pipe(streamify(uglify()));
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


    if (cookies['oam-remote-user']) {
      req.headers['oam-remote-user'] = cookies['oam-remote-user'];
    }
    if (cookies['oam-groups']) {
      req.headers['oam-groups'] = cookies['oam-groups'];
    }
    if (cookies['oam-user-organization']) {
      req.headers['oam-user-organization'] = cookies['oam-user-organization'];
    }

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

gulp.task('watch', function() {
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



gulp.task('default', ['styles', 'scripts', 'templates', 'assets', 'server', 'watch']);
