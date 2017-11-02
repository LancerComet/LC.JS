module.exports = {
  configuration: {
    rules: require('./tslint.rules')
  },
  emitErrors: true,
  failOnHint: process.env.NODE_ENV === 'production',
  typeCheck: true
}
