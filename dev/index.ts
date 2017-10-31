import { LC, Component } from '../src'
import { MyComponent } from './my-component'

@Component({
  components: {
    MyComponent
  },

  template: `
    <div class="lc-app">
      <h1 class="title">{{appName}} demo page.</h1>
      <div :style="font-size: {{time}}px">{{appName}} is a light weight MVVM UI framework that written in TypeScript.</div>
      <div>Time: {{time}}, double time: {{time * 2}}</div>
      <div>This is: {{$aa}}</div>
      <my-component></my-component>
    </div>
  `
})
class Root extends LC {
  appName: string = process.env.NAME
  time: number = 12
  $aa: string = '$name'
}

console.time('createComponent')
const root = new Root()
root.mount('#lc-app')
console.timeEnd('createComponent')
console.log(root)

setInterval(() => {
  root.time += 1
}, 1000)
