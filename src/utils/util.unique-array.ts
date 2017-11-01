function uniqueArray (array: any[]) {
  const seen = {}
  const out = []
  const len = array.length
  let j = 0
  for(let i = 0; i < len; i++) {
    const item = array[i]
    if (seen[item] !== 1) {
      seen[item] = 1
      out[j++] = item
    }
  }

  return out
}

export {
  uniqueArray
}
