import { LC, Component } from '../src'
import { MyComponent } from './my-component'
import { HelloWorld } from './hello-world'

@Component({
  components: {
    'hello-world': HelloWorld,
    'my-component': MyComponent
  },

  template: `
    <div class="lc-app">
      <hello-world></hello-world>
      <h1 class="title">{{appName}} demo page.</h1>
      <div>{{appName}} is a light weight MVVM UI framework that written in TypeScript.</div>
      <div>Time: {{time}}, double time: {{time * 2}}</div>
      <button @click="showTime">Show Time</button>
      <button @click="add">Add 1000</button>
      <my-component></my-component>
    </div>
  `
})
class Root extends LC {
  appName: string = process.env.NAME
  time: number = 12
  showTime () {
    console.log(this.time)
  }
  add () {
    this.time = this.time + 1000
    console.log(this.time)
  }
}

console.time('createComponent')
const root = new Root()
root.mount('#lc-app')
console.timeEnd('createComponent')
console.log(root)

setInterval(() => {
  root.time += 1
}, 1000)
