import { ASTNode } from './ast-node'
import { randomID } from '../../utils/random-id'

/**
 * Convert html string to ASTNode.
 *
 * @param {string} htmlString
 * @returns {ASTNode[]}
 */
function tokenizer (htmlString: string): ASTNode[] {
  if (!htmlString) {
    return []
  }

  const ast = []
  const tokens = htmlString
    .split(/(<|>)/)
    .filter(item => item !== '')

  // Array that stores tree-structor of current element and its ancestors.
  const scopeStack: ASTNode[] = []
  let lastParseElement: ASTNode = null

  while (tokens.length) {
    const currentToken = tokens.shift()

    switch (currentToken) {
      case '<':
        let htmlElementStr = tokens.shift()
        const _id = randomID()

        // Closing tag.
        if (htmlElementStr.indexOf('/') === 0) {
          scopeStack.pop()
          continue
        }

        // Get attributes and tag name
        let { attributes, tagName, isSelfClosed } = getElementAttribute(htmlElementStr)

        // Create new element.
        const newElement = new ASTNode({
          tagName,
          attributes,
          _id
        })

        // Find parent element.
        if (scopeStack.length) {
          const parentElement = scopeStack[scopeStack.length - 1]
          parentElement.children.push(newElement)
        } else {
          ast.push(newElement)
        }

        !isSelfClosed && scopeStack.push(newElement)
        lastParseElement = newElement
      continue

      case '>':
        // Do nothing here.
        continue

      // textContent.
      default:
        // Vaild textContent.
        // Push to children.
        const textContent = currentToken.trim()
        if (/^\S+/.test(textContent)) {
          const target = scopeStack[scopeStack.length - 1]
          target.children.push(textContent)
        }
        continue
    }
  }

  return ast
}

/**
 * Get attributes of html element string.
 *
 * @param {string} elementStr
 * @returns {IElementAttribute}
 */
function getElementAttribute (elementStr: string = ''): IElementAttribute {
  if (!elementStr) {
    return Object.create(null)
  }

  const words = elementStr.split(' ')
  let isSelfClosed = false

  // Check and deal-with self-clsoed.
  for (let i = 0, length = words.length; i < length; i++) {
    if (/\/$/.test(words[i])) {
      isSelfClosed = true
      words[i] = words[i].replace('/', '')
    }
  }

  const tagName = words.shift()
  const attributes = {}

  for (let i = 0, length = words.length; i < length; i++) {
    const item = words[i]
    const _words = item.split('=')
    const attrName = _words[0]
    const attrValue = _words[1].replace(/("|')/g, '')  // Remove " and ' in attribute value.
    attributes[attrName] = attrValue
  }

  return {
    tagName,
    attributes,
    isSelfClosed
  }
}

/**
 * Attribute info for an element.
 */
interface IElementAttribute {
  tagName: string
  attributes: TElementAttribute
  isSelfClosed: boolean
}

/**
 * Attribute type for IElementAttribute.
 */
type TElementAttribute = {[attribute: string]: string}

export {
  tokenizer,
  IElementAttribute,
  TElementAttribute
}
