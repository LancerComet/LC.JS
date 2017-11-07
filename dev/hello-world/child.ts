import { Component, LC } from '../../src'

@Component({
  template: require('./child.pug')()
})
class Child extends LC {
  mounted () {
    // console.log(this)
  }
}

export {
  Child
}
