const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

const config = require('../config')
const baseConfig = require('./webpack.base.conf')

// add hot-reload related code to entry chunks
// Object.keys(baseWebpackConfig.entry).forEach(function (name) {
//   baseWebpackConfig.entry[name] = ['./build/utils/dev-client'].concat(baseWebpackConfig.entry[name])
// })

module.exports = {
  entry: {
    app: config.base.app
  },

  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: config.dev.assetsPublicPath
  },

  resolve: baseConfig.resolve,

  module: {
    rules: baseConfig.rules
  },

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
    contentBase: path.resolve(__dirname, '../static'),
    compress: true,
    port: config.dev.port,
    quiet: true
  },

  watch: true
}
