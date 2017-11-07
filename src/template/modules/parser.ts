import { AST, ASTNodeComponent, ASTNodeElement, ASTNodeText } from '../../core'
import { NodeType } from '../../core/config'
import { isDirective, isValueDirective, getDecorators } from '../../directives'

/**
 * Convert html string to AST.
 *
 * @returns {AST}
 */
function parseHTMLtoAST (htmlString: string): AST
function parseHTMLtoAST (component: LC): AST
function parseHTMLtoAST (param: string | LC): AST {
  let htmlString: string = ''
  let component: LC = null

  if (typeof param === 'string') {
    htmlString = param
  } else if (typeof param === 'object') {
    component = param
    htmlString = component.$template
  } else {
    return
  }

  if (!htmlString) {
    return null
  }

  // Create AST.
  const ast = new AST(component)

  // Assign AST to all of component's models.
  if (component) {
    Object.keys(component.$models).forEach(keyName => {
      const $model = component.$models[keyName]
      $model.$ast = ast
    })
  }

  // Generate elements and convert to AST.
  const $el = document.createElement('div')
  $el.innerHTML = htmlString

  if ($el.childElementCount > 1) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(`[${process.env.NAME}] Component only accepts one root element, please wrap your all nodes into a single element.`)
    }
    return null
  }

  for (let i = 0, length = $el.childNodes.length; i < length; i++) {
    const currentNode = $el.childNodes[i]
    ast.addNode(
      elementToASTNode(ast, currentNode, component)
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
 * @param {AST} ast
 * @param {Node} node
 * @param {LC} component
 * @param {ASTNodeTypes} [parentNode]
 * @returns {ASTNode}
 */
function elementToASTNode (ast: AST, node: Node, component: LC, parentNode?: ASTNodeTypes): ASTNodeTypes {
  const $components = component.$components

  let astNode: ASTNodeTypes = null
  const attributes: ASTNodeElementAttribute = {}
  const childAST: AST = new AST(component)
  let nodeType: number = node.nodeType
  let tagName: string = ''

  switch (nodeType) {
    // Element.
    case NodeType.element:
      const props: {} = {}
      const tagNameInLowerCase = (<HTMLElement> node).tagName.toLowerCase()
      const isComponentAnchor = $components && $components[tagNameInLowerCase]
      tagName = tagNameInLowerCase

      // Get attributes info.
      Array.prototype.slice.call(node.attributes).forEach(item => {
        let attrName = item.name
        const attrValue = item.value

        // Save this attribute as a prop.
        if (isComponentAnchor && isValueDirective(attrName)) {
          props[attrName] = attrValue

        // Save as an attribute.
        } else {
          let decorators = []

          // If this is a directive, get attribute name which is without decorators
          // and decorators.
          if (isDirective(attrName)) {
            attrName = (attrName.match(/^\W\w+\b/) || [])[0] || attrName
            decorators = getDecorators(attrName)
          }

          attributes[attrName] = {
            value: attrValue,
            decorators
          }
        }
      })

      // This is a component anchor.
      if (isComponentAnchor) {
        nodeType = NodeType.comment  // Over NodeType to NODE_TYPE.comment.
        const ComponentCtor = $components[tagNameInLowerCase].Constructor

        astNode = new ASTNodeComponent({
          ast,
          attributes,
          ComponentCtor,
          componentInstance: null,
          parentNode,
          props,
          tagName
        })

      // Normal element.
      } else {
        astNode = new ASTNodeElement({
          ast,
          attributes,
          childAST,
          parentNode,
          tagName
        })
      }

      break

    // TextNode.
    case NodeType.textNode:
      const nodeContent =  node.textContent || node.nodeValue || ''
      astNode = new ASTNodeText({
        ast,
        expression: nodeContent,
        parentNode,
        tagName,
        textContent: nodeContent
      })
      break
  }

  // Deal with children.
  const childrenLength = node.childNodes.length
  if (nodeType === NodeType.element && childrenLength) {
    let i = 0
    while (i < childrenLength){
      const childNode = node.childNodes[i]
      childAST.addNode(elementToASTNode(childAST, childNode, component, astNode))
      i++
    }
  }

  return astNode
}
