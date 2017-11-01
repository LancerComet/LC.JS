/**
 * Whether target is an array.
 *
 * @param {*} target
 * @returns
 */
function isArray (target: any) {
  return Array.isArray
    ? Array.isArray(target)
    : Object.prototype.toString.call('[Object Array]')
}

export {
  isArray
}
