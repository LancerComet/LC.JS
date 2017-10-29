import { ASTNode } from './modules/ast'
import { parseHTMLtoAST } from './modules/parser'
import { isValueDirective, isEventDirective } from '../directives'

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
    // Component anchor or html element.
    case 1:
      // Component anchor.
      if (astNode.componentAnchor) {
        const compInstance = <LC> new astNode.ComponentConstructor()
        const mounter = document.createElement('div')
        compInstance.mount(mounter)
        element = mounter

      // HTML Element.
      } else {
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
      }

      // Create children.
      if (astNode.children.length) {
        for (let i = 0, length = astNode.children.length; i < length; i++) {
          const childAst = astNode.children[i]
          createElementByASTNode(childAst, <HTMLElement> element)
        }
      }

      break

    // TextNode.
    case 3:
      element = document.createTextNode(astNode.textContent)
      break
  }

  // Append to parent element if it presets.
  parentElement && parentElement.appendChild(element)

  return element
}

export {
  parseHTMLtoAST,
  createElementByASTNode
}
