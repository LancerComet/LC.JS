import { isDirective } from './'

describe('Directive testing.', () => {
  it('Should be a directive.', () => {
    chai.expect(isDirective(':my-name')).to.equals(true)
    chai.expect(isDirective('@my-name')).to.equals(true)
  })

  it('Shoud not be a directive.', () => {
    chai.expect(isDirective('on-click')).to.equals(false)
    chai.expect(isDirective('style')).to.equals(false)
  })
})
