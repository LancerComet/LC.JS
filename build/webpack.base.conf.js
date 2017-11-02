const path = require('path')
const resolver = filepath => path.resolve(__dirname, '../' + filepath)

const isProd = process.env.NODE_ENV === 'production'
const srcFolders = ['dev', 'src', 'test'].map(resolver)

const rules = [
  {
    test: /\.(png|jpe?g|gif)(\?.*)?$/,
    loader: 'url-loader',
    query: {
      limit: 5120,
      name: '[name].[ext]'
    }
  },
  {
    test: /\.pug$/,
    loader: 'pug-loader'
  },
  {
    test: /\.js$/,
    use: {
      loader: 'babel-loader',
      options: isProd
        ? require('../babel.build.json')
        : require('../babel.dev.json')
    },
    include: srcFolders
  },
  {
    test: /\.tsx?$/,
    use: [
      {
        loader: 'babel-loader',
        options: isProd
          ? require('../babel.build.json')
          : require('../babel.dev.json')
      },
      {
        loader: 'ts-loader',
      }
    ],
    include: srcFolders
  }
]

const resolve = {
  extensions: ['.js', '.ts', '.json'],
  modules: [
    resolver('src'),
    resolver('node_modules')
  ]
}

module.exports = {
  rules,
  resolve
}
