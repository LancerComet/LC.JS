declare class Directive {
  /**
   * ASTNode that uses this directive.
   *
   * @type {ASTNode}
   */
  astNode: ASTNode

  /**
   * Directive expression.
   *
   * @private
   * @type {string}
   */
  expression: string

  /**
   * Element that uses this directive.
   *
   * @type {Element}
   */
  element: Element

  /**
   * Event exec function.
   * Only available for event directive.
   *
   * @type {Function}
   * @memberof Directive
   */
  eventExec: Function

  /**
   * Event that is bound.
   * This function is bound to element, for example "onlick", "onfocus".
   * Called when event is triggered, and will call "eventExec" next.
   * Only available for event directive.
   *
   * @type {EventListenerOrEventListenerObject}
   * @memberof Directive
   */
  eventBound: EventListenerOrEventListenerObject

  /**
   * Whether this is a custom directive.
   * A custom directive will be controlled by creator.
   * No internal funcitons will be executed.
   *
   * @type {boolean}
   * @memberof Directive
   */
  isCustom: boolean

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
   * This function will be called when this directive is going to be attached to element.
   * Will be called only once.
   *
   * @type {TDirectiveHook}
   */
  onInstall: TDirectiveHook

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
  onUninstall: TDirectiveHook

  /**
   * Install this directive to target ASTNode and element.
   */
  install (): void

  /**
   * Update directive values and set them to element.
   *
   * @param {*} newValue
   * @param {LC} component
   */
  update (newValue: any, component: LC): void

  /**
   * Uninstall directive from element.
   *
   * @memberof Directive
   */
  uninstall (): void

  /**
   * Creates an instance of Directive.
   *
   * @param {ASTNodeElement} astNode
   * @param {Element} element
   * @param {string} expression
   * @memberof Directive
   */
  constructor (astNode: ASTNodeElement, element: Element, expression: string)
}

/**
 * Directive type.
 */
type TDirectiveType = 'internal' | 'event' | 'value'

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
   * A custom directive will be controlled by creator.
   * No internal funcitons will be executed.
   *
   * @type {boolean}
   * @memberof IDirectiveOptions
   */
  isCustom?: boolean

  /**
   * This function will be called when this directive is going to be attached to element.
   * Will be called only once.
   *
   * @type {TDirectiveHook}
   * @memberof IDirectiveOptions
   */
  onInstall?: TDirectiveHook

  /**
   * This function will be called when this directive has been attached to element.
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
  onUninstall?: TDirectiveHook
}

/**
 * Directive-hook-function decleration.
 */
type TDirectiveHook = (directive: Directive, newValue?: any, component?: LC) => void
