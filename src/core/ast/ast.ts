/// <reference path="./ast.d.ts" />

import { ASTNode } from './node.base'
import { ASTNodeComponent } from './node.component'
import { ASTNodeElement } from './node.element'
import { ASTNodeText } from './node.text'

class AST {
  component: LC

  get element (): Element | Text | Comment {
    // Because only one root element is allowed when create a component,
    // You can get component's element by finding first node in comopnent's AST.
    return this.nodes.length
      ? this.nodes[0].element
      : null
  }

  nodes: ASTNodes

  addNode (node: ASTNodeTypes) {
    this.nodes.indexOf(node) < 0 &&
    this.nodes.push(node)
  }

  notify (keyName: string, newValue: any) {
    this.nodes.forEach(astNode => {
      astNode.update(keyName, newValue)
      if (astNode instanceof ASTNodeElement) {
        astNode.childAST.notify(keyName, newValue)
      }
    })
  }

  updateNodes (specificExpression?: string, newValue?: any) {
    this.nodes.forEach(node => node.update(specificExpression, newValue))
  }

  constructor (component?: LC) {
    this.nodes = []
    this.component = component
  }
}

export {
  AST
}
