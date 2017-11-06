declare class LC {
  /**
   * Components.
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
   * @param {(string | Element | Node)} element
   * @memberof LC
   */
  $mount (element: string | Element | Node): void

  /**
   * Lifecycle function executes before component is created.
   *
   * @memberof LC
   */
  created: () => void

  /**
   * Lifecycle function executes after component has been mounted to HTML.
   *
   * @memberof LC
   */
  mounted: () => void
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
