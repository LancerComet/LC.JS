declare abstract class LC {
  /**
   * Mount this component to target element.
   *
   * @param {(string | Element)} element
   * @memberof LC
   */
  mount (element: string | Element): void
}

/**
 * Base properties in class LC.
 *
 * @interface ILcBaseProperty
 */
interface ILcBaseProperties {
  $components: $ComponentUsage
  $template: string
  $models: $ComponentModels
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
  Constructor: new () => LC
}}
