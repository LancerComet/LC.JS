import { Component } from './'
import { LC } from '../core'

describe('Component testing.', () => {
  it('Should create a component successfully.', () => {
    @Component
    class MyInfo extends LC {
      name: string = 'LancerComet'
      age: number = 27
      isMarried: boolean = false
      address: string[] = ['NewYork', 'Beijing']
    }

    const myInfo = new MyInfo()

    chai.expect(myInfo.name).to.be.a('string')
    chai.expect(myInfo.age).to.be.a('number')
    chai.expect(myInfo.isMarried).to.be.a('boolean')
    chai.expect(myInfo.address).to.be.a('array')
  })
})
