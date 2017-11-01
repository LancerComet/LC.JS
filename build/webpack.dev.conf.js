const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

const config = require('../config')
const resolve = filepath => path.resolve(__dirname, '../' + filepath)

const srcFolders = ['dev', 'src', 'test'].map(resolve)

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
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },

  resolve: {
    extensions: ['.js', '.ts', '.json'],

    modules: [
      resolve('src'),
      resolve('node_modules')
    ],

    alias: {
      'src': resolve('src')
    }
  },

  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: 'pug-loader'
      },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: require('../babel.dev.json')
        },
        include: srcFolders
      },
      {
        test: /\.tsx?$/,
        use: [
          // 'cache-loader',
          // 'thread-loader',
          'babel-loader',
          {
            loader: 'ts-loader',
            // options: { happyPackMode: true }
          }
        ],
        include: srcFolders
      }
    ]
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
    contentBase: resolve('static'),
    compress: true,
    port: config.dev.port,
    quiet: true
  },

  watch: true
}
