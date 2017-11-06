/// <reference path="./node.text.d.ts" />

import { ASTNode } from './node.base'
import { NodeType } from '../config'
import { evaluateExpression, matchExpression, nextTick } from '../../utils'

/**
 * Class that represets a Text-type-ASTNode.
 *
 * @class ASTNodeText
 * @extends {ASTNode}
 */
class ASTNodeText extends ASTNode {
  expression: string
  nodeType: ASTNodeType = NodeType.textNode
  textContent: string

  private createElement () {
    const element = document.createTextNode(this.textContent)
    this.element = element
  }

  update (specificExpression?: string, newValue?: any) {
    const resultObj = super.preUpdate(specificExpression, newValue)
    if (!resultObj) { return }

    const { variables, values } = resultObj

    // TextNode is going to update textContent.
    const expressions = matchExpression(this.expression)

    // No expression, go return.
    if (!expressions) {
      return
    }

    const pureExpressions = expressions.map(getPureExpression)

    // If specific expression is given, check if "expressions" contains this one.
    let doUpdate = false
    if (specificExpression) {
      pureExpressions.some(item => {
        if (item.match(new RegExp(specificExpression))) {
          doUpdate = true
          return doUpdate
        }
      })
    } else {
      doUpdate = true
    }

    if (!doUpdate) {
      return
    }

    let newTextContent = this.expression

    expressions.forEach((exp, index) => {
      // If specific expression and vaule is given, override newValue to original value.
      if (exp.indexOf(specificExpression) > -1 && typeof newValue !== 'undefined') {
        const expIndex = variables.indexOf(specificExpression)
        if (expIndex > -1) {
          values[expIndex] = newValue
        }
      }

      // Replace mastache expression.
      const pureExpression = pureExpressions[index]
      newTextContent = newTextContent.replace(
        exp,
        evaluateExpression(variables, values, pureExpression)  // Evaluate new value.
      )
    })

    nextTick(() => {
      this.textContent = newTextContent
      this.element.textContent = newTextContent
    })
  }

  constructor (param: IASTNodeTextOption) {
    super(param)
    this.expression = param.expression || ''
    this.textContent = param.textContent || ''
    this.createElement()
  }
}

export {
  ASTNodeText
}

/**
 * Get pure expression by removing mastache.
 *
 * @param {string} expression
 * @returns {string}
 */
function getPureExpression (expression: string): string {
  return expression.replace(/{|}/g, '')
}
