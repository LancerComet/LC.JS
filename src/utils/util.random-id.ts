function randomID () {
  return Math.floor(Math.random() * Date.now()).toString(16)
}

export {
  randomID
}
