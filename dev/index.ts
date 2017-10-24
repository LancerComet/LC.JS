import { Component } from '../src'

console.time('Create component class')
@Component
class MyComponent {
  name: string = 'LancerComet'
  age: number = 27
  isMarried: boolean = false
  address: string[] = ['NewYork', 'Beijing']
  sex: string = 'male'
}
console.timeEnd('Create component class')

console.time()
const a = new MyComponent()
console.timeEnd()

console.log(a)
