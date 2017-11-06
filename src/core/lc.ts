/// <reference path="./lc.d.ts" />

import { ASTNode } from './ast/ast-node'
import { compileAstToElement, parseHTMLtoAST } from '../template'
import { nextTick } from '../utils'

/**
 * Base unit in LC.JS.
 * This is the base class to extend when you create a component class.
 *
 * @export
 * @class {Component} Class that performs base class of any component.
 */
class LC {
  /**
   * Component reference in this component.
   *
   * @type {$ComponentUsage}
   * @memberof LC
   */
  $components: $ComponentUsage

  /**
   * Elements of this component.
   *
   * @private
   * @type {DocumentFragment}
   * @memberof LC
   */
  $elements: DocumentFragment

  /**
   * Model storage.
   *
   * @type {{ [key: string]: ReactiveModel }}
   * @memberof LC
   */
  $models: $ComponentModels

  /**
   * Parent component.
   *
   * @type {LC}
   * @memberof LC
   */
  $parent: LC

  /**
   * Template string.
   *
   * @type {string}
   * @memberof LC
   */
  $template: string

  /**
   * AST.
   *
   * @private
   * @type {AST}
   * @memberof LC
   */
  private $ast: AST

  /**
   * Mouting element.
   *
   * @private
   * @type {Element}
   * @memberof LC
   */
  private $el: Element

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
    this.$ast && this.$ast.notify(this, keyName, newValue)
  }

  /**
   * Mount this component to target element.
   *
   * @param {string | Element | Node} element
   * @memberof LC
   */
  $mount (element: string | Element | Node) {
    // Get mounting element.
    const $el = typeof element === 'string'
      ? document.querySelector(element)
      : element

    if ($el) {
      nextTick(() => {
        const $elements = this.$elements
        const parent = $el.parentElement
        if (!parent) {
          return
        }
        parent.replaceChild($elements, $el)
        typeof this.mounted === 'function' && this.mounted()
      })
    }
  }

  /**
   * Lifecycle function executes before component is created.
   *
   * @memberof LC
   */
  created (): void {
  }

  /**
   * Lifecycle function executes after component has been mounted to HTML.
   *
   * @memberof LC
   */
  mounted (): void {
  }

  constructor () {
    // Move model to root level.
    // "$models" would be undefined when a new instance is created in decorator.
    // Just skip in this case.
    if (typeof this.$models === 'object') {
      moveModelToRootLevel(this, this.$models)
    }

    // Compile HTML template if it is given.
    const $template = this.$template
    if ($template) {
      const $components = this.$components
      this.$ast = parseHTMLtoAST($template, $components)  // Create AST.
      this.$elements = compileAstToElement(this.$ast, this, $components, this.$models)  // Create elements from AST.
    }

    nextTick(() => {
      // Hide private properties.
      hidePrivates(this)

      // Call created.
      typeof this.created === 'function' && this.created()
    })
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
  const $modelsKey = Object.keys($models)
  for (let i = 0, length = $modelsKey.length; i < length; i++) {
    const key = $modelsKey[i]
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
  }
}

/**
 * Hide private properties.
 *
 * @param {LC} target
 */
function hidePrivates (target: LC) {
  Object.keys(target).forEach(keyname => {
    if (keyname.indexOf('$') === 0) {
      Object.defineProperty(target, keyname, {
        enumerable: false
      })
    }
  })
}
