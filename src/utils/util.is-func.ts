/**
 * Whether some variable is a function.
 *
 * @param {*} target
 * @returns
 */
function isFunction (target: any) {
  return typeof target === 'function'
}

export {
  isFunction
}
