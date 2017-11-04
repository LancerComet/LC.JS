declare abstract class LC {
  /**
   * Components.
   *
   * @type {$ComponentUsage}
   * @memberof LC
   */
  $components: $ComponentUsage

  /**
   * Template.
   *
   * @type {string}
   * @memberof LC
   */
  $template: string

  /**
   * Keep all model reference.
   *
   * @type {$ComponentModels}
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
   * Mount this component to target element.
   *
   * @param {(string | Element)} element
   * @memberof LC
   */
  $mount (element: string | Element): void
}

/**
 * Model storage of a component.
 */
type $ComponentModels = {[key: string]: ReactiveModel}

/**
 * Component usage delcration of a component.
 */
type $ComponentUsage = {[key: string]: {
  reference: LC[]
  Constructor: ComponentClass
}}
