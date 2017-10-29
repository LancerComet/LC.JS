import { Component, LC } from '../src'

console.time()
@Component({
  template: `
    <div class="my-component lc-js">
      <h1 class="title">MyInfo</h1>
      <p :style="font-size: {{age}}px">Name: {{name}}, {{age}}</p>
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
})
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
}

const component = new MyComponent()
component.mount('#test-component')

console.timeEnd()
console.log(component)
