/// <reference path="./ast.d.ts" />

import { isValueDirective, isEventDirective, isDirective } from '../../directives'
import { NODE_TYPE } from '../../core/config'
import { nextTick } from '../../utils/next-tick'

/**
 * AST Node.
 *
 * @class ASTNode
 */
class ASTNode {
  id: string
  attributes: ASTNodeElementAttribute
  children: AST
  element: Element | Text | Comment
  expression: string
  isComponentAnchor: boolean
  nodeType: ASTNodeType
  tagName: string
  textContent: string

  /**
   * Create HTML element.
   *
   * @memberof ASTNode
   */
  createElement () {
    let element: Element | Text | Comment = null

    switch (this.nodeType) {
      // Component anchor or html element.
      case NODE_TYPE.element:
        element = document.createElement(
          this.isComponentAnchor ? 'div' : this.tagName
        )

        // Set attributes.
        const attributes = Object.keys(this.attributes)
        for (let i = 0, length = attributes.length; i < length; i++) {
          let attrName = attributes[i]
          const value = this.attributes[attrName]

          // Value directive.
          if (isValueDirective(attrName)) {
            attrName = attrName.replace(':', '')
          }

          // TODO: deal with function.
          if (isEventDirective(attrName)) {
            continue
          }

          element.setAttribute(attrName, value)
        }

        break

      // TextNode.
      case NODE_TYPE.textNode:
        element = document.createTextNode(this.textContent)
        break

      // Comment.
      // This might be a component anchor.
      case NODE_TYPE.comment:
        element = document.createComment('')
        break
    }

    this.element = element
  }

  /**
   * Set single expression value.
   *
   * @param {$ComponentModels} $models
   * @param {string} [expressionName]
   * @param {*} [newValue]
   * @memberof ASTNode
   */
  setSingleExpressionValue ($models: $ComponentModels, expressionName?: string, newValue?: any) {
    const expressions = matchExpression(this.expression)
    if (!expressions) {
      return
    }

    // Check whether "expressionName" is in "expressions" when it is given.
    // If there is no "expressionName", just return.
    if (
      typeof expressionName !== 'undefined' &&
      typeof newValue !== 'undefined'
    ) {
      // Check whether this ASTNodes' expression has "expressionName"
      const expNameMatching = new RegExp(expressionName, 'g')
      let containTargetExp = false
      for (let i = 0, length = expressions.length; i < length; i++) {
        if (
          expNameMatching.test(getPureExpression(expressions[i]))
        ) {
          containTargetExp = true
          break
        }
      }

      if (!containTargetExp) {
        return
      }
    }

    const variables = Object.keys($models)
    const values = variables.map(item => $models[item].value)

    switch (this.nodeType) {
      case NODE_TYPE.element:
        // Replace attribute.
        Object.keys(this.attributes).forEach(attrName => {
          if (!isDirective(attrName)) {
            return
          }

          // Extract expression from attribute value.
          const attrValue = this.attributes[attrName]
          const expInThisAttrValue = matchExpression(attrValue)

          if (!expInThisAttrValue) { return }

          expInThisAttrValue.forEach(exp => {
            const result = evaluateExpression(
              [expressionName], [newValue], getPureExpression(exp)
            )

            nextTick(() => {
              this.attributes[attrName] = attrValue.replace(exp, result)
            })
          })
        })

        break

      case NODE_TYPE.textNode:
        let newTextContent = this.expression

        expressions.forEach(exp => {
          // Replace mastache expression.
          newTextContent = newTextContent.replace(
            new RegExp(normalizeOperators(exp), 'g'),
            evaluateExpression(variables, values, getPureExpression(exp))
          )
        })

        nextTick(() => {
          this.textContent = newTextContent
          this.element.textContent = newTextContent
        })

        break
    }
  }

  /**
   * Set all expressions' value.
   *
   * @param {$ComponentModels} $models
   * @memberof ASTNode
   */
  updateElement ($models: $ComponentModels) {
    this.setSingleExpressionValue($models)

    // Update children too.
    this.children.forEach(child => child.updateElement($models))
  }

  constructor (params: IASTNodeOption) {
    this.id = params.id
    this.attributes = params.attributes || {}
    this.children = params.children || []
    this.expression = params.expression.trim() || ''
    this.isComponentAnchor = !!params.isComponentAnchor
    this.nodeType = params.nodeType || NODE_TYPE.element

    switch (params.nodeType) {
      case NODE_TYPE.textNode:
        this.textContent = params.textContent || ''
        break

      case NODE_TYPE.element:
        this.tagName = params.tagName
        break
    }

    this.createElement()
  }
}

export {
  ASTNode
}

/**
 * Evaluate expression result.
 *
 * @param {string[]} variableName
 * @param {any[]} variableValue
 * @param {string} expression
 * @returns
 */
function evaluateExpression (variableName: string[], variableValue: any[], expression: string) {
  const evalFunc = Function.apply(
    null,
    variableName.concat('return ' + expression)
  )
  const result = evalFunc.apply(null, variableValue)
  return result
}

/**
 * Match expression from any html string.
 *
 * @param {string} string
 * @returns
 */
function matchExpression (string: string) {
  return string.match(/{{(\w|\d)+}}|{.+}/g)
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

/**
 * Normalize operators for regexp.
 *
 * @param {string} regExpStr
 * @returns {string}
 * @example
 *  {{a * b}} => {{a \* b}}
 */
function normalizeOperators (regExpStr: string) {
  (regExpStr.match(/\+|\*/g) || []).forEach(item => {
    regExpStr = regExpStr.replace(item, '\\' + item)
  })

  return regExpStr
}
