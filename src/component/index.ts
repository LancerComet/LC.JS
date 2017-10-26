/// <reference path="./index.d.ts" />

import { ReactiveModel } from './modules/reactive-model'
import { parseHTMLtoAST, createElementByASTNode } from '../template'
import { ASTNode, TTemplateAST } from '../template/modules/ast-node'

/**
 * Reserved Properties in component.
 */
const reservedProps = [
  '$models'
]

/**
 * LC.JS.
 * Class LC is the basic class of a component.
 * You should extend this class to create a component class.
 *
 * @class {LC} Class that performs basic class of any component.
 */
class LC {
  $models: { [key: string]: ReactiveModel }

  /**
   * Template of this component.
   *
   * @type {string}
   * @memberof LC
   */
  template: string = ''

  /**
   * Compile tempalte to elements.
   *
   * @memberof LC
   */
  $compile (): DocumentFragment {
    // Create AST from component's template.
    const ast = parseHTMLtoAST(this.template)

    // Transform ast to element.
    const fragment = document.createDocumentFragment()
    const astWithValue = fillExpressionWithValue(ast, this.$models)
    astWithValue.forEach(astNode => {
      const element = createElementByASTNode(astNode)
      fragment.appendChild(element)
    })

    return fragment
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

    // Compile tempalte to component.
    const fragment = this.$compile()

    el.innerHTML = ''
    el.appendChild(fragment)
  }
}

/**
 * Component.
 * Use this decorator to create a component.
 *
 * @template T
 * @param {T} ClassCreatedByUser
 * @returns {class}
 */
function Component<T extends {new (...args:any[]): any}> (ClassCreatedByUser: T) {
  const instance = new ClassCreatedByUser()

  // Transform property to TComponentModels.
  const keys = Object.keys(instance)
  const models: TComponentModels = {}

  for (let i = 0, length = keys.length; i < length; i++) {
    const key = keys[i]
    const value = instance[key]

    if (value === null || value === undefined) {
      console.error(`[${process.env.NAME}] You should provide an initial value for your model "${key}".`)
      continue
    }

    // Switch value type, method or model.
    // Methods.
    if (typeof value === 'function') {
      // TODO: deal with function.
      continue
    }

    // Model.
    models[key] = {
      type: instance[key].constructor,
      default: instance[key]
    }
  }

  return class Component extends ClassCreatedByUser {
    /** Model storage. */
    private $models: { [key: string]: ReactiveModel } = {}

    /** Initialize model. */
    private initModels (models: TComponentModels) {
      for (let i = 0, length = keys.length; i < length; i++) {
        const key = keys[i]
        // if (!checkVaildKeyName(key)) {
        //   if (process.env.NODE_ENV === 'development') {
        //     console.error(
        //       `[${process.env.NAME}] "${key}" is invaild: A model's name cannot start with "$" or "_".`
        //     )
        //   }
        //   continue
        // }

        const model = models[key]
        const reactiveModel = new ReactiveModel(key, model)
        this.$models[key] = reactiveModel

        // Set model to root level.
        Object.defineProperty(this, key, {
          enumerable: true,
          get: () => reactiveModel.value,
          set: value => {
            reactiveModel.value = value
          }
        })
      }
    }

    /** Hide the privates. */
    private hidePrivateProps () {
      reservedProps.forEach(key => {
        Object.defineProperty(this, key, {
          configurable: false,
          enumerable: false
        })
      })
    }

    /**
     * Creates an instance of Component.
     * @memberof Component
     */
    constructor (...args) {
      super(...args)
      this.hidePrivateProps()
      this.initModels(models)
    }
  }
}

export {
  Component,
  LC
}

/**
 * Whether this keyname is vaild.
 *
 * @param {string} keyName
 * @returns {boolean}
 */
function checkVaildKeyName (keyName: string): boolean {
  return keyName.indexOf('$') !== 0 &&
    keyName.indexOf('_') !== 0
}

/**
 * Fill expression in ASTNode with target value.
 *
 * @param {TTemplateAST} ast
 * @param {{[key: string]: ReactiveModel}} $models
 * @returns {TTemplateAST}
 */
function fillExpressionWithValue (ast: TTemplateAST, $models: {[key: string]: ReactiveModel}): TTemplateAST {
  ast = ast.slice()
  ast.forEach((astNode, index) => {
    // 如果是文本节点则直接替换.
    switch (typeof astNode) {
      case 'string':
        // 获取模板中的所有插值表达式中的变量.
        const expressions = (<string> astNode).match(/{{.+}}/g)
        if (expressions) {
          expressions.forEach(expression => {
            const model = $models[expression.replace(/{|}/g, '')]
            if (!model) { return }

            // 如果变量存在于用户的 model 则进行赋值.
            ast[index] = (<string> ast[index]).replace(new RegExp(expression), model.value)
          })
        }
      break

      // 如果是 Element 则需要继续遍历递归.
      case 'object':
        const children = (<ASTNode> astNode).children
        ;(<ASTNode> ast[index]).children = fillExpressionWithValue(children, $models)
      break
    }
  })

  return ast
}
