/// <reference path="./directive.d.ts" />

import { DIRECTIVE } from '../../core/config'
import { isFunction, nextTick } from '../../utils'
import { isEventDirective, isValueDirective } from './utils'

const { event: eventFlag, value: valueFlag } = DIRECTIVE.flags
const directiveType = DIRECTIVE.type

/**
 * The object that keeps all directives.
 */
const directives = {}

// Create intenral directives.
// @model
directives[eventFlag + 'model'] = createDirective({
  name: eventFlag + 'model',

  onInstall (directive) {
    const element = directive.element
    const handler = event => {
      const eventExec = directive.eventExec
      typeof eventExec === 'function' && eventExec(event)
    }
    directive.eventBound = handler
    element.addEventListener('input', handler)
  },

  onInstalled (directive, newValue, component) {
    directive.eventExec = function (event) {
      const keyName = directive.expression
      const newValue = (<HTMLInputElement> event.target).value
      const $model = <ReactiveModel> (component)['$models'][keyName]
      $model.value = newValue
    }
  },

  onUpdated (directive, newValue, component) {
    const element = <HTMLInputElement> directive.element
    element.value = newValue
  }
})

/**
 * Create directive constructor.
 *
 * @param {IDirectiveOptions} option
 */
function createDirective (option: IDirectiveOptions) {
  const directiveName = option.name
  if (directives[directiveName]) {
    return directives[directiveName]
  }

  let type = null
  let nameInHTML = ''
  switch (true) {
    case isEventDirective(directiveName):
      nameInHTML = directiveName.replace(eventFlag, '')
      type = directiveType.event
      break

    case isValueDirective(directiveName):
      nameInHTML = directiveName.replace(valueFlag, '')
      type = directiveType.value
      break
  }

  /**
   * Class for creating a directive.
   *
   * @class Directive
   */
  class Directive {
    /**
     * ASTNode that uses this directive.
     *
     * @private
     * @type {ASTNode}
     */
    private astNode: ASTNode

    /**
     * Whether this directive is installed to element.
     *
     * @type {boolean}
     */
    private isInstalled: boolean

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
     * This function will be called when this directive has been attached to element.
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
     *
     * @memberof Directive
     */
    install () {
      switch (this.type) {
        // Event type. Bind event to element.
        case directiveType.event:
          const handler = (event) => {
            const eventExec = this.eventExec
            typeof eventExec === 'function' && eventExec(event)
          }
          this.element.addEventListener(this.nameInHTML, handler)
          this.eventBound = handler
          isFunction(this.onInstall) && this.onInstall(this)
          break

        // Value type. Seems to do nothing.
        case directiveType.value:
        break
      }
    }

    /**
     * Update directive values and set them to element.
     *
     * @param {*} newValue
     * @param {LC} component
     * @memberof Directive
     */
    update (newValue: any, component: LC) {
      switch (this.type) {
        case directiveType.event:
          if (typeof newValue === 'function') {
            this.eventExec = function () {
              newValue.call(component)
            }
          }
          break

        case directiveType.value:
          nextTick(() => {
            this.element.setAttribute(this.nameInHTML, newValue)
          })
          break
      }

      // Call onInstalled for first.
      if (!this.isInstalled) {
        isFunction(this.onInstalled) && nextTick(() => {
          this.onInstalled(this, newValue, component)
        })
        this.isInstalled = true
      }

      // Call onUpdate.
      if (isFunction(this.onUpdated)) {
        nextTick(() => {
          this.onUpdated(this, newValue, component)
        })
      }
    }

    /**
     * Uninstall directive from element.
     *
     * @memberof Directive
     */
    uninstall () {
      isFunction(this.onUninstalled) && this.onUninstalled(this)
    }

    constructor (astNode: ASTNode, element: Element, expression: string) {
      this.name = option.name

      this.astNode = astNode
      this.element = element
      this.expression = expression

      this.type = type
      this.nameInHTML = nameInHTML

      this.onInstall = option.onInstall
      this.onInstalled = option.onInstalled
      this.onUpdated = option.onUpdated
      this.onUninstalled = option.onUninstalled
    }
  }

  // Save this class to directives.
  directives[directiveName] = Directive

  return Directive
}

export {
  createDirective,
  directives
}
