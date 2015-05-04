var browserify = require('browserify');
var browserSync = require('browser-sync');
var es = require('event-stream');
var gulp = require('gulp');
var gutil = require('gulp-util');
var httpProxy = require('http-proxy');
var path = require('path');
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
      './bower_components/bootstrap/dist/fonts*/*.*',
      './bower_components/ng-file-upload-shim/*.swf'
    ],
    watch: './app/assets/**/*.*',
    destination: './dist/'
  },
  copy: [{
    source: './bower_components/ng-file-upload-shim/*.swf',
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
  revision: {
    source: ['./dist/**/*.css', './dist/**/*.js'],
    base: path.join(__dirname, 'dist'),
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

  });
});


var buildTasks = ['styles', 'scripts', 'templates', 'assets', 'copy'];

gulp.task('revision', buildTasks, function() {
  return gulp.src(paths.revision.source, {base: paths.revision.base})
      .pipe(rev())
      .pipe(gulp.dest(paths.revision.destination))
      .pipe(rev.manifest())
      .pipe(gulp.dest('./'));
});

gulp.task('build', function() {
  rimraf.sync('./dist');
  gulp.start(buildTasks.concat(['revision', 'revision-templates']));
});

gulp.task('default', buildTasks.concat(['server', 'watch']));
