import { Component, LC } from '../src'

console.time()
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
    <div class="my-component lc-js">
      <h1>MyInfo</h1>
      <p>Name: {{name}}, {{age}}</p>
      <p>Age: {{age}}</p>
      <p>
        Address:
        <br/>
        I'm live in
        <span style="color: red">{{address[0] + ', ' + address[1]}}</span>.
      </p>
      <button @click="showMyAge">Show my age</button>
    </div>
  `
}

const component = new MyComponent()
component.mount('#test-component')
console.timeEnd()
