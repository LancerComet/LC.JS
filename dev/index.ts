import { LC, Component, createDirective } from '../src'
import { MyComponent } from './my-component'
import { HelloWorld } from './hello-world'

createDirective({
  name: '@lancer',
  onInstall (directive) {
    const element = directive.element
    element.addEventListener('click', event => {
      console.log('wow')
    })
  }
})

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
      <input type="number" @focus="onFocus" @blur="onBlur" @model="time">
      <my-component></my-component>
    </div>
  `
})
class Root extends LC {
  appName: string = process.env.NAME
  time: number = 2017
  showTime () {
    alert(this.time)
  }
  add () {
    this.time = this.time + 1000
    console.log(this.time)
  }
  onFocus (time) {
    console.log('onFocus', time)
  }
  onBlur () {
    console.log('onBlur')
  }
}

console.time('createComponent')
const root = new Root()
root.mount('#lc-app')
console.timeEnd('createComponent')
console.log(root)

setInterval(() => {
  root.time++
}, 1000)
