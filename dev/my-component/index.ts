import { Component, LC } from '../../src'

@Component({
  template: require('./index.pug')()
})
class MyComponent extends LC {
  // Models.
  name: string = 'LancerComet'
  age: number = 27
  isMarried: boolean = false
  address: string[] = ['NewYork', 'Beijing']
  sex: string = 'male'

  created () {
    console.log('MyComponent created')
  }

  mounted () {
    console.log('MyComponent mounted')
  }
}

export {
  MyComponent
}
