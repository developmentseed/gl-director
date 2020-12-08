const fs = require('fs');
const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const del = require('del');
const browserSync = require('browser-sync');
const browserify = require('browserify');
const watchify = require('watchify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const log = require('fancy-log');
const errorify = require('errorify');
const historyApiFallback = require('connect-history-api-fallback');
const through2 = require('through2');

const { compile: collecticonsCompile } = require('collecticons-processor');

const {
  appTitle,
  appDescription
} = require('./app/assets/scripts/config/production').default;

// /////////////////////////////////////////////////////////////////////////////
// --------------------------- Variables -------------------------------------//
// ---------------------------------------------------------------------------//

const bs = browserSync.create();

const baseurl = process.env.BASEURL || '';

// Environment
// Set the correct environment, which controls what happens in config.js
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// When being built by circle is set to staging unless we're in the prod branch
if (process.env.CIRCLE_BRANCH) {
  if (process.env.CIRCLE_BRANCH === process.env.PRODUCTION_BRANCH) {
    process.env.NODE_ENV = 'production';
  } else if (process.env.CIRCLE_BRANCH === process.env.STAGING_BRANCH) {
    process.env.NODE_ENV = 'staging';
  } else {
    process.env.NODE_ENV = 'circle';
  }
}

// /////////////////////////////////////////////////////////////////////////////
// ------------------------- Helper functions --------------------------------//
// ---------------------------------------------------------------------------//

const isDev = () => process.env.NODE_ENV === 'development';
const readPackage = () => JSON.parse(fs.readFileSync('package.json'));

// Set the version in an env variable so it gets replaced in the config.
process.env.APP_VERSION = readPackage().version;

// /////////////////////////////////////////////////////////////////////////////
// ------------------------- Callable tasks ----------------------------------//
// ---------------------------------------------------------------------------//

function clean() {
  return del(['.tmp', 'dist']);
}

function serve() {
  bs.init({
    port: 9000,
    server: {
      baseDir: ['.tmp', 'app'],
      routes: {
        '/node_modules': './node_modules'
      },
      ghostMode: false,
      middleware: [historyApiFallback()]
    },
    rewriteRules: [
      {
        // Replace the baseUrl placeholder on runtime.
        match: /{{baseurl}}/g,
        replace: ''
      },
      { match: /{{appTitle}}/g, replace: appTitle },
      { match: /{{appDescription}}/g, replace: appDescription }
    ]
  });

  // watch for changes
  gulp.watch(
    [
      'app/*.html',
      'app/assets/graphics/**/*',
      '!app/assets/icons/collecticons/**/*'
    ],
    bs.reload
  );

  gulp.watch('app/assets/icons/collecticons/**', collecticons);
  gulp.watch('package.json', vendorScripts);
}

module.exports.clean = clean;
module.exports.serve = gulp.series(
  collecticons,
  gulp.parallel(vendorScripts, javascript),
  serve
);
module.exports.default = gulp.series(
  clean,
  collecticons,
  gulp.parallel(vendorScripts, javascript),
  gulp.parallel(html, imagesImagemin),
  copyFiles,
  finish
);

// /////////////////////////////////////////////////////////////////////////////
// ------------------------- Browserify tasks --------------------------------//
// ------------------- (Not to be called directly) ---------------------------//
// ---------------------------------------------------------------------------//

// Compiles the user's script files to bundle.js.
// When including the file in the index.html we need to refer to bundle.js not
// main.js
function javascript() {
  const pkg = readPackage();
  var brs = browserify({
    entries: ['./app/assets/scripts/main.js'],
    debug: true,
    cache: {},
    packageCache: {},
    bundleExternal: true,
    fullPaths: true
  }).on('log', log);

  if (isDev()) {
    brs.plugin(watchify).plugin(errorify).on('update', bundler);
  }

  brs.external(pkg.dependencies ? Object.keys(pkg.dependencies) : []);

  function bundler() {
    var b = brs.bundle();

    if (!isDev()) {
      b.on('error', function (e) {
        throw new Error(e);
      });
    }

    b = b.pipe(source('bundle.js')).pipe(buffer());

    if (isDev()) {
      // Source maps.
      b = b
        .pipe($.sourcemaps.init({ loadMaps: true }))
        .pipe($.sourcemaps.write('./'));
    }

    return b.pipe(gulp.dest('.tmp/assets/scripts')).pipe(bs.stream());
  }

  return bundler();
}

// Vendor scripts. Basically all the dependencies in the package.js.
// Therefore be careful and keep the dependencies clean.
function vendorScripts() {
  // Ensure package is updated.
  const pkg = readPackage();
  // Note on how this works:
  // To have smaller bundles and speed up compilations, the dependencies are
  // kept in a vendor bundle. Browserify allows us to exclude all external
  // dependencies, and then require them all in another bundle. To require
  // them we basically use everything that's under `dependencies` in the
  // package.json. However when we access files in the module folder directly
  // (like something inside a folder - my-module/folder/file), browserify can't
  // find them in the dependencies list. (in this example the dependency would
  // only be my-module). In these cases they have to be explicitly added.
  const extra = [
    // Any file directly accessed on a module folder:
    // my-module/folder/file
  ];
  var vb = browserify({
    debug: true,
    require: pkg.dependencies ? Object.keys(pkg.dependencies).concat(extra) : []
  })
    .bundle()
    .on('error', log.bind(log, 'Browserify Error'))
    .pipe(source('vendor.js'))
    .pipe(buffer());

  if (isDev()) {
    // Source maps.
    vb = vb
      .pipe($.sourcemaps.init({ loadMaps: true }))
      .pipe($.sourcemaps.write('./'));
  }

  return vb.pipe(gulp.dest('.tmp/assets/scripts/')).pipe(bs.stream());
}

// /////////////////////////////////////////////////////////////////////////////
// ------------------------- Collecticon tasks -------------------------------//
// --------------------- (Font generation related) ---------------------------//
// ---------------------------------------------------------------------------//
function collecticons() {
  return collecticonsCompile({
    dirPath: 'app/assets/icons/collecticons/',
    fontName: 'Collecticons',
    authorName: 'Development Seed',
    authorUrl: 'https://developmentseed.org/',
    catalogDest: 'app/assets/scripts/styles/collecticons/',
    preview: false,
    experimentalFontOnCatalog: true,
    experimentalDisableStyles: true
  });
}

// //////////////////////////////////////////////////////////////////////////////
// --------------------------- Helper tasks -----------------------------------//
// ----------------------------------------------------------------------------//

function copyFiles() {
  return gulp
    .src(['app/**/*', '!app/assets/**', '!app/index.html'])
    .pipe(gulp.dest('dist'));
}

function finish() {
  return gulp.src('dist/**/*').pipe($.size({ title: 'build', gzip: true }));
}

// Process the html files. (merge css files, etc)
function html() {
  return (
    gulp
      .src('app/*.html')
      .pipe($.useref({ searchPath: ['.tmp', 'app', '.'] }))
      .pipe(cacheUseref())
      .pipe($.if('*.js', $.terser()))
      .pipe($.if('*.css', $.csso()))
      .pipe($.if(/\.(css|js)$/, $.rev()))
      // Add a prefix to all replacements so next line catches them.
      .pipe($.revRewrite({ prefix: '{{baseurl}}' }))
      .pipe($.replace('{{baseurl}}', baseurl))
      .pipe($.replace('{{appTitle}}', appTitle))
      .pipe($.replace('{{appDescription}}', appDescription))
      .pipe(gulp.dest('dist'))
  );
}

function imagesImagemin() {
  return gulp
    .src(['app/assets/graphics/**/*'])
    .pipe(
      $.imagemin([
        $.imagemin.gifsicle({ interlaced: true }),
        $.imagemin.mozjpeg({ quality: 80, progressive: true }),
        $.imagemin.optipng({ optimizationLevel: 5 }),
        // don't remove IDs from SVGs, they are often used
        // as hooks for embedding and styling.
        $.imagemin.svgo({ plugins: [{ cleanupIDs: false }] })
      ])
    )
    .pipe(gulp.dest('dist/assets/graphics'));
}

/**
 * Caches the useref files.
 * Avoid sending repeated js and css files through the minification pipeline.
 * This happens when there are multiple html pages to process.
 */
function cacheUseref() {
  /* eslint-disable-next-line prefer-const */
  let files = {
    // path: content
  };
  return through2.obj(function (file, enc, cb) {
    const path = file.relative;
    if (files[path]) {
      // There's a file in cache. Check if it's the same.
      const prev = files[path];
      if (Buffer.compare(file.contents, prev) !== 0) {
        this.push(file);
      }
    } else {
      files[path] = file.contents;
      this.push(file);
    }
    cb();
  });
}
