const path = require('path')
const config = require('../config')

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
        use: [
          'cache-loader',
          'thread-loader',
          'babel-loader'
        ],
        include: ['dev', 'src', 'test'].map(resolve)
      },
      {
        test: /\.tsx?$/,
        use: [
          'cache-loader',
          'thread-loader',
          'babel-loader',
          {
            loader: 'ts-loader',
            options: { happyPackMode: true }
          }
        ],
        include: ['src', 'test'].map(resolve)
      }
    ]
  }
}

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}
