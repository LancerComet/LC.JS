import { Component } from '../src'

// Create a component.
console.time()
const myInfo = new Component({
  models: {
    name: {
      type: String,
      default: 'LancerComet'
    },

    age: {
      type: Number,
      default: 27
    },

    isMarried: {
      type: Boolean,
      default: false
    },

    addresses: {
      type: Array,
      default () {
        return ['Newyork', 'Beijing']
      }
    }
  }
})
console.timeEnd()
console.log(myInfo)
