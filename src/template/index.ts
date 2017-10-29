import { ASTNode } from './modules/ast'
import { parser } from './modules/parser'
import { isValueDirective, isEventDirective } from '../directives'

/**
 * Parse HTML to ASTNode[].
 *
 * @param {string} htmlString
 * @returns {AST}
 */
function parseHTMLtoAST (htmlString: string): AST {
  return parser(htmlString)
}

/**
 * Create element by using ASTNode.
 *
 * @param {ASTNode} astNode
 * @param {Element} [parentElement]
 * @returns
 */
function createElementByASTNode (astNode: ASTNode, parentElement?: Element): HTMLElement | Text {
  let element: HTMLElement | Text = null

  switch (astNode.nodeType) {
    // Element.
    case 1:
      element = document.createElement(astNode.tagName)

      // Set attributes.
      const attributes = Object.keys(astNode.attributes)
      for (let i = 0, length = attributes.length; i < length; i++) {
        let attrName = attributes[i]
        const value = astNode.attributes[attrName]

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

      parentElement && parentElement.appendChild(element)

      // Create ASTNode for children.
      if (astNode.children.length) {
        for (let i = 0, length = astNode.children.length; i < length; i++) {
          const childAst = astNode.children[i]
          createElementByASTNode(childAst, element)
        }
      }
      break

    // TextNode.
    case 3:
      element = document.createTextNode(astNode.textContent)
      if (parentElement) {
        parentElement.appendChild(element)
      }
      break
  }

  return element
}

export {
  parseHTMLtoAST,
  createElementByASTNode
}
