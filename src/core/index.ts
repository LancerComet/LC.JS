/// <reference path="./index.d.ts" />
import { Packet } from '_debugger';

import { ASTNode } from '../template/modules/ast'

import { compileAstToElement, parseHTMLtoAST } from '../template'
import { nextTick } from '../utils/next-tick'

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
   * @private
   * @type {$ComponentUsage}
   * @memberof LC
   */
  private $components: any

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
      astNode.setSingleExpressionValue(this.$models, keyName, newValue)
      this.$notifyAST(astNode.children, keyName, newValue)
    })
  }

  /**
   * Generate AST.
   *
   * @private
   * @memberof LC
   */
  private $createAST () {
    let $template = this.$template
    if (!$template) {
      return
    }

    const ast = parseHTMLtoAST($template, this.$components)
    this.$ast = ast
  }

  /**
   * Compile AST.
   *
   * @private
   * @memberof LC
   */
  private $compile () {
    const ast = this.$ast
    if (!ast) {
      return
    }

    this.$elements = compileAstToElement(ast, this.$components, this.$models)
  }

  /**
   * Mount this component to target element.
   *
   * @param {(string | Element)} element
   * @memberof LC
   */
  mount (element: string | Element) {
    // Get mounting element.
    const $el = typeof element === 'string'
      ? document.querySelector(element)
      : element

    $el && nextTick(() => {
      const $elements = this.$elements
      const parent = $el.parentElement
      if (!parent) {
        return
      }
      parent.insertBefore($elements, $el)
      parent.removeChild($el)
    })
  }

  constructor () {
    // Move model to root level.
    // "$models" would be undefined when a new instance is created in decorator.
    // Just skip in this case.
    if (typeof this.$models === 'object') {
      moveModelToRootLevel(this, this.$models)
    }

    this.$createAST()
    this.$compile()

    // Hide private properties.
    nextTick(() => hidePrivates(this))
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
