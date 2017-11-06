/// <reference path="./ast.d.ts" />

import { ASTNode } from './ast-node'

class AST {
  get element (): Element | Text | Comment {
    return this.nodes.length
      ? this.nodes[0].element
      : null
  }

  nodes: ASTNodes

  addNode (node: ASTNode) {
    this.nodes.indexOf(node) < 0 &&
    this.nodes.push(node)
  }

  notify (component: LC, keyName: string, newValue: any) {
    this.nodes.forEach(astNode => {
      astNode.update(component, keyName, newValue)
      astNode.childAST.notify(component, keyName, newValue)
    })
  }

  updateNodes (component: LC, specificExpression?: string, newValue?: any) {
    this.nodes.forEach(node => node.update(component, specificExpression, newValue))
  }

  constructor (nodes?: ASTNodes) {
    this.nodes = nodes || []
  }
}

export {
  AST
}
