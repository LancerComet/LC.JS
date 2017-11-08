/// <reference path="./node.component.d.ts" />

import { ASTNode } from './node.base'
import { NodeType } from '../config'
import { hasTargetExpression, nextTick } from '../../utils'

class ASTNodeComponent extends ASTNode {
  ComponentCtor: ComponentClass
  componentInstance: LC
  nodeType = NodeType.comment
  props: ASTNodeProps

  /**
   * Create element for Component Node.
   *
   * @private
   * @memberof ASTNodeComponent
   */
  private createElement () {
    const element: Comment = document.createComment(this.id)
    this.element = element
  }

  /**
   * Mount target component.
   *
   * @memberof ASTNodeComponent
   */
  mountComponent () {
    const compInstance = this.componentInstance

    if (!this.$if || !compInstance) {
      return
    }

    // Access to component's element.
    const componentElements = (<AST> compInstance['$ast']).element
    if (!componentElements) {
      return
    }

    // Mount elements.
    nextTick(() => {
      const element = this.element
      const parent = element.parentElement
      if (!parent) { return }
      parent.insertBefore(componentElements, element)
      parent.removeChild(element)
      typeof compInstance.mounted === 'function' &&
        compInstance.mounted()
    })
  }

  unMountComponent () {
    const compInstance = this.componentInstance

    if (!compInstance) {
      return
    }

    const componentElements = (<AST> compInstance['$ast']).element
    if (!componentElements) {
      return
    }

    const parent = componentElements.parentElement

    // If no parent element, component must be never-mounted.
    if (!parent) {
      return
    }

    nextTick(() => {
      parent.insertBefore(this.element, componentElements)
      parent.removeChild(componentElements)
    })
  }

  update (specificExpression?: string, newValue?: any) {
    super.preUpdate(specificExpression, newValue)

    // Component node only need to check mounting status.
    this.$if
      ? this.mountComponent()
      : this.unMountComponent()

    // Check whether updates props.
    let goUpdateProps = false
    Object.keys(this.props).some(propName => {
      const propExpression = this.props[propName]
      if (hasTargetExpression(propExpression, specificExpression)) {
        goUpdateProps = true
        return goUpdateProps
      }
    })

    // Update compInstance's models.
    const compInstance = this.componentInstance
    if (goUpdateProps && compInstance) {
      (<AST> compInstance['$ast']).notify(specificExpression, newValue)
    }
  }

  constructor (param: IASTNodeComponent) {
    super(param)
    this.ComponentCtor = param.ComponentCtor
    this.componentInstance = param.componentInstance
    this.props = param.props || {}
    this.createElement()
  }
}

export {
  ASTNodeComponent
}
