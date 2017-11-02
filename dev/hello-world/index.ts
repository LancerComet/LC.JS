import { Component, LC } from '../../src'

@Component({
  template: require('./index.pug')()
})
class HelloWorld extends LC {
  img: string = require('../assets/logo.png')
}

export {
  HelloWorld
}
