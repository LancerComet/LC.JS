/**
 * AST Node.
 *
 * @class ASTNode
 */
class ASTNode {
  _id: string
  attributes: ASTNodeElementAttribute
  children: AST
  tagName: string

  constructor (params: IASTNodeOption) {
    this._id = params._id
    this.attributes = params.attributes || {}
    this.children = params.children || []
    this.tagName = params.tagName
  }
}

/**
 * AST Node constructor param.
 *
 * @interface IASTNodeOption
 */
interface IASTNodeOption {
  _id: string
  attributes?: ASTNodeElementAttribute
  children?: AST
  tagName: string
}

/**
 * Attribute .
 */
type ASTNodeElementAttribute = {[attribute: string]: string}

/**
 * Template elements AST.
 */
type AST = Array<ASTNode | string>

export {
  AST,
  ASTNode,
  ASTNodeElementAttribute
}
