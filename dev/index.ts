import { Component, LC } from '../src'

@Component
class MyComponent extends LC {
  // Models.
  name: string = 'LancerComet'
  age: number = 27
  isMarried: boolean = false
  address: string[] = ['NewYork', 'Beijing']
  sex: string = 'male'

  // Methods.
  showMyAge () {
    alert(this.age)
  }

  // Template.
  template: string = `
    <h1>Hello, {{name}}!</h1>
    <button @click="showMyAge">Show my age</button>
  `
}

const component = new MyComponent()
component.mount('#test-component')

console.log(component)
