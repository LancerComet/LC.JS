/**
 * Directive config.
 *
 * @abstract
 * @class DIRECTIVE
 */
abstract class DirectiveConfig {
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
abstract class NodeType {
  static readonly element = 1
  static readonly textNode = 3
  static readonly comment = 8
}

/**
 * Parser configuration.
 *
 * @abstract
 * @class Parser
 */
abstract class Parser {
  static readonly reservedElements = ['slot']

  /**
   * Whether target is a reserved element.
   *
   * @static
   * @param {string} tagName
   * @returns
   * @memberof Parser
   */
  static isReservedElement (tagName: string) {
    return Parser.reservedElements.indexOf(tagName)
  }
}

export {
  DirectiveConfig,
  NodeType,
  Parser
}
