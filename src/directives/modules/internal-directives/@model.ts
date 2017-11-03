import { DirectiveConfig } from '../../../core/config'
import { createDirective } from '../directive'

function initModel (directiveStore: {[directiveName: string]: typeof Directive}) {
  const DIRECTIVE_NAME = DirectiveConfig.flags.event + 'model'

  const Model = createDirective({
    name: DIRECTIVE_NAME,

    onInstall (directive: Directive) {
      const element = directive.element
      const handler = event => {
        const eventExec = directive.eventExec
        typeof eventExec === 'function' && eventExec(event)
      }
      directive.eventBound = handler
      element.addEventListener('input', handler)
    },

    onInstalled (directive: Directive, newValue: any, component: LC) {
      directive.eventExec = function (event) {
        const keyName = directive.expression
        const $model = <ReactiveModel> (component)['$models'][keyName]
        let newValue: any = (<HTMLInputElement> event.target).value

        // Detect decorators.
        const decorators = directive.astNode.attributes[DIRECTIVE_NAME].decorators

        // Number decorator.
        if (decorators.indexOf('number') > -1) {
          newValue = parseInt(newValue || 0)
        }

        // Trim decorator.
        if (decorators.indexOf('trim') > -1) {
          newValue = newValue.trim()
        }

        $model.value = newValue
      }
    },

    onUpdated (directive: Directive, newValue: any, component: LC) {
      const element = <HTMLInputElement> directive.element
      element.value = newValue
    }
  })

  directiveStore[DIRECTIVE_NAME] = Model
}

export {
  initModel
}
