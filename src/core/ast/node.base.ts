/// <reference path="./node.base.d.ts" />

import { DirectiveConfig, NodeType } from '../config'
import { evaluateExpression, randomID } from '../../utils'

class ASTNode {
  $if: boolean
  ast: AST
  id: string
  attributes: ASTNodeElementAttribute
  directives: Directive[]
  element: Element | Text | Comment
  nodeType: ASTNodeType
  parentNode: ASTNode
  tagName: string

  /**
   * Find ancesstor for this node.
   *
   * @returns {ASTNode}
   * @memberof ASTNode
   */
  findAncesstor (): ASTNode {
    return this.parentNode
      ? this.parentNode.findAncesstor()
      : this
  }

  /**
   * Pre-update funciton.
   * If a "true" is given, go continue to update.
   *
   * @param {string} [specificExpression] The expression that is given specifically.
   * @param {*} [newValue] New value for specific expression.
   * @returns {{component: LC, variables: string[], values: any[]}}  Necessary data for further updates.
   * @memberof ASTNode
   */
  preUpdate (specificExpression?: string, newValue?: any): {
    component: LC, variables: string[], values: any[]
  } {
    const component: LC = this.ast.component
    const variables = Object.keys(component)
    const values = variables.map(item => component[item])

    // Deal with internal directives first.
    // lc-if.
    const ifFlag = this.attributes[DirectiveConfig.flags.internal + 'if']

    if (ifFlag) {
      const controlExpValue = !!evaluateExpression(variables, values, ifFlag.value)  // true or false.
      if (!controlExpValue) {
        this.$if = false

        // If this node isn't Component Node, don't go update further.
        if (this.nodeType !== NodeType.comment) {
          return null
        }
      } else if (controlExpValue && !this.$if) {
        this.$if = true
      }
    }

    return {
      component, variables, values
    }
  }

  /**
   * Update this ASTNode by given expression and new value.
   * Then the element of this ASTNode will be updated.
   * If a specific expression is given, update the element if it contains this expression.
   *
   * @param {string} [specificExpression] The expression that is given specifically.
   * @param {*} [newValue] New value for specific expression.
   * @return {boolean} Tell child class if go continue.
   * @memberof ASTNode
   */
  update (specificExpression?: string, newValue?: any) {}

  /**
   * Creates an instance of ASTNode.
   *
   * @param {IASTNodeOption} param
   * @memberof ASTNode
   */
  constructor (param: IASTNodeOption) {
    // Param checking only in lib development.
    if (process.env.LIB_IN_DEV) {
      if (!param.ast) {
        console.error(`[${process.env.NAME}] No AST is given when creating an ASTNode.`, param)
        return
      }
    }

    this.$if = true
    this.id = randomID()
    this.ast = param.ast
    this.attributes = param.attributes || {}
    this.directives = []
    this.parentNode = param.parentNode
    this.tagName = param.tagName || ''
  }
}

export {
  ASTNode
}
