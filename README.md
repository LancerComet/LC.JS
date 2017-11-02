# LC.JS

A simple, flex and strict UI library that in TypeScript.

Still under heavy construction.

## Feature.

 - Components are first-class members.

 - No complex design, friendly to anyone.

 - For TypeScripters.

 - More is coming.

## Quick start

```typescript
import { LC, Component } from 'lc.js'
import { HelloWorld } from './hello-world'

@Component({
  components: {
    'hello-world': HelloWorld
  },

  template: `
    <div class="demo-app">
      <h1 :style="'color: ' + color">Hello, {{appName || '--'}}!</h1>
      <small>Version: {{version}}</small>
      <hello-world :app-name="appName"></hello-world>
      <div>
        <input @model="appName" place="Change your app name.">
        <input @model.number="version" @focus="onFocus">
        <button @click="showAppName">Show AppName</button>
      </div>
    </div>
  `
})
class AppRoot extends LC {
  appName: string = 'My App'
  color: string = '#2090e3'
  version: number = 10
  
  onFocus () {
    this.version = 0
  }
  
  showAppName () {
    alert(this.appName)
  }
}

const myApp = new AppRoot()
myApp.mount('#my-app')
```
