import { LC, Component } from '../src'
import { MyComponent } from './my-component'

@Component({
  components: {
    MyComponent
  }
})
class Root extends LC {
  appName: string = process.env.NAME
}

console.time('createComponent')
const root = new Root()
root.mount('#lc-app')
console.timeEnd('createComponent')
console.log(root)
