/// <reference path="./index.d.ts" />

import { ASTNode } from '../template/modules/ast'
import { compileAstToElement, parseHTMLtoAST } from '../template'
import { nextTick } from '../utils'

/**
 * Base unit in LC.JS.
 * This is the base class to extend when you create a component class.
 *
 * @abstract
 * @export
 * @class {Component} Class that performs base class of any component.
 */
abstract class LC {
  /**
   * Component reference in this component.
   *
   * @type {$ComponentUsage}
   * @memberof LC
   */
  $components: $ComponentUsage

  /**
   * Model storage.
   *
   * @type {{ [key: string]: ReactiveModel }}
   * @memberof LC
   */
  $models: $ComponentModels

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
   * Elements of this component.
   *
   * @private
   * @type {DocumentFragment}
   * @memberof LC
   */
  private $elements: DocumentFragment

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
    this.$notifyAST(this.$ast, keyName, newValue)
  }

  /**
   * Notify $ast to update ASTNodes in $ast.
   *
   * @private
   * @param {AST} ast
   * @param {string} keyName
   * @param {*} newValue
   * @memberof LC
   */
  private $notifyAST (ast: AST, keyName: string, newValue: any) {
    ast.forEach(astNode => {
      astNode.updateExec(this, keyName, newValue)
      this.$notifyAST(astNode.children, keyName, newValue)
    })
  }

  /**
   * Parent component.
   *
   * @type {LC}
   * @memberof LC
   */
  $parent: LC

  /**
   * Mount this component to target element.
   *
   * @param {(string | Element)} element
   * @memberof LC
   */
  $mount (element: string | Element) {
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
      })
    }
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
      this.$ast = createAST($template, $components)  // Create AST.
      this.$elements = compile(this.$ast, this, $components, this.$models)  // Create elements from AST.
    }

    // Hide private properties.
    nextTick(hidePrivates.bind(null, this))
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

/**
 * Create AST from HTML string.
 *
 * @param {string} htmlString
 * @param {$ComponentUsage} $components
 * @returns {AST}
 */
function createAST (htmlString: string, $components: $ComponentUsage): AST {
  return parseHTMLtoAST(htmlString, $components)
}

/**
 * Compile AST to element.
 *
 * @param {AST} ast
 * @param {LC} component
 * @param {$ComponentUsage} $components
 * @param {$ComponentModels} $models
 * @returns {DocumentFragment}
 */
function compile (ast: AST, component: LC, $components: $ComponentUsage, $models: $ComponentModels): DocumentFragment {
  return compileAstToElement(ast, component, $components, $models)
}
