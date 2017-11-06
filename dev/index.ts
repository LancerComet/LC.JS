import { LC, Component } from '../src'
import { MyComponent } from './my-component'
import { HelloWorld } from './hello-world'

console.time('createComponent')

@Component({
  components: {
    'hello-world': HelloWorld,
    'my-component': MyComponent
  },

  template: `
    <div class="lc-app" data-title="wow">
      <hello-world :app-name="appName"></hello-world>
      <h1 class="title">{{appName}} demo page.</h1>
      <div>{{appName}} is a light weight MVVM UI framework that written in TypeScript.</div>
      <div>Time: {{time}}, double time: {{time * 2}}</div>
      <button @click="toggleComponent">Toggle My Component</button>
      <button @click="add">Add 1000</button>
      <input @focus="onFocus" @blur="onBlur" @model.number="time">
      <input @model="appName">
      <my-component lc-if="showMyComponent"></my-component>
    </div>
  `
})
class Root extends LC {
  appName: string = process.env.NAME
  time: number = 2017
  showMyComponent: boolean = false
  toggleComponent () {
    this.showMyComponent = !this.showMyComponent
  }
  add () {
    this.time = this.time + 1000
  }
  onFocus (time) {
    console.log('onFocus', time)
  }
  onBlur () {
    console.log(this.$components)
  }
  mounted () {
    console.timeEnd('createComponent')
    console.log(this)
  }
}

const root = new Root()
root.$mount('#lc-app')

setInterval(() => {
  root.time++
}, 1000)
