import { parseHTMLtoAST } from './'
import { ASTNode } from './modules/ast-node'

describe('Template testing.', () => {
  it('Should generate correct ast.', () => {
    const template1 = `
      <div class="test-div" data-type="test">
        This is a testing element.
        <h2>Title is here.</h2>
        F@♂
        <br class="this-is-a-br"/>
        <input class="test-input" data-value="none" type="text"/>
        <hr/>
        F@♂
        <p class="my-name" id="lancer">
          <div class="name-value">LancerComet</div>
        </p>
      </div>
      <h1>Greeting, LancerComet!</h1>
    `

    const ast1 = parseHTMLtoAST(template1)
    chai.expect(ast1).to.be.a('array')
    chai.expect((<ASTNode> ast1[0]).children[0]).to.equals('This is a testing element.')
    chai.expect((<ASTNode> (<ASTNode> ast1[0]).children[1]).children[0]).to.equals('Title is here.')
    chai.expect((<ASTNode> (<ASTNode> ast1[0]).children[1]).tagName).to.equals('h2')
    chai.expect((<ASTNode> ast1[1]).tagName).to.equals('h1')
    chai.expect((<ASTNode> ast1[1]).children[0]).to.equals('Greeting, LancerComet!')

    const template2 = `
      <div>
        Hello, {{name}}!
        <br/>
        I'm glad to tell you a thing.
      </div>
    `

    const ast2 = parseHTMLtoAST(template2)
    chai.expect(ast2.length).to.equals(1)
  })
})
