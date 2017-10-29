function nextTick (callback: Function) {
  Promise.resolve().then(function () {
    typeof callback === 'function' && callback()
  })
}

export {
  nextTick
}
