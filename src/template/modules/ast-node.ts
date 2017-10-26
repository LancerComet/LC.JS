import { TElementAttribute } from './tokenizer'

/**
 * AST Node.
 *
 * @class ASTNode
 */
class ASTNode {
  _id: string
  attributes: TElementAttribute
  children: TemplateAST
  tagName: string

  constructor (params: IASTNodeOption) {
    this._id = params._id
    this.attributes = params.attributes || {}
    this.children = this.children || []
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
  attributes?: TElementAttribute
  children?: TemplateAST
  tagName: string
}

/**
 * Template elements AST.
 */
type TemplateAST = Array<ASTNode | string>

export {
  ASTNode,
  TemplateAST
}
