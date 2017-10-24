const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

const config = require('../config')
const baseWebpackConfig = require('./webpack.base.conf')
const resolve = filepath => path.resolve(__dirname, '../' + filepath)

// add hot-reload related code to entry chunks
// Object.keys(baseWebpackConfig.entry).forEach(function (name) {
//   baseWebpackConfig.entry[name] = ['./build/utils/dev-client'].concat(baseWebpackConfig.entry[name])
// })

module.exports = merge(baseWebpackConfig, {
  devtool: '#cheap-module-eval-source-map',

  plugins: [
    new webpack.DefinePlugin(Object.assign({
      'process.env': config.dev.env
    }, config.dev.env)),

    new webpack.HotModuleReplacementPlugin(),

    new webpack.NoEmitOnErrorsPlugin(),

    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: config.base.template,
      inject: config.base.inject
    }),

    new FriendlyErrorsPlugin()
  ],

  devServer: {
    host: '0.0.0.0',
    contentBase: resolve('static'),
    compress: true,
    port: config.dev.port,
    quiet: true
  },

  watch: true
})
