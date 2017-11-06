import { getAllProperties } from './'

describe('Utils testing.', () => {
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

  it('Should know whether a variable is an array.')
})
