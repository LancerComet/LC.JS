const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeJsPlugin = require('optimize-js-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')

const config = require('../config')
const env = process.env.NODE_ENV === 'testing'
  ? require('../config/envs/env.test.js')
  : config.build.env

const resolve = filepath => path.resolve(__dirname, '../' + filepath)
const srcFolders = ['dev', 'src', 'test'].map(resolve)

const webpackConfig = {
  entry: {
    lc: resolve('src/index.ts')
  },

  output: {
    path: config.build.assetsRoot,
    filename: '[name].dist.js',
    chunkFilename: '[name].dist.js',
    library: 'LC',
    libraryTarget: 'commonjs2'
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
          options: require('../babel.build.babelrc')
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
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader', options: { sourceMap: config.build.productionSourceMap, importLoaders: 1 } },
            'postcss-loader'
          ]
        })
      },
      {
        test: /\.styl$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader', options: { sourceMap: config.build.productionSourceMap, importLoaders: 1 } },
            'postcss-loader',
            { loader: 'stylus-loader', options: { sourceMap: config.build.productionSourceMap } }
          ]
        })
      },
    ]
  },

  devtool: config.build.productionSourceMap ? '#source-map' : false,

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
    }),

    new ExtractTextPlugin({
      filename: '[name].[contenthash].css'
    }),

    new OptimizeCSSPlugin({
      cssProcessor: require('cssnano'),
      cssProcessorOptions: {
        autoprefixer: false
      }
    })
  ]
}

if (config.build.productionGzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
