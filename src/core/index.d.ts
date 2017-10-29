declare class LC {
  /**
   * Component usage.
   *
   * @private
   * @type {{[key: string]: Function}}
   * @memberof LC
   */
  private $components: $ComponentUsage

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
   * Move models to root level.
   *
   * @private
   * @memberof LC
   */
  private $moveModelToRootLevel (): void

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
type $ComponentUsage = {[key: string]: Function}
