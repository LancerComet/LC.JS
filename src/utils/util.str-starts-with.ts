/**
 * Whether "str" is start with "flag".
 *
 * @param {string} str
 * @param {string} flag
 * @returns {boolean}
 */
function strStartsWith (str: string, flag: string): boolean {
  return str.indexOf(flag) === 0
}

export {
  strStartsWith
}
