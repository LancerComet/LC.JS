const supportPromise = typeof Promise !== 'undefined' && typeof Promise.resolve === 'function'

function nextTick (callback: Function) {
  const exec = function () {
    typeof callback === 'function' && callback()
  }
  if (supportPromise) {
    Promise.resolve().then(exec)
  } else {
    setTimeout(exec, 1)
  }
}

export {
  nextTick
}
