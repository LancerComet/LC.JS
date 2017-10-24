/*
 * Router proxy setup.
 */
'use strict'

// Proxy target url.
const PROXY_TARGET = 'http://some-site.com'

class RouterConfig {
  constructor (url) {
    this.target = PROXY_TARGET + url
    this.changeOrigin = true
    this.pathRewrite = {}
    this.onProxyReq = function (proxyRes, req, res) {}
    this.onProxyRes = function (proxyRes, req, res) {}
  }
}

const config = {}

// Same url.
// Request will be transferred to "PROXY_TARGRT/url-needs-to-be-on-proxy".
const proxyURLS = [
  '/url-needs-to-be-on-proxy'
]

// Different url.
// "/url-needs-to-be-on-proxy" will be transferred to "PROXY_TARGET/will-be-actually-sent-to-here".
const specialRoles = [
  { origin: '/url-needs-to-be-on-proxy', target: '/will-be-actually-sent-to-here' }
]

proxyURLS.forEach(url => {
  config[url] = new RouterConfig(url)
})

specialRoles.forEach(item => {
  config[item.origin] = new RouterConfig(item.target)
})

module.exports = config
