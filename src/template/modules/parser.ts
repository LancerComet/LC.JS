import { ASTNode } from './ast'
import { randomID } from '../../utils/random-id'

/**
 * Convert html string to AST.
 *
 * @param {string} htmlString
 * @param {$ComponentUsage} [components]
 * @returns {AST}
 */
function parseHTMLtoAST (htmlString: string, components?: $ComponentUsage): AST {
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

  for (let i = 0, length = $el.childNodes.length; i < length; i++) {
    const currentNode = $el.childNodes[i]
    ast.push(
      parseSingleNode(currentNode, components)
    )
  }

  return ast
}

export {
  parseHTMLtoAST
}

/**
 * Convert single HTML node to ASTNode.
 *
 * @param {Node} node
 * @param {$ComponentUsage} [components]
 * @returns {ASTNode}
 */
function parseSingleNode (node: Node, components?: $ComponentUsage): ASTNode {
  let astNode: ASTNode = null

  let attributes = {}
  const children = []
  const nodeType = node.nodeType
  let tagName = null
  let textContext = null
  let componentAnchor = false
  let ComponentConstructor = null

  switch (nodeType) {
    // Element.
    case 1:
      const _tagName = (<HTMLElement> node).tagName.toLowerCase()

      // Check whether is an anchor for component.
      if (components) {
        const ComponentCtro = components[htmlTagToPascal(_tagName)]
        if (ComponentCtro) {
          // This is a component anchor.
          componentAnchor = true
          ComponentConstructor = ComponentCtro
        }
      }

      const childrenLength = node.childNodes.length
      let i = 0
      while (i < childrenLength){
        const childNode = node.childNodes[i]
        children.push(parseSingleNode(childNode, components))
        i++
      }

      // Get attributes info.
      Array.prototype.slice.call(node.attributes)
        .forEach(item => {
          attributes[item.name] = item.value
        })

      tagName = _tagName
      break

    // TextNode.
    case 3:
      textContext = node.textContent || node.nodeValue || ''
      break
  }

  astNode = new ASTNode({
    id: randomID(),
    attributes,
    children,
    componentAnchor,
    ComponentConstructor,
    nodeType,
    tagName,
    textContent: nodeType === 3
      ? textContext
      : null
  })

  return astNode
}

function htmlTagToPascal (tagName: string): string {
  const matching = tagName.match(/-\w/)
  if (matching) {
    matching.forEach(item => {
      tagName = tagName.replace(item, item.replace('-', '').toUpperCase())
    })
  }
  return tagName.replace(tagName[0], tagName[0].toUpperCase())
}
