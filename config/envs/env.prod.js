const merge = require('webpack-merge')
const baseEnv = require('./env.base')

module.exports = merge(baseEnv, {
  NODE_ENV: '"production"'
})
