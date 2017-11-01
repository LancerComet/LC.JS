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

// @click.
directives[eventFlag + 'click'] = createDirective({
  name: eventFlag + 'click',

  onInstall (directive: Directive) {
    const element = directive.element
    const handler = function (event) {
      const eventExec = directive.eventExec
      typeof eventExec === 'function' && eventExec()
    }
    element.addEventListener(directive.nameInHTML, handler)
    directive.eventBound = handler
  },

  onUpdated (directive: Directive, newEventExec: Function, $models: $ComponentModels) {
    if (typeof newEventExec === 'function') {
      console.log('bind click')
      directive.eventExec = function () {
        const scope = {}
        Object.keys($models).forEach(modelName => {
          scope[modelName] = $models[modelName].value
        })
        newEventExec.call(scope)
      }
    }
  },

  onUninstalled (directive: Directive) {
    const handler = directive.eventBound
    const element = directive.element
    if (element && handler) {
      element.removeEventListener(directive.nameInHTML, handler)
    }
  }
})

// directives[valueFlag + 'class'] = createDirective({
//   name: valueFlag + 'class',
//   onInstalled (astNode, element) {
//   },
//   onUpdated (astNode, element) {
//   },
//   onUninstalled (astNode, element) {
//   }
// })

// directives[valueFlag + 'style'] = createDirective({
//   name: valueFlag + 'style',
//   onInstalled (astNode, element, newValue) {
//     console.log('style installed: ', astNode)
//   },
//   onUpdated (astNode, element, newValue) {
//     console.log('style updated: ', newValue)
//   },
//   onUninstalled (astNode, element) {
//   }
// })

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
      isFunction(this.onInstall) && this.onInstall(this)
    }

    /**
     * Update directive values and set them to element.
     *
     * @param {*} newValue
     * @param {$ComponentModels} [$models]
     * @memberof Directive
     */
    update (newValue: any, $models?: $ComponentModels) {
      switch (this.type) {
        case directiveType.event:
          this.updateEvent(<Function> newValue, $models)
          break

        case directiveType.value:
          this.updateValue(<string> newValue)
          break
      }

      // Call onInstalled for first.
      if (!this.isInstalled) {
        isFunction(this.onInstalled) && this.onInstalled(this, newValue, $models)
        this.isInstalled = true
      }

      if (isFunction(this.onUpdated)) {
        nextTick(() => {
          this.onUpdated(this, newValue, $models)
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

    /**
     * Update function for event directive.
     *
     * @private
     * @param {Function} newFunc
     * @param {$ComponentModels} $models
     * @memberof Directive
     */
    private updateEvent (newFunc: Function, $models: $ComponentModels) {
    }

    /**
     * Update function for value directive.
     *
     * @private
     */
    private updateValue (newValue: string) {
      nextTick(() => {
        this.element.setAttribute(this.nameInHTML, newValue)
      })
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
