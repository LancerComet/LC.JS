/// <reference path="./directive.d.ts" />

import { isError } from 'util';
import { DIRECTIVE } from '../../core/config'
import { isFunction, nextTick } from '../../utils'
import { isEventDirective, isValueDirective } from './utils'

const directiveFlags = DIRECTIVE.flags
const directiveType = DIRECTIVE.type

/**
 * Create directive constructor.
 *
 * @param {IDirectiveOptions} option
 * @returns {Directive}
 */
function createDirectiveConstructor (option: IDirectiveOptions) {
  return class Directive {
    /**
     * ASTNode that uses this directive.
     *
     * @private
     * @type {ASTNode}
     */
    private astNode: ASTNode

    /**
     * Element that uses this directive.
     *
     * @private
     * @type {Element}
     */
    private element: Element

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
    install () {
      if (!this.isInstalled) {
        // Call onInstalled.
        isFunction(this.onInstalled) && this.onInstalled(
          this.astNode, this.element
        )
        this.isInstalled = true
      }
    }

    /**
     * Update directive values and set them to element.
     *
     * @param {*} newValue
     */
    update (newValue: any) {
      switch (this.type) {
        case directiveType.event:
          this.updateEvent(<Function> newValue)
          break

        case directiveType.value:
          this.updateValue(<string> newValue)
          break
      }

      if (isFunction(this.onUpdated)) {
        nextTick(() => {
          this.onUpdated(this.astNode, this.element)
        })
      }
    }

    uninstall () {
      isFunction(this.onUninstalled) && this.onUninstalled(
        this.astNode, this.element
      )
    }

    /**
     * Update function for event directive.
     *
     * @private
     */
    private updateEvent (newFunc: Function) {
      // TODO: ...
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

      switch (true) {
        case isEventDirective(this.name):
          this.nameInHTML = this.name.replace(
            directiveFlags.event, ''
          )
          this.type = directiveType.event
          break

        case isValueDirective(this.name):
          this.nameInHTML = this.name.replace(
            directiveFlags.value, ''
          )
          this.type = directiveType.value
          break
      }

      this.astNode = astNode
      this.element = element
      this.expression = expression

      this.onInstalled = option.onInstalled
      this.onUpdated = option.onUpdated
      this.onUninstalled = option.onUninstalled
    }
  }
}

export {
  createDirectiveConstructor
}
