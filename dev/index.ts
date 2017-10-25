import { Component, LC } from '../src'

console.time()
@Component
class MyComponent extends LC {
  name: string = 'LancerComet'
  age: number = 27
  isMarried: boolean = false
  address: string[] = ['NewYork', 'Beijing']
  sex: string = 'male'
}

const a = new MyComponent()
console.timeEnd()
a.mount('#test-component')
