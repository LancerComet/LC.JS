import { evaluateExpression } from './util.evalutation'
import { getAllProperties } from './'
import { isArray } from './util.is-array'
import { isFunction } from './util.is-func'

describe('Utils testing.', () => {
  it('Should make evalutation correctly.', () => {
    chai.expect(
      evaluateExpression(['name', 'age'], ['wch', 100], '"I\'m " + name + " and I\'m " + age + "-year old."')
    ).to.equals('I\'m wch and I\'m 100-year old.')

    chai.expect(evaluateExpression(['name'], ['wch'], 'age')).to.equals('')
  })

  it('Should get all properties.', () => {
    chai.expect(getAllProperties({})).to
      .include('__proto__').and
      .include('toString')

    class A {
      a () {}
    }

    class B extends A {
      b () {}
    }

    chai.expect(getAllProperties(new B())).to.contain('a').and.contain('b')
  })

  it('Should know whether some variable is an array.', () => {
    chai.expect(isArray([])).to.equals(true)
    chai.expect(isArray({})).to.equals(false)
    chai.expect(isArray(10)).to.equals(false)
    chai.expect(isArray('')).to.equals(false)
    chai.expect(isArray(() => {})).to.equals(false)
  })

  it('Should konw whether some variable is a function.', () => {
    chai.expect(isFunction(() => {})).to.equals(true)
    chai.expect(isFunction(1)).to.equals(false)
    chai.expect(isFunction('')).to.equals(false)
    chai.expect(isFunction({})).to.equals(false)
    chai.expect(isFunction([])).to.equals(false)
  })
})
