/// <reference path="./index.d.ts" />

import { ASTNode } from '../template/modules/ast'

import { compile } from '../template'
import { nextTick } from '../utils/next-tick'

/**
 * Base unit in LC.JS.
 * This is the base class to extend when you create a component class.
 *
 * @export
 * @abstract
 * @class {Component} Class that performs base class of any component.
 */
abstract class LC {
  /**
   * Component reference in this component.
   *
   * @private
   * @type {$ComponentUsage}
   * @memberof LC
   */
  private $components: any

  /**
   * Mounter element.
   *
   * @private
   * @type {Element}
   * @memberof LC
   */
  private $el: Element

  /**
   * Model storage.
   *
   * @implements
   * @type {{ [key: string]: ReactiveModel }}
   * @memberof LC
   */
  private $models: $ComponentModels

  /**
   * Template string.
   *
   * @implements
   * @type {string}
   * @memberof LC
   */
  private $template: string

  /**
   * Create and render HTML.
   *
   * @private
   * @memberof LC
   */
  private $render () {
    const el = this.$el
    if (!el) { return }

    let $template = this.$template

    // Try to get template from el if $template is empty.
    if (!$template) {
      const tempElement = document.createElement('div')
      tempElement.appendChild(el.cloneNode(true))
      $template = tempElement.innerHTML
      this.$template = $template
    }

    // Compile tempalte to component.
    const fragment = compile($template, this.$components, this.$models)

    // Keep new $el reference.
    this.$el = fragment.firstElementChild || <Element> fragment.childNodes[0]  // IE fallback.

    nextTick(() => {
      const parent = el.parentElement
      parent.insertBefore(fragment, el)
      parent.removeChild(el)
    })
  }

  /**
   * Will be triggered when some model's value has been changed.
   * Called in ReactiveModels.
   *
   * @param {string} keyName
   * @param {*} newValue
   * @param {*} oldValue
   * @memberof LC
   */
  private $notify (keyName: string, newValue: any, oldValue: any) {
    // console.log(`${keyName} is changed, newValue: ${newValue}, oldValue: ${oldValue}`)
    this.$render()
  }

  /**
   * Mount this component to target element.
   *
   * @param {(string | Element)} element
   * @memberof LC
   */
  mount (element: string | Element) {
    // Get mounting element.
    const el = typeof element === 'string'
      ? document.querySelector(element)
      : element

    if (!el) {
      return
    }

    this.$el = el  // This node will be replaced after initialization.
    this.$render()
  }

  constructor () {
    // Move model to root level.
    // "$models" would be undefined when a new instance is created in decorator.
    // Just skip in this case.
    if (typeof this.$models === 'object') {
      moveModelToRootLevel(this, this.$models)
    }
  }
}

export {
  LC
}

/**
 * Move properties in $model to root level.
 * Save component reference to every single model.
 *
 * @param {LC} lc
 * @param {$ComponentModels} $models
 */
function moveModelToRootLevel (lc: LC, $models: $ComponentModels) {
  Object.keys($models).forEach(key => {
    const $model = $models[key]

    Object.defineProperty(lc, key, {
      enumerable: true,
      get: () => $model.value,
      set (newValue) {
        $model.value = newValue
      }
    })

    // Save component reference.
    $model.$component = lc
  })
}
