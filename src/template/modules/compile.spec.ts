import { transformPropNameToPascal } from './compile'

describe('Compile module.', () => {
  it('Should transform prop name to pascal name correctly.', () => {
    chai.expect(transformPropNameToPascal(':app-name-for-this')).to.equals('appNameForThis')
  })
})
