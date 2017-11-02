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
      <h1 :style="'color: ' + color">Hello, {{appName}}!</h1>
      <hello-world></hello-world>
      <div>
        <input type="text" @model="appName" place="Change your app name.">
      </div>
    </div>
  `
})
class AppRoot extends LC {
  appName: string = 'My App'
  color: string = '#2090e3'
}

const myApp = new AppRoot()
myApp.mount('#my-app')
```
