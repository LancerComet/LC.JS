import { ASTNode } from './ast'
import { NODE_TYPE } from '../../core/config'

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
    if (process.env.NODE_ENV !== 'production') {
      console.error(`[${process.env.NAME}] Component only accepts one root element, please wrap your all nodes into a single element.`)
    }
    return []
  }

  for (let i = 0, length = $el.childNodes.length; i < length; i++) {
    const currentNode = $el.childNodes[i]
    ast.push(
      elementToASTNode(currentNode, components)
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
 * @param {$ComponentUsage} [$components]
 * @param {ASTNode} [parentNode]
 * @returns {ASTNode}
 */
function elementToASTNode (node: Node, $components?: $ComponentUsage, parentNode?: ASTNode): ASTNode {
  let astNode: ASTNode = null

  let attributes: ASTNodeElementAttribute = {}
  const children: AST = []
  let expression: string = ''
  let isComponentAnchor: boolean = false
  let nodeType: number = node.nodeType
  let tagName: string = ''
  let textContent: string = null
  let ComponentCtor = null

  switch (nodeType) {
    // Element.
    case NODE_TYPE.element:
      const tagNameInLowerCase = (<HTMLElement> node).tagName.toLowerCase()

      // If component usage is given then
      // check if this node is an anchor for component.
      if ($components) {
        // This is a component anchor.
        if ($components[tagNameInLowerCase]) {
          isComponentAnchor = true
          ComponentCtor = $components[tagNameInLowerCase].Constructor
          nodeType = NODE_TYPE.comment  // Over NodeType to NODE_TYPE.comment.
        }
      }

      // Get attributes info.
      Array.prototype.slice.call(node.attributes)
        .forEach(item => {
          attributes[item.name] = item.value
          expression += item.value  // Save all attribute as expressions for further usage in astNode.setSingleExpressionValue.
        })

      tagName = tagNameInLowerCase
      break

    // TextNode.
    case NODE_TYPE.textNode:
      expression = textContent = node.textContent || node.nodeValue || ''
      break
  }

  astNode = new ASTNode({
    attributes,
    children,
    ComponentCtor,
    expression,
    isComponentAnchor,
    nodeType,
    parentNode,
    tagName,
    textContent
  })

  // Deal with children.
  const childrenLength = node.childNodes.length
  if (nodeType === NODE_TYPE.element && childrenLength) {
    let i = 0
    while (i < childrenLength){
      const childNode = node.childNodes[i]
      children.push(elementToASTNode(childNode, $components, astNode))
      i++
    }
  }

  return astNode
}
