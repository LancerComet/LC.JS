import { Component } from '../src'

describe('Component testing.', () => {
  it('Should create a component successfully.', () => {
    // const myInfo = new Component({
    //   models: {
    //     name: {
    //       type: String,
    //       default: 'LancerComet'
    //     },

    //     age: {
    //       type: Number,
    //       default: 27
    //     },

    //     isMarried: {
    //       type: Boolean,
    //       default: false
    //     },

    //     addresses: {
    //       type: Array,
    //       default () {
    //         return ['Newyork', 'Beijing']
    //       }
    //     }
    //   }
    // })

    @Component
    class MyInfo {
    }

    const myInfo = new MyInfo()

    chai.expect(myInfo['name']).to.be.a('string')
    chai.expect(myInfo['age']).to.be.a('number')
    chai.expect(myInfo['isMarried']).to.be.a('boolean')
    chai.expect(myInfo['addresses']).to.be.a('array')
  })
})
