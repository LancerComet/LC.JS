import { parseHTMLtoAST } from './'

describe('Template testing.', () => {
  it('Should generate correct AST.', () => {
    const template = `
      <div class="test-div" data-name="wow">
        This is a testing element.
        <h2 data-title="titlenpm">Title is here.</h2>
        F@♂
        <br class="this-is-a-br"/>
        <input class="test-input" type="text"/>
        <hr/>
        F@♂
        <p class="my-name" id="lancer">
          <div class="name-value">LancerComet</div>
        </p>
      </div>
    `

    const ast = parseHTMLtoAST(template, null)
    chai.expect(ast).to.be.a('array')

    const divNode = ast[1]
    chai.expect(divNode.tagName).to.equal('div')
    chai.expect(divNode.children[0].textContent).contain('This is a testing element.')

    const h2Node = divNode.children[1]
    chai.expect(h2Node.tagName).to.equals('h2')

    const brNode = divNode.children[3]
    chai.expect(brNode.attributes['class'].value).to.equal('this-is-a-br')
  })
})
