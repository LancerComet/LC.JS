import { parseHTMLtoAST } from './'
import { AST, ASTNodeElement, ASTNodeText } from '../core'

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

    const ast = parseHTMLtoAST(template)
    chai.expect(ast instanceof AST).to.equal(true)

    const divNode = ast.nodes[1] as ASTNodeElement
    chai.expect(divNode.tagName).to.equal('div')
    chai.expect((divNode.childAST.nodes[0] as ASTNodeText).textContent).contain('This is a testing element.')

    const h2Node = divNode.childAST.nodes[1] as ASTNodeElement
    chai.expect(h2Node.tagName).to.equals('h2')

    const brNode = divNode.childAST.nodes[3]
    chai.expect(brNode.attributes['class'].value).to.equal('this-is-a-br')
  })
})
