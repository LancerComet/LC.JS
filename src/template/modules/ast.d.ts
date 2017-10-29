/**
 * AST Node.
 *
 * @class ASTNode
 */
declare class ASTNode {
  _id: string
  attributes: ASTNodeElementAttribute
  children: AST
  nodeType: ASTNodeType
  tagName: string
  textContent: string
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
  nodeType: ASTNodeType
  tagName: string
  textContent?: string
}

/**
 * AST Node Attribute.
 */
type ASTNodeElementAttribute = {[attribute: string]: string}

/**
 * AST Node type.
 */
type ASTNodeType = number

/**
 * Template elements AST.
 */
type AST = Array<ASTNode>
