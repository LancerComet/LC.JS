import { MyComponent } from './my-component'

console.time('createComponent')
const component = new MyComponent()
component.mount('#test-component')
console.timeEnd('createComponent')
