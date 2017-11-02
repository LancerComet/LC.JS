/**
 * Project configuration.
 */
const path = require('path')

const projectRoot = path.resolve(__dirname, '../')

exports.base = {
  app: projectRoot + '/dev/index.ts',
  template: projectRoot + '/dev/index.pug',
  inject: true
}

exports.dev = {
  env: require('./envs/env.dev.js'),
  port: 8080,
  autoOpenBrowser: false,
  assetsSubDirectory: 'static',
  assetsPublicPath: '/',
  proxyTable: require('./dev.router.js'),
  cssSourceMap: false  // CSS SourceMap is off by default.
}

exports.build = {
  env: require('./envs/env.prod.js'),
  index: path.resolve(__dirname, '../dist/index.html'),
  assetsRoot: path.resolve(__dirname, '../dist'),
  assetsSubDirectory: 'static',
  assetsPublicPath: '',
  productionSourceMap: false,  // SourceMap is off by default.

  // Run the build command with an extra argument to
  // View the bundle analyzer report after build finishes:
  // `npm run build --report`
  // Set to `true` or `false` to always turn it on or off
  bundleAnalyzerReport: process.env.npm_config_report
}
