/**
 * Evaluate expression result.
 *
 * @param {string[]} variableName
 * @param {any[]} variableValue
 * @param {string} expression
 * @returns
 */
function evaluateExpression (variableName: string[], variableValue: any[], expression: string) {
  const evalFunc = Function.apply(
    null,
    variableName.concat('try { return ' + expression + '} catch (error) { return "" }')
  )
  const result = evalFunc.apply(null, variableValue)
  return result
}

export {
  evaluateExpression
}
