/**
 * Directive config.
 *
 * @abstract
 * @class DIRECTIVE
 */
abstract class DIRECTIVE {
  static readonly type: {[typeName: string]: TDirectiveType} = {
    event: 'event',
    value: 'value'
  }

  static readonly flags = {
    event: '@',
    value: ':'
  }
}

/**
 * NodeType.
 *
 * @export
 * @abstract
 * @class NodeType
 */
abstract class NODE_TYPE {
  static readonly element = 1
  static readonly textNode = 3
  static readonly comment = 8
}

export {
  DIRECTIVE,
  NODE_TYPE
}
