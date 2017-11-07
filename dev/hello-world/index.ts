import { Component, LC } from '../../src'
import { Child } from './child'

@Component({
  components: {
    child: Child
  },
  template: require('./index.pug')()
})
class HelloWorld extends LC {
  img: string = require('../assets/logo.png')
  created () {
    // console.log('hello-world creatd', this)
  }
}

export {
  HelloWorld
}
