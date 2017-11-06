import { DirectiveConfig } from '../../core/config'
import { createDirective } from '../modules/directive'

function initIf (directiveStore: {[directiveName: string]: typeof Directive}) {
  const DIRECTIVE_NAME = `${DirectiveConfig.flags.internal}if`

  const If = createDirective({
    name: DIRECTIVE_NAME,
    isCustom: true
  })

  directiveStore[DIRECTIVE_NAME] = If
}

export {
  initIf
}
