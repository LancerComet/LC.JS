/**
 * This config file is for bundling and testing.
 */

const path = require('path')
const webpack = require('webpack')
const OptimizeJsPlugin = require('optimize-js-plugin')

const baseConfig = require('./webpack.base.conf')
const config = require('../config')
const env = process.env.NODE_ENV === 'testing'
  ? require('../config/envs/env.test.js')
  : config.build.env

const isProd = process.env.NODE_ENV === 'production'
const resolve = filepath => path.resolve(__dirname, '../' + filepath)

const webpackConfig = {
  entry: {
    lc: resolve('src/index.ts')
  },

  output: {
    path: config.build.assetsRoot,
    filename: '[name].dist.js',
    chunkFilename: '[name].dist.js'
  },

  resolve: baseConfig.resolve,

  module: {
    rules: baseConfig.rules
  },

  devtool: isProd
    ? config.build.productionSourceMap
    : '#source-map',

  plugins: [
    new webpack.DefinePlugin(Object.assign({
      'process.env': env
    }, env)),

    new webpack.optimize.ModuleConcatenationPlugin(),

    new webpack.optimize.UglifyJsPlugin(Object.assign({}, require('./uglify.conf'), {
      sourceMap: config.build.productionSourceMap
    })),

    new OptimizeJsPlugin({
      sourceMap: config.build.productionSourceMap
    })
  ]
}

if (isProd) {
  webpackConfig.output.library = 'LC'
  webpackConfig.output.libraryTarget = 'commonjs2'
}

if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
