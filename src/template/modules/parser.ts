import { ASTNode } from './ast'
import { randomID } from '../../utils/random-id'

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
 * Convert single HTML node to ASTNode.
 *
 * @param {Node} node
 * @returns {ASTNode}
 */
function parseSingleNode (node: Node): ASTNode {
  let astNode: ASTNode = null

  const _id = randomID()
  let attributes = {}
  const children = []
  const nodeType = node.nodeType
  let tagName = null
  let textContext = null

  switch (nodeType) {
    // Element.
    case 1:
      const childrenLength = node.childNodes.length
      let i = 0
      while (i < childrenLength){
        const childNode = node.childNodes[i]
        children.push(parseSingleNode(childNode))
        i++
      }

      // Get attributes info.
      Array.prototype.slice.call(node.attributes)
        .forEach(item => {
          attributes[item.name] = item.value
        })

      tagName = (<HTMLElement> node).tagName
      break

    // TextNode.
    case 3:
      textContext = node.textContent ||
        node.nodeValue ||
        ''
  }

  astNode = new ASTNode({
    _id,
    attributes,
    children,
    nodeType,
    tagName,
    textContent: nodeType === 3
      ? textContext
      : null
  })

  return astNode
}
