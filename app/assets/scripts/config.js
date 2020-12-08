'use strict';
import defaultsDeep from 'lodash.defaultsdeep';
/*
 * App configuration.
 *
 * Uses settings in config/production.js, with any properties set by
 * config/staging.js or config/local.js overriding them depending upon the
 * environment.
 *
 * This file should not be modified.  Instead, modify one of:
 *
 *  - config/production.js
 *      Production settings (base).
 *  - config/staging.js
 *      Overrides to production if ENV is staging.
 *  - config/local.js
 *      Overrides if local.js exists.
 *      This last file is gitignored, so you can safely change it without
 *      polluting the repo.
 */

var configurations = require('./config/*.js', { mode: 'hash' });
var config = configurations.production || {};

if (process.env.NODE_ENV === 'staging') {
  config = defaultsDeep(configurations.staging, config);
}
if (process.env.NODE_ENV === 'development') {
  config = defaultsDeep(configurations.local || {}, config);
}

// The require doesn't play super well with es6 imports. It creates an internal
// 'default' property. Export that.
export default config.default;
