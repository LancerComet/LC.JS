/// <reference path="./directive.d.ts" />

import { DirectiveConfig } from '../../core/config'
import { isFunction, nextTick } from '../../utils'
import { isEventDirective, isValueDirective } from './utils'

import { initIf } from '../internal-directives/if'
import { initSlot } from '../internal-directives/slot'
import { initText } from '../internal-directives/text'
import { initModel } from '../internal-directives/@model'

const { event: eventFlag, value: valueFlag } = DirectiveConfig.flags
const directiveType = DirectiveConfig.type

/**
 * The object that keeps all directives.
 */
const directives: {[directiveName: string]: typeof Directive} = {}

// Create internal directives.
initIf(directives)
initText(directives)
initSlot(directives)
initModel(directives)

// slot.
directives['slot'] = createDirective({
  name: 'slot',
  isCustom: true
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
     * Whether this directive is installed to element.
     *
     * @type {boolean}
     */
    private isInstalled: boolean

    astNode: ASTNode
    expression: string
    element: Element
    eventExec: Function
    eventBound: EventListenerOrEventListenerObject
    isCustom: boolean
    name: string
    nameInHTML: string
    type: TDirectiveType
    onInstall: TDirectiveHook
    onInstalled: TDirectiveHook
    onUpdated: TDirectiveHook
    onUninstall: TDirectiveHook

    install () {
      if (this.isCustom) {
        isFunction(this.onInstall) && this.onInstall(this)
        return
      }

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

    update (newValue: any, component: LC) {
      if (!this.isCustom) {
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

    uninstall () {
      isFunction(this.onUninstall) && this.onUninstall(this)
    }

    constructor (astNode: ASTNode, element: Element, expression: string) {
      this.name = option.name
      this.isCustom = !!option.isCustom

      this.astNode = astNode
      this.element = element
      this.expression = expression

      this.type = type
      this.nameInHTML = nameInHTML

      this.onInstall = option.onInstall
      this.onInstalled = option.onInstalled
      this.onUpdated = option.onUpdated
      this.onUninstall = option.onUninstall
    }
  }

  // Save this class to directives.
  directives[directiveName] = Directive

  return Directive
}

/**
 * Get decorators from directive name.
 *
 * @param {string} directiveName
 * @return {string[]}
 */
function getDecorators (directiveName: string): string[] {
  return (
    directiveName.match(/\.\w+/g) || []
  ).map(item => item.replace('.', ''))
}

export {
  createDirective,
  directives,
  getDecorators
}
