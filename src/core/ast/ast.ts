/// <reference path="./ast.d.ts" />

import { ASTNode, ASTNodeComponent, ASTNodeElement, ASTNodeText } from './ast-node'

class AST {
  component: LC

  get element (): Element | Text | Comment {
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
