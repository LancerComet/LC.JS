function randomID () {
  return Math.floor(Math.random() * 10000 * Date.now()).toString(16)
}

export {
  randomID
}
