import { Component } from '../src'

describe('Component testing.', () => {
  it('Should create a component successfully.', () => {
    const myInfo = new Component({
      models: {
        name: {
          type: 'string',
          default: 'LancerComet'
        },

        age: {
          type: 'number',
          default: 27
        },

        isMarried: {
          type: 'boolean',
          default: false
        },

        addresses: {
          type: 'array',
          default () {
            return ['Newyork', 'Beijing']
          }
        }
      }
    })

    chai.expect(myInfo['$models']).to.be.a('object')
  })
})
