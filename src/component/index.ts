/// <reference path="./index.d.ts" />

import { ReactiveModel } from './modules/reactive-model'
import { parseHTMLtoAST, createElementByASTNode } from '../template'
import { ASTNode, TemplateAST } from '../template/modules/ast-node'

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
    const astWithValue = transformAST(ast, this.$models)
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

    if (!el) { return }

    // Compile tempalte to component.
    const fragment = this.$compile()

    Promise.resolve().then(() => {
      el.innerHTML = ''
      el.appendChild(fragment)
    })
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
 * Fill expression in AST with target value.
 *
 * @param {TemplateAST} ast
 * @param {{[key: string]: ReactiveModel}} $models
 * @returns {TemplateAST}
 */
function transformAST (ast: TemplateAST, $models: {[key: string]: ReactiveModel}): TemplateAST {
  ast = ast.slice()
  ast.forEach((astNode: ASTNode | string, index: number) => {
    // If is a ASTNode, just go further.
    if (astNode instanceof ASTNode) {
      const transformedChildren = transformAST(astNode.children, $models)
      astNode.children = transformedChildren
      return
    }

    // "astNode" is a string. Means a TextNode.
    const expressions = astNode.match(/{{(\w|\d)+}}|{.+}/g)
    if (expressions) {
      const modelKeys = Object.keys($models)
      const modelValues = modelKeys.map(key => $models[key].value)

      expressions.forEach(expression => {
        const pureExpression = expression.replace(/{|}/g, '')  // {{name}} => name
        const model = $models[pureExpression]

        // Calculate value and replace mastache expression.
        const Func = new Function(
          modelKeys.join(','),
          'exp',
          'return eval(exp)'
        )
        const result = Func.apply(null, modelValues.concat(pureExpression))
        ast[index] = (<string> ast[index]).replace(expression, result)
      })
    }
  })

  return ast
}
