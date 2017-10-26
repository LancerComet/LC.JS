import { ASTNode, TTemplateAST } from './modules/ast-node'
import { tokenizer } from './modules/tokenizer'
import { internalDirectives } from '../config'

/**
 * Parse HTML to ASTNode[].
 *
 * @param {string} htmlString
 * @returns {TTemplateAST}
 */
function parseHTMLtoAST (htmlString: string): TTemplateAST {
  const ast = tokenizer(htmlString)
  return ast
}

/**
 * Create element by using ASTNode.
 *
 * @param {ASTNode | string} astNode
 * @param {Element} [parentElement]
 * @returns
 */
function createElementByASTNode (astNode: ASTNode | string, parentElement?: Element): HTMLElement | Text {
  let element: HTMLElement | Text = null

  // TextNode.
  if (typeof astNode === 'string') {
    element = document.createTextNode(astNode)
    if (parentElement) {
      parentElement.appendChild(element)
    }

  // Element.
  } else {
    element = document.createElement(astNode.tagName)

    // Set attributes.
    const attributes = Object.keys(astNode.attributes)
    for (let i = 0, length = attributes.length; i < length; i++) {
      const attrName = attributes[i]

      // Skip internal directives.
      if (internalDirectives.indexOf(attrName) > -1) {
        continue
      }

      const value = astNode.attributes[attrName]
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
  }

  return element
}

export {
  parseHTMLtoAST,
  createElementByASTNode
}
