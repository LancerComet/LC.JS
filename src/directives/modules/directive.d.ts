declare class Directive {
  /**
   * Directive expression.
   *
   * @private
   * @type {string}
   */
  expression: string

  /**
   * Directive name.
   *
   * @type {string}
   * @example
   *  :class, @click, :style
   */
  name: string

  /**
   * Directive name in html.
   *
   * @type {string}
   * @example
   *  class, click, style
   */
  nameInHTML: string

  /**
   * Directive type.
   *
   * @type {TDirectiveType}
   */
  type: TDirectiveType

  /**
   * This function will be called when this directive is attached to element.
   * Will be called only once.
   *
   * @type {TDirectiveHook}
   */
  onInstalled: TDirectiveHook

  /**
   * This function will be called when its ASTNode is being updated.
   *
   * @type {TDirectiveHook}
   */
  onUpdated: TDirectiveHook

  /**
   * This function will be called when it's going to be unistalled from its ASTNode.
   *
   * @type {TDirectiveHook}
   */
  onUninstalled: TDirectiveHook

  /**
   * Install this directive to target ASTNode and element.
   */
  install (): void

  /**
   * Update directive values and set them to element.
   *
   * @param {*} newValue
   */
  update (newValue: any): void
}

/**
 * Directive type.
 */
type TDirectiveType = 'event' | 'value'

/**
 * Option for Directive Constructor.
 *
 * @interface IDirectiveOptions
 */
interface IDirectiveOptions {
  /**
   * Directive name.
   *
   * @type {string}
   * @memberof IDirectiveOptions
   * @example
   *  :class, @click
   */
  name: string

  /**
   * This function will be called when this directive is attached to element.
   * Will be called only once.
   *
   * @type {TDirectiveHook}
   * @memberof IDirectiveOptions
   */
  onInstalled?: TDirectiveHook

  /**
   * This function will be called when its ASTNode is being updated.
   *
   * @type {TDirectiveHook}
   * @memberof IDirectiveOptions
   */
  onUpdated?: TDirectiveHook

  /**
   * This function will be called when it's going to be unistalled from its ASTNode.
   *
   * @type {TDirectiveHook}
   * @memberof IDirectiveOptions
   */
  onUninstalled?: TDirectiveHook
}

/**
 * Directive-hook-function decleration.
 */
type TDirectiveHook = (astNode: ASTNode, element: Element) => void
