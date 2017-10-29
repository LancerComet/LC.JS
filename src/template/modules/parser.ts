import { AST, ASTNode, ASTNodeElementAttribute } from './ast-node'
import { randomID } from '../../utils/random-id'

const TOKEN_MATCHING_REGEXP = /(<|>)/

/**
 * Convert html string to ASTNode.
 *
 * @param {string} htmlString
 * @returns {AST}
 */
function parser (htmlString: string): AST {
  if (!htmlString) {
    return []
  }

  const ast: AST = []

  // Generate elements and convert to AST.
  const $el = document.createElement('div')
  $el.innerHTML = htmlString

  if ($el.childElementCount > 1) {
    if (process.env.NODE_ENV === 'development') {
      console.error(`[${process.env.NAME}] Component only accepts one root element, please wrap your all nodes into a single element.`)
    }
    return []
  }

  const firstElement = $el.firstElementChild
  for (let i = 0, length = firstElement.childNodes.length; i < length; i++) {
    const currentNode = firstElement.childNodes[i]
    ast.push(parseSingleNode(currentNode))
  }

  return ast
}

export {
  parser
}

/**
 * Convert single node to ASTNode.
 *
 * @param {Node} node
 * @returns {(ASTNode | string)}
 */
function parseSingleNode (node: Node): ASTNode | string {
  let astNode = null

  switch (node.nodeType) {
    case 1:
      let children: Array<ASTNode | string> = []

      const childrenLength = node.childNodes.length
      let i = 0
      while (i < childrenLength){
        const childNode = node.childNodes[i]
        children.push(parseSingleNode(childNode))
        i++
      }

      // Attributes.
      const attributes = {}
      Array.prototype.slice.call(node.attributes).forEach(item => {
        attributes[item.name] = item.value
      })

      astNode = new ASTNode({
        _id: randomID(),
        tagName: (<HTMLElement> node).tagName,
        attributes,
        children
      })
      break

    case 3:
      astNode = (<Text> node).textContent
      break
  }

  return astNode
}
